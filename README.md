# Solana Voting dApp

A decentralized voting application built on Solana blockchain, designed as an educational resource for learning Solana development with Anchor framework and Next.js frontend.

## Features

- **Create Polls**: Any user can create new polls with custom names and descriptions
- **Add Candidates**: Poll creators can add multiple candidates to their polls
- **Vote for Candidates**: Users can vote for candidates in active polls (one vote per user per poll)
- **View Results**: Real-time voting results with vote counts for each candidate
- **Poll Management**: Automatic poll lifecycle management with start/end times
- **Wallet Integration**: Seamless integration with Solana wallet adapters
- **Responsive UI**: Modern, responsive interface built with Next.js and Tailwind CSS

## Architecture

This project is a monorepo built with:

### Smart Contract (Anchor Program)

- **Language**: Rust with Anchor framework
- **Program ID**: `Dkx6rMoHVhkPc1zzU8u7LxNFJ4NhBj3w7fNkNUhzDZDn`
- **Network**: Deployed on Solana Devnet

### Frontend (Web App)

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with Shadcn UI
- **State Management**: Jotai for state managementß

### Key Smart Contract Features

- **Poll Counter**: Global counter for unique poll IDs
- **Poll Accounts**: Store poll metadata, timing, and authority
- **Candidate Accounts**: Store candidate information and vote counts
- **Vote Accounts**: Prevent double voting (one vote per user per poll)
- **Event Emissions**: On-chain events for poll creation, candidate addition, and votes

## Project Structure

```
solana-voting-dapp/
├── apps/
│   ├── anchor/                 # Solana program (smart contract)
│   │   ├── programs/voting/    # Rust program source
│   │   ├── tests/             # Integration tests
│   │   └── target/            # Compiled program artifacts
│   └── web/                   # Next.js frontend
│       ├── src/app/           # Next.js app router pages
│       ├── src/components/    # React components
│       ├── src/hooks/         # Custom React hooks
│       └── src/lib/           # Utility functions
├── packages/                  # Shared packages (if any)
└── package.json              # Root package.json with workspace scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm 8+
- Rust and Cargo
- Solana CLI tools
- Anchor CLI

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/blockchain-hq/solana-voting-dapp.git
   cd solana-voting-dapp
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup Solana CLI (if not already done)**

   ```bash
   # Install Solana CLI
   sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"

   # Set to devnet
   solana config set --url devnet

   # Create a keypair (or use existing)
   solana-keygen new

   # Airdrop some SOL for testing
   solana airdrop 2
   ```

4. **Install Anchor CLI**
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
   ```

### Development

1. **Build the Anchor program**

   ```bash
   pnpm anchor:build
   ```

2. **Deploy to devnet (optional - already deployed)**

   ```bash
   pnpm anchor:deploy
   ```

3. **Run tests**

   ```bash
   pnpm anchor:test
   ```

4. **Start the web application**

   ```bash
   pnpm web:dev
   ```

5. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Creating a Poll

1. Connect your Solana wallet
2. Navigate to the voting section
3. Click "Create New Poll"
4. Fill in poll details:
   - Poll name (max 32 characters)
   - Description (max 280 characters)
   - Start time (must be in the future)
   - End time (must be after start time)
5. Submit the transaction

### Adding Candidates

1. As the poll creator, find your poll
2. Click "Add Candidate"
3. Enter candidate details:
   - Name (max 32 characters)
   - Description (max 280 characters)
4. Submit the transaction
5. Repeat for additional candidates

**Note**: Candidates can only be added before the poll starts.

### Voting

1. Connect your wallet
2. Find an active poll (started but not ended)
3. Review candidates
4. Click "Vote" on your preferred candidate
5. Confirm the transaction

**Note**: Each wallet can only vote once per poll.

### Viewing Results

- Results are displayed in real-time
- Vote counts are updated after each vote
- Results remain visible even after polls end

## Smart Contract Details

### Program Instructions

- `initialize_poll_counter()`: Initialize the global poll counter (one-time setup)
- `initialize_poll()`: Create a new poll
- `initialize_candidate()`: Add a candidate to a poll
- `vote_for_candidate()`: Cast a vote for a candidate
- `close_poll()`: Close a poll (24 hours after end time)

### Account Types

- **Poll**: Stores poll metadata and timing
- **Candidate**: Stores candidate info and vote count
- **Vote**: Records individual votes (prevents double voting)
- **PollCounter**: Global counter for poll IDs

### Security Features

- **Authorization**: Only poll creators can add candidates
- **Timing Validation**: Polls must start in future, end after start
- **Vote Prevention**: One vote per wallet per poll
- **Input Validation**: String length limits and required fields

## Testing

The project includes comprehensive tests:

```bash
# Run all tests
pnpm test

# Run only Anchor program tests
pnpm anchor:test

# Run web app tests (if any)
pnpm --filter web test
```

### Test Coverage

- Poll counter initialization
- Poll creation with validation
- Candidate addition
- Voting functionality
- Error handling for edge cases

## Deployment

### Smart Contract Deployment

The program is already deployed to devnet at:
`Dkx6rMoHVhkPc1zzU8u7LxNFJ4NhBj3w7fNkNUhzDZDn`

To deploy to a different network:

1. Update `Anchor.toml` with your desired cluster
2. Ensure you have SOL in your wallet for the target network
3. Run: `pnpm anchor:deploy`

### Frontend Deployment

The frontend can be deployed to any platform supporting Next.js:

```bash
# Build for production
pnpm web:build

# Start production server
pnpm web:start
```

## Contributing

This project is designed as an educational resource. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Learning Resources

This project was inspired by the [Solana Developer Bootcamp 2024](https://www.youtube.com/watch?v=amAq-WHAFs8&list=PLilwLeBwGuK7HN8ZnXpGAD9q6i4syhnVc).

### Key Learning Topics

- **Anchor Framework**: Smart contract development on Solana
- **Program Derived Addresses (PDAs)**: Deterministic account addressing
- **Account Management**: Solana's account model and rent
- **Transaction Processing**: Instruction handling and validation
- **Frontend Integration**: Connecting web apps to Solana programs
- **Wallet Integration**: Using Solana wallet adapters

## Future Enhancements

- Allow poll creators to specify cooldown periods for closing polls
- Optional poll account closure permissions
- Candidate limit configuration per poll
- Optional restriction preventing poll creators from voting
- Enhanced analytics and reporting
- Mobile-responsive improvements
- Multi-signature poll creation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

For questions, issues, or contributions:

- **GitHub Issues**: [Report bugs or request features](https://github.com/blockchain-hq/solana-voting-dapp/issues)
- **Developer**: [BlockchainHQ](https://blockchainhq.xyz)

---

**Built with ❤️ for the Solana developer community**
