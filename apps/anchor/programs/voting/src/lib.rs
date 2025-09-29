#![allow(deprecated)]
use anchor_lang::prelude::*;

declare_id!("Dkx6rMoHVhkPc1zzU8u7LxNFJ4NhBj3w7fNkNUhzDZDn");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;
pub const POLL_SEED: &[u8] = b"poll";
pub const CANDIDATE_SEED: &[u8] = b"candidate";
pub const VOTE_SEED: &[u8] = b"vote";
pub const POLL_COUNTER_SEED: &[u8] = b"poll_counter";
pub const CLOSE_POLL_COOLDOWN: i64 = 60 * 60 * 24; // 24 hours after poll end

#[error_code]
pub enum ErrorCode {
    #[msg("Poll start is in the past")]
    PollStartInThePast,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Poll has already started")]
    PollAlreadyStarted,
    #[msg("Poll has already ended")]
    PollEnded,
    #[msg("Poll has not started")]
    PollNotStarted,
    #[msg("Invalid candidate")]
    InvalidCandidate,
    #[msg("Invalid poll end")]
    InvalidPollEnd,
    #[msg("Poll has not ended")]
    PollNotEnded,
    #[msg("Invalid poll name")]
    InvalidPollName,
}

#[program]
pub mod voting {
    use super::*;

    // initialize poll counter to auto-increment the poll_id
    pub fn initialize_poll_counter(ctx: Context<InitializePollCounter>) -> Result<()> {
        ctx.accounts
            .poll_counter
            .set_inner(PollCounter { poll_count: 0 });

        return Ok(());
    }

    // initialize poll
    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        poll_name: String,
        poll_description: String,
        poll_start: i64,
        poll_end: i64,
    ) -> Result<()> {
        // input validation
        require!(!poll_name.is_empty(), ErrorCode::InvalidPollName);
        // make sure the poll start is in the future
        require!(
            poll_start > Clock::get()?.unix_timestamp,
            ErrorCode::PollStartInThePast
        );
        // make sure the poll end is after the poll start
        require!(poll_end > poll_start, ErrorCode::InvalidPollEnd);

        let poll_id = ctx.accounts.poll_counter.poll_count;
        msg!("Initializing poll with ID: {}", poll_id);
        ctx.accounts.poll_counter.poll_count += 1;

        ctx.accounts.poll_account.set_inner(Poll {
            poll_id,
            poll_name: poll_name.clone(),
            poll_description: poll_description.clone(),
            poll_start,
            poll_end,
            poll_authority: ctx.accounts.poll_authority.key(),
            candidates_count: 0,
        });
        msg!("Poll initialized with ID: {}", poll_id);

        emit!(PollCreated {
            poll_id,
            poll_name,
            poll_description,
            poll_start,
            poll_end,
        });

        return Ok(());
    }

    // initialize candidate
    pub fn initialize_candidate(
        ctx: Context<InitializeCandidate>,
        poll_id: u64,
        candidate_name: String,
        candidate_description: String,
    ) -> Result<()> {
        // make sure the poll hasn't started yet
        require!(
            ctx.accounts.poll_account.poll_start > Clock::get()?.unix_timestamp,
            ErrorCode::PollAlreadyStarted
        );

        // get candidate id
        let candidate_id = ctx.accounts.poll_account.candidates_count;
        ctx.accounts.poll_account.candidates_count += 1;

        msg!("Initializing candidate with ID: {}", candidate_id);

        ctx.accounts.candidate_account.set_inner(Candidate {
            poll_id,
            candidate_id,
            candidate_name: candidate_name.clone(),
            candidate_description: candidate_description.clone(),
            votes_count: 0,
        });

        emit!(CandidateCreated {
            poll_id,
            candidate_id,
            candidate_name,
            candidate_description,
        });

        return Ok(());
    }

    // vote for candidate
    pub fn vote_for_candidate(
        ctx: Context<VoteForCandidate>,
        poll_id: u64,
        candidate_id: u32,
    ) -> Result<()> {
        let current_time = Clock::get()?.unix_timestamp;

        // make sure the poll is active
        require!(
            current_time >= ctx.accounts.poll_account.poll_start,
            ErrorCode::PollNotStarted
        );
        require!(
            current_time <= ctx.accounts.poll_account.poll_end,
            ErrorCode::PollEnded
        );

        ctx.accounts.vote_account.set_inner(Vote {
            poll_id,
            candidate_id,
            voter: ctx.accounts.voter.key(),
            timestamp: current_time,
        });

        ctx.accounts.candidate_account.votes_count += 1;

        emit!(VoteCast {
            poll_id,
            candidate_id,
            voter: ctx.accounts.voter.key(),
            timestamp: current_time,
        });

        return Ok(());
    }

    // close poll
    pub fn close_poll(ctx: Context<ClosePoll>, poll_id: u64) -> Result<()> {
        require!(
            ctx.accounts.poll_account.poll_end + CLOSE_POLL_COOLDOWN < Clock::get()?.unix_timestamp,
            ErrorCode::PollNotEnded
        );

        emit!(PollClosed { poll_id });

        return Ok(());
    }
}

// first we need to define the poll account
#[account]
#[derive(InitSpace)] // calculate the space required for the account
pub struct Poll {
    poll_id: u64,
    #[max_len(32)]
    poll_name: String,
    #[max_len(280)]
    poll_description: String,
    poll_start: i64, // unix timestamp of the start of the poll
    poll_end: i64,   // unix timestamp of the end of the poll
    poll_authority: Pubkey,
    candidates_count: u32,
}

// candidate account
#[account]
#[derive(InitSpace)]
pub struct Candidate {
    poll_id: u64,
    candidate_id: u32,
    #[max_len(32)]
    candidate_name: String,
    #[max_len(280)]
    candidate_description: String,
    votes_count: u64, // u64 allows us to store 2^64-1 votes
}

// vote account
#[account]
#[derive(InitSpace)]
pub struct Vote {
    poll_id: u64,
    candidate_id: u32,
    voter: Pubkey,
    timestamp: i64, // unix timestamp of the vote
}

// poll counter for keeping track of the number of polls and incrementing the poll_id
#[account]
#[derive(InitSpace)]
pub struct PollCounter {
    poll_count: u64,
}

// define the context for the program instructions

#[derive(Accounts)]
pub struct InitializePollCounter<'info> {
    #[account(mut)]
    pub poll_authority: Signer<'info>,

    #[account(
        init,
        payer = poll_authority,
        space = ANCHOR_DISCRIMINATOR_SIZE + PollCounter::INIT_SPACE,
        seeds = [POLL_COUNTER_SEED], // poll_counter is a global counter for the number of polls so unique to the program
        bump,
    )]
    pub poll_counter: Account<'info, PollCounter>,

    // add system program
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializePoll<'info> {
    // first we need a poll authority that can initialize the poll and make changes to the poll
    #[account(mut)]
    pub poll_authority: Signer<'info>,

    // we need to increment the poll counter to get a new poll_id
    #[account(mut, seeds = [POLL_COUNTER_SEED], bump)]
    pub poll_counter: Account<'info, PollCounter>,

    // we need to initialize the poll account
    #[account(
        init, // initialize the account
        payer = poll_authority,
        space = ANCHOR_DISCRIMINATOR_SIZE + Poll::INIT_SPACE,
        seeds = [POLL_SEED, poll_counter.poll_count.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll_account: Account<'info, Poll>,

    // add system program
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub poll_authority: Signer<'info>,

    // we need to increment the candidate counter to get a new candidate_id
    #[account(
        mut,
        seeds = [POLL_SEED, poll_id.to_le_bytes().as_ref()],
        bump,
        constraint = poll_account.poll_authority == poll_authority.key() @ ErrorCode::Unauthorized, // make sure user that authorized user is initializing the candidate
    )]
    pub poll_account: Account<'info, Poll>,

    // we need to initialize the candidate account
    #[account(
        init, // initialize the account
        payer = poll_authority,
        space = ANCHOR_DISCRIMINATOR_SIZE + Candidate::INIT_SPACE,
        seeds = [CANDIDATE_SEED, poll_id.to_le_bytes().as_ref(), poll_account.candidates_count.to_le_bytes().as_ref()],
        bump,
    )]
    pub candidate_account: Account<'info, Candidate>,

    // add system program
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate_id: u32)]
pub struct VoteForCandidate<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,

    // we need to make sure the poll has started
    #[account(
        mut,
        seeds = [POLL_SEED, poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll_account: Account<'info, Poll>,

    // we need to make sure the candidate is valid and belongs to the poll
    #[account(
        mut,
        seeds = [CANDIDATE_SEED, poll_id.to_le_bytes().as_ref(), candidate_id.to_le_bytes().as_ref()],
        bump,
        constraint = candidate_account.poll_id == poll_account.poll_id @ ErrorCode::InvalidCandidate,
    )]
    pub candidate_account: Account<'info, Candidate>,

    // we need to initialize the vote account
    #[account(
        init,
        payer = voter,
        space = ANCHOR_DISCRIMINATOR_SIZE + Vote::INIT_SPACE,
        seeds = [VOTE_SEED, poll_id.to_le_bytes().as_ref(), voter.key().as_ref()], // each user can create vote account/vote only once per poll
        bump,
    )]
    pub vote_account: Account<'info, Vote>,

    // add system program
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct ClosePoll<'info> {
    #[account(mut)]
    pub poll_authority: Signer<'info>,

    #[account(mut, close = poll_authority, seeds = [POLL_SEED, poll_id.to_le_bytes().as_ref()], bump, constraint = poll_account.poll_authority == poll_authority.key() @ ErrorCode::Unauthorized)]
    pub poll_account: Account<'info, Poll>,

    pub system_program: Program<'info, System>,
}

#[event]
pub struct PollCreated {
    pub poll_id: u64,
    pub poll_name: String,
    pub poll_description: String,
    pub poll_start: i64,
    pub poll_end: i64,
}

#[event]
pub struct CandidateCreated {
    pub poll_id: u64,
    pub candidate_id: u32,
    pub candidate_name: String,
    pub candidate_description: String,
}

#[event]
pub struct VoteCast {
    pub poll_id: u64,
    pub candidate_id: u32,
    pub voter: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct PollClosed {
    pub poll_id: u64,
}
