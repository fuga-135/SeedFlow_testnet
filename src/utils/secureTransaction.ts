import {
  Connection,
  Transaction,
  PublicKey,
  Keypair,
  sendAndConfirmTransaction,
  TransactionInstruction,
  ComputeBudgetProgram
} from '@solana/web3.js';

// エラー型定義
interface TransactionError {
  code: string;
  message: string;
  details?: string;
}

/**
 * セキュアなトランザクション送信
 * @param connection Solana接続オブジェクト
 * @param transaction 署名前のトランザクション
 * @param feePayer 手数料支払者
 * @param signers 署名者リスト
 * @returns トランザクションシグネチャまたはエラー
 */
export const sendSecureTransaction = async (
  connection: Connection,
  transaction: Transaction,
  feePayer: PublicKey,
  signers: Keypair[]
): Promise<{ success: boolean; signature?: string; error?: TransactionError }> => {
  try {
    // 1. 最新のブロックハッシュを取得
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = feePayer;

    // 2. コンピューティングバジェットの設定（DoS攻撃対策）
    const computeBudgetInstruction = ComputeBudgetProgram.setComputeUnitLimit({
      units: 200000 // 標準的なユニット数
    });
    transaction.add(computeBudgetInstruction);

    // 3. トランザクションデータのバリデーション
    validateTransaction(transaction);

    // 4. トランザクションの送信と確認
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers,
      {
        skipPreflight: false, // プリフライトチェックを有効化
        preflightCommitment: 'confirmed',
        maxRetries: 3,
        commitment: 'confirmed'
      }
    );

    // 5. トランザクションの確認を待機
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    });

    return { success: true, signature };
  } catch (err: any) {
    console.error('Secure transaction failed:', err);
    
    return {
      success: false,
      error: {
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message || 'トランザクションの処理中にエラーが発生しました',
        details: JSON.stringify(err)
      }
    };
  }
};

/**
 * トランザクションのバリデーション
 * @param transaction 検証するトランザクション
 */
const validateTransaction = (transaction: Transaction): void => {
  // 1. トランザクションサイズの検証
  if (transaction.serializeMessage().length > 1232) {
    throw new Error('トランザクションサイズが大きすぎます');
  }

  // 2. 命令数の検証
  if (transaction.instructions.length === 0) {
    throw new Error('トランザクションに命令が含まれていません');
  }

  // 3. 命令の最大数を制限
  if (transaction.instructions.length > 20) {
    throw new Error('トランザクションの命令数が多すぎます');
  }

  // 4. 各命令のデータサイズを検証
  for (const instruction of transaction.instructions) {
    if (instruction.data.length > 1024) {
      throw new Error('命令データサイズが大きすぎます');
    }
  }
};

/**
 * トランザクションの署名を検証
 * @param signature 検証する署名
 * @param connection Solana接続オブジェクト
 * @returns 検証結果
 */
export const verifyTransactionSignature = async (
  signature: string,
  connection: Connection
): Promise<boolean> => {
  try {
    const status = await connection.getSignatureStatus(signature);
    
    if (!status || !status.value) {
      return false;
    }
    
    // 確認済みステータスチェック
    return status.value.confirmationStatus === 'confirmed' || 
           status.value.confirmationStatus === 'finalized';
  } catch (err) {
    console.error('Signature verification failed:', err);
    return false;
  }
};

/**
 * トランザクションレート制限ユーティリティ
 * レート制限を実装して、短時間に多数のトランザクションを送信するのを防止
 */
export class TransactionRateLimiter {
  private transactions: { timestamp: number }[] = [];
  private readonly maxTransactions: number;
  private readonly timeWindowMs: number;

  constructor(maxTransactions: number = 10, timeWindowSeconds: number = 10) {
    this.maxTransactions = maxTransactions;
    this.timeWindowMs = timeWindowSeconds * 1000;
  }

  /**
   * 新しいトランザクションを試行できるか確認
   * @returns 許可されるかどうか
   */
  public canMakeTransaction(): boolean {
    const now = Date.now();
    
    // 時間枠外のトランザクションを削除
    this.transactions = this.transactions.filter(
      tx => now - tx.timestamp < this.timeWindowMs
    );
    
    // 最大数をチェック
    return this.transactions.length < this.maxTransactions;
  }

  /**
   * 新しいトランザクションを記録
   */
  public recordTransaction(): void {
    this.transactions.push({ timestamp: Date.now() });
  }
} 