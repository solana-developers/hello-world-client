import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import dotenv from "dotenv";
import fs from "fs";
import os from "os";
import path from "path";

dotenv.config();

const programId = new PublicKey("8ziTvCeyd66eRqKAv1e5jB61Q4WbRacmNVHwrDP4YJay");
const connection = new Connection(clusterApiUrl("devnet"));

/**
 * Custom implementation of initializeKeypair to avoid dependency issues
 * This function handles keypair creation/loading from multiple sources:
 * 1. Environment variable (PRIVATE_KEY)
 * 2. Solana CLI default location (~/.config/solana/id.json)
 * 3. Generate new keypair if none found
 */
export const initializeKeypair = async (connection: Connection): Promise<Keypair> => {
  let keypair: Keypair;

  // Option 1: Load from environment variable
  if (process.env.PRIVATE_KEY) {
    try {
      const privateKeyArray = JSON.parse(process.env.PRIVATE_KEY);
      keypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
      console.log("✅ Loaded keypair from environment variable");
    } catch (error) {
      throw new Error("Invalid PRIVATE_KEY format in environment variable");
    }
  } else {
    // Option 2: Try to load from Solana CLI default location
    const keypairPath = path.join(os.homedir(), '.config', 'solana', 'id.json');
    
    if (fs.existsSync(keypairPath)) {
      try {
        const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
        keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
        console.log("✅ Loaded keypair from Solana CLI config");
      } catch (error) {
        throw new Error("Failed to load keypair from Solana CLI config");
      }
    } else {
      // Option 3: Generate a new keypair
      keypair = Keypair.generate();
      console.log("🔑 Generated new keypair");
      console.log("📋 Public key:", keypair.publicKey.toBase58());
      
      // Provide instructions for saving the keypair
      const keypairArray = Array.from(keypair.secretKey);
      console.log("\n💡 To reuse this keypair, save the following to your .env file:");
      console.log(`PRIVATE_KEY=${JSON.stringify(keypairArray)}`);
      console.log("\n⚠️  Keep your private key secure and never share it!\n");
    }
  }

  // Check balance and request airdrop if needed
  const balance = await connection.getBalance(keypair.publicKey);
  console.log(`💰 Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);

  if (balance < LAMPORTS_PER_SOL) {
    console.log("💧 Requesting airdrop...");
    try {
      const airdropSignature = await connection.requestAirdrop(
        keypair.publicKey,
        LAMPORTS_PER_SOL
      );
      
      // Wait for airdrop confirmation
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
      });
      
      console.log("✅ Airdrop successful!");
      
      // Verify new balance
      const newBalance = await connection.getBalance(keypair.publicKey);
      console.log(`💰 New balance: ${newBalance / LAMPORTS_PER_SOL} SOL`);
    } catch (error) {
      console.log("❌ Airdrop failed:", error);
      console.log("💡 You may need to request SOL from https://faucet.solana.com/");
    }
  }

  return keypair;
};

export const sayHello = async (payer: Keypair): Promise<string> => {
  console.log("👋 Calling hello world program...");
  
  const transaction = new Transaction();
  const instruction = new TransactionInstruction({
    keys: [], // No accounts needed for basic hello world
    programId,
    data: Buffer.alloc(0), // No data needed for this simple program
  });

  transaction.add(instruction);

  try {
    const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
    return signature;
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    throw error;
  }
};

// Main execution function
async function main() {
  try {
    console.log("🚀 Starting Solana Hello World client...\n");
    
    console.log("🔧 Initializing keypair...");
    const payer = await initializeKeypair(connection);
    
    console.log("📤 Sending transaction...");
    const transactionSignature = await sayHello(payer);

    console.log("\n🎉 Success!");
    console.log(`📋 Transaction signature: ${transactionSignature}`);
    console.log(
      `🔗 View on Solana Explorer: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    );
    console.log("\n✅ Finished successfully!");
  } catch (error) {
    console.error("\n❌ Error occurred:");
    if (error instanceof Error) {
      console.error(`💥 ${error.message}`);
      
      // Provide helpful suggestions based on common errors
      if (error.message.includes("insufficient funds")) {
        console.log("\n💡 Suggestion: Request SOL from https://faucet.solana.com/");
      } else if (error.message.includes("blockhash")) {
        console.log("\n💡 Suggestion: Try running the program again (network issue)");
      }
    } else {
      console.error("💥 Unknown error:", error);
    }
    process.exit(1);
  }
}

// Only run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
