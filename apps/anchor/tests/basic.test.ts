import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Voting } from '../target/types/voting'
import { PublicKey } from '@solana/web3.js'
import { getOrCreateWallet } from './wallet'
import { WALLET_PATH } from './config'

describe('voting', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  jest.setTimeout(30000)

  const program = anchor.workspace.Voting as Program<Voting>
  let pollId: anchor.BN

  it('should initialize a poll counter and create a poll', async () => {
    // initialize the poll counter (only once)
    try {
      await program.methods.initializePollCounter().rpc()
      console.log('Poll counter initialized')
    } catch (_) {
      console.log('Poll counter already exists')
    }

    const [pollCounterPda] = PublicKey.findProgramAddressSync([Buffer.from('poll_counter')], program.programId)
    const pollCounterAcc = await program.account.pollCounter.fetch(pollCounterPda)
    const [pollPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('poll'), new anchor.BN(pollCounterAcc.pollCount).toArrayLike(Buffer, 'le', 8)],
      program.programId,
    )

    // initialize the poll - start in future to allow candidate creation
    const currentTimeInSeconds = Math.floor(Date.now() / 1000)
    const startInSeconds = currentTimeInSeconds + 10 // 10 seconds from now
    const pollDurationInSeconds = 24 * 60 * 60 // 24 hours
    const endInSeconds = startInSeconds + pollDurationInSeconds

    const tx = await program.methods
      .initializePoll('Test Poll', 'Test Description', new anchor.BN(startInSeconds), new anchor.BN(endInSeconds))
      .rpc()
    console.log(`Poll initialized: ${tx}`)

    const pollAccount = await program.account.poll.fetch(pollPda)
    pollId = pollAccount.pollId

    console.log(`Poll ID: ${pollId.toString()}`)
  })

  it('should create candidates', async () => {
    const candidates = [
      { name: 'Candidate 1', description: 'Candidate 1 Description' },
      { name: 'Candidate 2', description: 'Candidate 2 Description' },
    ]

    // Get poll account to check current candidates count
    const [pollPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('poll'), pollId.toArrayLike(Buffer, 'le', 8)],
      program.programId,
    )

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i]

      // Get current candidates count before creating candidate
      const pollAccount = await program.account.poll.fetch(pollPda)

      const tx = await program.methods.initializeCandidate(pollId, candidate.name, candidate.description).rpc()
      console.log(`Candidate ${candidate.name} created: ${tx}`)

      const [candidatePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('candidate'),
          pollId.toArrayLike(Buffer, 'le', 8),
          new anchor.BN(pollAccount.candidatesCount).toArrayLike(Buffer, 'le', 4),
        ],
        program.programId,
      )

      const candidateAccount = await program.account.candidate.fetch(candidatePda)
      console.log('Candidate created:', {
        candidateId: candidateAccount.candidateId.toString(),
        name: candidateAccount.candidateName,
        votesCount: candidateAccount.votesCount.toString(),
      })
    }
  })

  it('should vote for a candidate', async () => {
    // wait for 20 seconds the poll to start
    await new Promise((resolve) => setTimeout(resolve, 20000))

    const keypair = await getOrCreateWallet(provider.connection, WALLET_PATH)
    const candidateId = 0

    const tx = await program.methods
      .voteForCandidate(pollId, candidateId)
      .accounts({
        voter: keypair.publicKey,
      })
      .signers([keypair])
      .rpc()
    console.log(`Vote for candidate: ${tx}`)

    const [votePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vote'), pollId.toArrayLike(Buffer, 'le', 8), keypair.publicKey.toBuffer()],
      program.programId,
    )

    const voteAccount = await program.account.vote.fetch(votePda)
    console.log('Vote created:', {
      pollId: voteAccount.pollId.toString(),
      candidateId: voteAccount.candidateId.toString(),
      voter: voteAccount.voter.toString(),
      timestamp: voteAccount.timestamp.toString(),
    })
  })

  it('should close all the polls', async () => {
    // get all the polls
    const [pollCounterPda] = PublicKey.findProgramAddressSync([Buffer.from('poll_counter')], program.programId)
    const pollCounterAcc = await program.account.pollCounter.fetch(pollCounterPda)
    const pollCount = pollCounterAcc.pollCount
    const pollCountNumber = pollCount.toNumber()

    for (let i = 0; i < pollCountNumber; i++) {
      try {
        const tx = await program.methods.closePoll(new anchor.BN(i)).rpc()

        console.log(`Poll ${pollId.toString()} closed: ${tx}`)
        console.log(`View on Devnet Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`)
      } catch (error) {
        if (error instanceof Error && error.message.includes('Error Code: PollNotEnded')) {
          console.log(`Poll ${i} currently not ended`)
        } else {
          console.log(`Error closing poll ${i}: ${error}`)
        }
      }
    }
  })
})
