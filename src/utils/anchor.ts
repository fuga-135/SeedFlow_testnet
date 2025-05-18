import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils, BN } from '@project-serum/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import idl from '../idl/seedflow.json';

// プログラムIDをSeedFlowプログラムのIDに設定
const programId = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

// カスタムフックでAnchorプログラムを提供
export function useAnchorProgram() {
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    if (wallet) {
      const connection = new Connection(process.env.REACT_APP_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
      const provider = new AnchorProvider(
        connection, 
        wallet, 
        { commitment: 'processed' }
      );
      
      // @ts-ignore - IDLの型が合わないためエラーを無視
      const program = new Program(idl, programId, provider);
      setProgram(program);
    } else {
      setProgram(null);
    }
  }, [wallet]);

  return program;
}

// PDAsの生成
export const findLoanAccount = async (borrower: PublicKey, seed = 'loan') => {
  return await PublicKey.findProgramAddressSync(
    [borrower.toBuffer(), utils.bytes.utf8.encode(seed)],
    programId
  );
};

// 保険設定のパラメータを型付け
export interface InsuranceConfigParams {
  insuranceType: number; // 0: Weather, 1: Crop, 2: Business
  minRainMm: number;
  maxRainMm: number;
  coverageCap: number;
  deductibleBps: number;
  premiumSchedule: number; // 0: Monthly, 1: LumpSum
  measurementPeriodDays: number;
}

// ローン初期化用関数
export const initializeLoan = async (
  program: Program,
  borrower: PublicKey,
  amount: number,
  duration: number,
  insuranceConfig: InsuranceConfigParams
) => {
  const [loanPda] = await findLoanAccount(borrower);
  
  return await program.methods
    .initializeLoan(
      new BN(amount),
      new BN(duration),
      {
        insuranceType: insuranceConfig.insuranceType,
        minRainMm: new BN(insuranceConfig.minRainMm),
        maxRainMm: new BN(insuranceConfig.maxRainMm),
        coverageCap: new BN(insuranceConfig.coverageCap),
        deductibleBps: insuranceConfig.deductibleBps,
        premiumSchedule: insuranceConfig.premiumSchedule,
        measurementPeriodDays: insuranceConfig.measurementPeriodDays
      }
    )
    .accounts({
      borrower: borrower,
      loan: loanPda,
      // その他必要なアカウント情報を追加
    })
    .rpc();
};

// ローン返済用関数
export const repayLoan = async (
  program: Program,
  borrower: PublicKey,
  amount: number
) => {
  const [loanPda] = await findLoanAccount(borrower);
  
  return await program.methods
    .repayLoan(new BN(amount))
    .accounts({
      loan: loanPda,
      borrower: borrower,
      // その他必要なアカウント情報を追加
    })
    .rpc();
};

// 保険請求処理関数
export const processInsuranceClaim = async (
  program: Program,
  loanPda: PublicKey,
  oracleData: any[]
) => {
  return await program.methods
    .processInsuranceClaim(oracleData)
    .accounts({
      loan: loanPda,
      // その他必要なアカウント情報を追加
    })
    .rpc();
}; 