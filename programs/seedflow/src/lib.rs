use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use std::collections::HashMap;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod seedflow {
    use super::*;

    pub fn initialize_loan(
        ctx: Context<InitializeLoan>,
        amount: u64,
        duration: i64,
        insurance_config: InsuranceConfig,
    ) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        loan.borrower = ctx.accounts.borrower.key();
        loan.amount = amount;
        loan.start_date = Clock::get()?.unix_timestamp;
        loan.end_date = loan.start_date + duration;
        loan.status = LoanStatus::Active;
        loan.insurance_config = insurance_config;

        // Transfer tokens from borrower to loan account
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.borrower_token_account.to_account_info(),
                to: ctx.accounts.loan_token_account.to_account_info(),
                authority: ctx.accounts.borrower.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        Ok(())
    }

    pub fn process_insurance_claim(
        ctx: Context<ProcessInsuranceClaim>,
        oracle_data: Vec<OracleData>,
    ) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        require!(loan.status == LoanStatus::Active, ErrorCode::InvalidLoanStatus);

        // Aggregate oracle data
        let aggregated_data = aggregate_oracle_data(&oracle_data)?;
        
        // Verify oracle data and process claim
        match loan.insurance_config.insurance_type {
            InsuranceType::Weather => {
                if should_trigger_weather_claim(&aggregated_data, &loan.insurance_config) {
                    loan.status = LoanStatus::InsuranceClaimed;
                    process_insurance_payout(ctx, loan)?;
                }
            }
            InsuranceType::Crop => {
                if should_trigger_crop_claim(&aggregated_data, &loan.insurance_config) {
                    loan.status = LoanStatus::InsuranceClaimed;
                    process_insurance_payout(ctx, loan)?;
                }
            }
            InsuranceType::Business => {
                if should_trigger_business_claim(&aggregated_data, &loan.insurance_config) {
                    loan.status = LoanStatus::InsuranceClaimed;
                    process_insurance_payout(ctx, loan)?;
                }
            }
        }

        Ok(())
    }

    pub fn repay_loan(ctx: Context<RepayLoan>, amount: u64) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        require!(loan.status == LoanStatus::Active, ErrorCode::InvalidLoanStatus);

        // Transfer tokens from borrower to loan account
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.borrower_token_account.to_account_info(),
                to: ctx.accounts.loan_token_account.to_account_info(),
                authority: ctx.accounts.borrower.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        if amount >= loan.amount {
            loan.status = LoanStatus::Paid;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeLoan<'info> {
    #[account(mut)]
    pub borrower: Signer<'info>,
    #[account(
        init,
        payer = borrower,
        space = 8 + Loan::LEN
    )]
    pub loan: Account<'info, Loan>,
    #[account(mut)]
    pub borrower_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub loan_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ProcessInsuranceClaim<'info> {
    #[account(mut)]
    pub loan: Account<'info, Loan>,
    pub oracle: Signer<'info>,
}

#[derive(Accounts)]
pub struct RepayLoan<'info> {
    #[account(mut)]
    pub loan: Account<'info, Loan>,
    #[account(mut)]
    pub borrower: Signer<'info>,
    #[account(mut)]
    pub borrower_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub loan_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Loan {
    pub borrower: Pubkey,
    pub amount: u64,
    pub start_date: i64,
    pub end_date: i64,
    pub status: LoanStatus,
    pub insurance_config: InsuranceConfig,
}

impl Loan {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 1 + InsuranceConfig::LEN;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum LoanStatus {
    Active,
    Paid,
    Defaulted,
    InsuranceClaimed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum InsuranceType {
    Weather,
    Crop,
    Business,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InsuranceConfig {
    pub insurance_type: InsuranceType,
    pub min_rain_mm: u64,
    pub max_rain_mm: u64,
    pub coverage_cap: u64,
    pub deductible_bps: u16,
    pub premium_schedule: PremiumSchedule,
    pub measurement_period_days: u16,
}

impl InsuranceConfig {
    pub const LEN: usize = 1 + 8 + 8 + 8 + 2 + 1 + 2;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum PremiumSchedule {
    Monthly,
    LumpSum,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct OracleData {
    pub provider: OracleProvider,
    pub timestamp: i64,
    pub weather_condition: WeatherCondition,
    pub rain_amount_mm: u64,
    pub crop_yield: u64,
    pub expected_yield: u64,
    pub business_performance: u64,
    pub expected_performance: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum OracleProvider {
    Pyth,
    Switchboard,
    Chainlink,
}

#[derive(AnchorSerialize, AnchorDeserialize, PartialEq, Eq)]
pub enum WeatherCondition {
    Normal,
    Adverse,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid loan status for this operation")]
    InvalidLoanStatus,
    #[msg("Invalid oracle data")]
    InvalidOracleData,
    #[msg("Insufficient oracle consensus")]
    InsufficientOracleConsensus,
}

// Helper functions for oracle data aggregation
fn aggregate_oracle_data(data: &[OracleData]) -> Result<OracleData> {
    require!(!data.is_empty(), ErrorCode::InvalidOracleData);
    
    // Calculate median for numerical values
    let rain_amounts: Vec<u64> = data.iter().map(|d| d.rain_amount_mm).collect();
    let median_rain = calculate_median(&rain_amounts)?;
    
    // Use weighted voting for weather condition
    let weather_condition = determine_weather_condition(data)?;
    
    // Create aggregated data
    Ok(OracleData {
        provider: OracleProvider::Pyth, // Default provider for aggregated data
        timestamp: Clock::get()?.unix_timestamp,
        weather_condition,
        rain_amount_mm: median_rain,
        crop_yield: 0, // Implement similar aggregation for other fields
        expected_yield: 0,
        business_performance: 0,
        expected_performance: 0,
    })
}

fn calculate_median(values: &[u64]) -> Result<u64> {
    let mut sorted = values.to_vec();
    sorted.sort_unstable();
    let mid = sorted.len() / 2;
    if sorted.len() % 2 == 0 {
        Ok((sorted[mid - 1] + sorted[mid]) / 2)
    } else {
        Ok(sorted[mid])
    }
}

fn determine_weather_condition(data: &[OracleData]) -> Result<WeatherCondition> {
    let mut adverse_count = 0;
    for d in data {
        if d.weather_condition == WeatherCondition::Adverse {
            adverse_count += 1;
        }
    }
    
    // Require at least 2/3 consensus for adverse condition
    if adverse_count * 3 >= data.len() * 2 {
        Ok(WeatherCondition::Adverse)
    } else {
        Ok(WeatherCondition::Normal)
    }
}

// Helper functions for claim processing
fn should_trigger_weather_claim(data: &OracleData, config: &InsuranceConfig) -> bool {
    data.weather_condition == WeatherCondition::Adverse &&
    data.rain_amount_mm < config.min_rain_mm
}

fn should_trigger_crop_claim(data: &OracleData, config: &InsuranceConfig) -> bool {
    data.crop_yield < data.expected_yield * (100 - config.deductible_bps as u64) / 100
}

fn should_trigger_business_claim(data: &OracleData, config: &InsuranceConfig) -> bool {
    data.business_performance < data.expected_performance * (100 - config.deductible_bps as u64) / 100
}

fn process_insurance_payout(ctx: Context<ProcessInsuranceClaim>, loan: &mut Account<Loan>) -> Result<()> {
    // Calculate payout amount based on insurance config
    let payout_amount = calculate_payout_amount(loan)?;
    
    // Transfer payout to borrower
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.loan_token_account.to_account_info(),
            to: ctx.accounts.borrower_token_account.to_account_info(),
            authority: ctx.accounts.oracle.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, payout_amount)?;
    
    Ok(())
}

fn calculate_payout_amount(loan: &Account<Loan>) -> Result<u64> {
    // Implement payout calculation logic based on insurance config
    Ok(loan.amount.min(loan.insurance_config.coverage_cap))
} 