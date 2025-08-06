# Solana Hello World Client

A simple client that calls a "Hello World" program on the Solana blockchain.

## Two Versions Available

### 1. Original Version (`src/index.ts`)
Uses the `@solana-developers/helpers` package (may have installation issues).

### 2. Improved Version (`src/index-improved.ts`) ⭐ **Recommended**
Self-contained implementation with better error handling and no problematic dependencies.

## Quick Start (Improved Version)

1. **Clone and install:**
\`\`\`bash
git clone https://github.com/solana-developers/hello-world-client.git
cd hello-world-client
npm install
\`\`\`

2. **Run the improved version:**
\`\`\`bash
npm run dev
\`\`\`

## Features of the Improved Version

- ✅ **No problematic dependencies** - Self-contained implementation
- ✅ **Better error handling** - Clear error messages and suggestions
- ✅ **Multiple keypair sources** - Environment variable, Solana CLI, or auto-generate
- ✅ **Improved logging** - Step-by-step progress indicators
- ✅ **Automatic airdrop** - Requests devnet SOL if balance is low
- ✅ **Transaction confirmation** - Properly waits for transaction confirmation

## Keypair Management

The improved version supports three ways to manage your keypair:

### Option 1: Environment Variable (Recommended for development)
Create a `.env` file:
\`\`\`env
PRIVATE_KEY=[123,45,67,89,...]
\`\`\`

### Option 2: Solana CLI
If you have Solana CLI installed, it will use your default keypair from `~/.config/solana/id.json`.

### Option 3: Auto-generate
If no keypair is found, a new one will be generated and the private key will be displayed for you to save.

## Troubleshooting

### Installation Issues with `@solana-developers/helpers`
If you encounter issues with the original version, use the improved version instead:
\`\`\`bash
npm run dev  # Uses the improved version
\`\`\`

### Insufficient Funds Error
Request devnet SOL from the faucet:
- Visit: https://faucet.solana.com/
- Enter your public key (displayed when running the program)

### Network Issues
If you get blockhash or network errors, simply try running the program again.

## Understanding the Code

### What the Program Does
1. **Initializes a keypair** (your wallet)
2. **Checks SOL balance** and requests airdrop if needed
3. **Creates a transaction** with a simple instruction
4. **Calls the Hello World program** on Solana devnet
5. **Displays the transaction signature** and explorer link

### Key Differences from Original

| Original | Improved |
|----------|----------|
| Uses `@solana-developers/helpers` | Custom implementation |
| Basic error handling | Detailed error messages |
| No balance checking | Automatic balance check & airdrop |
| Minimal logging | Step-by-step progress |
| Top-level await | Proper main function |

## Contributing

Found an issue or want to improve the code? Please open an issue or submit a pull request!

## License

MIT
