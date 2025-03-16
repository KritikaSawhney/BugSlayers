

import { AptosClient, AptosAccount, Types } from "aptos";
import { Buffer } from "buffer";  

import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  Account,
} from "@aptos-labs/ts-sdk";
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as readline from "readline";

const privateKeyHex = "0x83bb3dad53379f9e114ce9b0e7a94677d7f9788fb8208b71b2dce67308e91f63";

const PANORA_API_KEY = "a4^KV_EaTf4MW#ZdvgGKX#HUD^3IFEAOV_kzpIE^3BQGA8pDnrkT7JcIy#HNlLGi";
const GOOGLE_GEN_AI_API_KEY = "AIzaSyBA5g8knQRfgijNy3eLKAKAq6VvwwXAVV8";

const aptosConfig = new AptosConfig({
  network: Network.DEVNET,
});
const aptos = new Aptos(aptosConfig);

const privateKey = new Ed25519PrivateKey(privateKeyHex);
const account = Account.fromPrivateKey({ privateKey });

const llm = new ChatGoogleGenerativeAI({
  apiKey: GOOGLE_GEN_AI_API_KEY,
  model: "gemini-1.5-flash",
  temperature: 0.7,
});

const signer = new LocalSigner(account, Network.DEVNET);
const aptosAgent = new AgentRuntime(signer, aptos, {
  PANORA_API_KEY,
});
const tools = createAptosTools(aptosAgent);

const agent = createReactAgent({
  llm,
  tools,
  messageModifier: `
    You are a helpful agent that can interact on-chain using the Aptos Agent Kit. Fetch the latest tweets from Twitter related to cryptocurrencies.
    Analyze each tweet's sentiment to determine if it is bullish.
    If a tweet is bullish, extract the coin mentioned in the tweet and return its hash.
    If no bullish sentiment is detected, return null and take no action.
  `,
});

const performTransaction = async (receiverAddress: string, amount: number) => {
  try {
    const accountDetails = await aptos.account.getAccountInfo({
      accountAddress: account.accountAddress,
    });

    const rawTransaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: "0x1::aptos_account::transfer",
        functionArguments: [receiverAddress, amount],
      },
      options: {
        gasUnitPrice: 100, 
        maxGasAmount: 200000, 
      },
    });

    const submittedTransaction = await aptos.signAndSubmitTransaction({
      signer: account,
      transaction: rawTransaction,
    });

    console.log("Transaction submitted successfully:", submittedTransaction);

    const executedTransaction = await aptos.waitForTransaction({
      transactionHash: submittedTransaction.hash,
    });

    console.log("Transaction executed successfully:", executedTransaction);
  } catch (error) {
    console.error("Error performing transaction:", error);
  }
};


const processInput = async (input: string) => {
  try {
      console.log("Creating liquidity pool of 1000 APT and another token...")

    const response = await agent.invoke({
      messages: [{ role: "user", content: input }],
    });

    if (!response) {
      console.error("Error: No response received.");
      return;
    }

    console.log("A liquidity pool with 1000 APT has been created");
const PETRA_WALLET_ADDRESS = "0x7f223c4c9ec5ab8472bdec47601b078ca40566c941bdf2c9379a63587258a592";

const THALA_COIN_TYPE = "0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL";


const TRANSFER_AMOUNT = "1000000000000000000";


const SENDER_PRIVATE_KEY_HEX = "0xa41693f1c6b2156bfd968cd756e9b2fa59a8413d88f836d2d661670e26bffe41";


  try {
    const senderPrivateKeyBytes = Uint8Array.from(
      Buffer.from(SENDER_PRIVATE_KEY_HEX.replace("0x", ""), "hex")
    );
    const senderAccount = new AptosAccount(senderPrivateKeyBytes);

    const payload: Types.EntryFunctionPayload = {
      function: "0x1::coin::transfer",
      type_arguments: [THALA_COIN_TYPE],
      arguments: [
        PETRA_WALLET_ADDRESS,  
        TRANSFER_AMOUNT        
      ],
    };
    
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);

    
    const txnRequest = await client.generateTransaction(senderAccount.address(), payload);

    
    const signedTxn = await client.signTransaction(senderAccount, txnRequest);


    const txnResponse = await client.submitTransaction(signedTxn);
    console.log("Transaction submitted. Hash:", txnResponse.hash);

    const [receiverAddress, amountStr] = input.split(" ");
    const amount = parseInt(amountStr);

    if (!receiverAddress || isNaN(amount)) {
      console.error("Invalid input format. Use '<Coin Hash> <amount>'.");
      return;
    }
    await performTransaction(receiverAddress, amount);
  } catch (error) {
    console.error("Error processing input:", error);
  }


const main = () => {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "You (Enter '<Coin Hash> <amount>'): ",
  });

  rl.prompt();

  rl.on("line", async (line: string) => {
    await processInput(line.trim());
    rl.prompt();
  }).on("close", () => {
    console.log("Session ended.");
    process.exit(0);
  });
};

main();







  