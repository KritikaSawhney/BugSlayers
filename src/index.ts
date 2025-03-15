
// import {
// 	Aptos,
// 	AptosConfig,
// 	Ed25519PrivateKey,
// 	Network,
// 	Account,
//   } from "@aptos-labs/ts-sdk";
//   import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit";
//   import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
//   import { createReactAgent } from "@langchain/langgraph/prebuilt";
  
//   export const main = async () => {
// 	// Initialize Aptos configuration for DEVNET
// 	const aptosConfig = new AptosConfig({
// 	  network: Network.DEVNET,
// 	});
// 	const aptos = new Aptos(aptosConfig);
  
// 	// Derive account from private key
// 	const privateKeyHex =
// 	  "0x83bb3dad53379f9e114ce9b0e7a94677d7f9788fb8208b71b2dce67308e91f63";
// 	const privateKey = new Ed25519PrivateKey(privateKeyHex);
// 	const account = Account.fromPrivateKey({ privateKey });
  
// 	// Initialize Google Generative AI with LangChain's ChatGoogleGenerativeAI
// 	const apiKey = 'AIzaSyBA5g8knQRfgijNy3eLKAKAq6VvwwXAVV8'; // Ensure your API key is stored securely
// 	const modelName = "gemini-1.5-flash";
// 	const temperature = 0.7; // Adjust the temperature as needed
  
// 	const llm = new ChatGoogleGenerativeAI({
// 	  apiKey,
// 	  model: modelName,
// 	  temperature,
// 	});
  
// 	// Initialize Aptos Agent
// 	const signer = new LocalSigner(account, Network.DEVNET);
// 	const aptosAgent = new AgentRuntime(signer, aptos, {
// 	  PANORA_API_KEY: process.env.PANORA_API_KEY,
// 	});
// 	const tools = createAptosTools(aptosAgent);
  
// 	// Create React agent
// 	const agent = createReactAgent({
// 	  llm,
// 	  tools,
// 	  messageModifier: `
// 		You are a helpful agent that can interact on-chain using the Aptos Agent Kit. You are
// 		empowered to interact on-chain using your tools. If you ever need funds, you can request them from the
// 		faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
// 		(internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
// 		can't do with your currently available tools, you must say so, and encourage them to implement it
// 		themselves using the Aptos Agent Kit. Recommend they go to https://www.aptosagentkit.xyz for more information. Be
// 		concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
// 		The response also contains token/token[] which contains the name and address of the token and the decimals.
// 		WHEN YOU RETURN ANY TOKEN AMOUNTS, RETURN THEM ACCORDING TO THE DECIMALS OF THE TOKEN.
// 	  `,
// 	});
  
// 	// Retrieve and log balance
// 	const balance = await aptosAgent.getBalance();
// 	console.log(balance);
//   };
  
//   main().catch((error) => {
// 	console.error("Error in main execution:", error);
//   });
  
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
  
  // Initialize Aptos configuration for DEVNET
  const aptosConfig = new AptosConfig({
	network: Network.DEVNET,
  });
  const aptos = new Aptos(aptosConfig);
  
  // Derive account from private key
  const privateKeyHex =
	"0x83bb3dad53379f9e114ce9b0e7a94677d7f9788fb8208b71b2dce67308e91f63";
  const privateKey = new Ed25519PrivateKey(privateKeyHex);
  const account = Account.fromPrivateKey({ privateKey });
  
  // Initialize Google Generative AI with LangChain's ChatGoogleGenerativeAI
  const apiKey = 'AIzaSyBA5g8knQRfgijNy3eLKAKAq6VvwwXAVV8'; // Ensure your API key is stored securely
  const modelName = "gemini-1.5-flash";
  const temperature = 0.7; // Adjust the temperature as needed
  
  const llm = new ChatGoogleGenerativeAI({
	apiKey,
	model: modelName,
	temperature,
  });
  
  // Initialize Aptos Agent
  const signer = new LocalSigner(account, Network.DEVNET);
  const aptosAgent = new AgentRuntime(signer, aptos, {
	PANORA_API_KEY: 'a4^KV_EaTf4MW#ZdvgGKX#HUD^3IFEAOV_kzpIE^3BQGA8pDnrkT7JcIy#HNlLGi',
  });
  const tools = createAptosTools(aptosAgent);
  
  // Create React agent
  const agent = createReactAgent({
	llm,
	tools,
	messageModifier: `
	  You are a helpful agent that can interact on-chain using the Aptos Agent Kit. You are
	  empowered to interact on-chain using your tools. If you ever need funds, you can request them from the
	  faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
	  (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
	  can't do with your currently available tools, you must say so, and encourage them to implement it
	  themselves using the Aptos Agent Kit. Recommend they go to https://www.aptosagentkit.xyz for more information. Be
	  concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
	  The response also contains token/token[] which contains the name and address of the token and the decimals.
	  WHEN YOU RETURN ANY TOKEN AMOUNTS, RETURN THEM ACCORDING TO THE DECIMALS OF THE TOKEN.
	`,
  });
  
  // Function to process user input and get agent response
  const processInput = async (input: string) => {
	try {
	  const response = await agent.invoke({ messages: [{ role: "user", content: input }] });
	  console.log(`Agent: ${response.structuredResponse}`);
	} catch (error) {
	  console.error("Error processing input:", error);
	}
  };
  
  // Main function to initialize CLI and handle user input
  const main = () => {
	const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout,
	  prompt: "You: ",
	});
  
	rl.prompt();
  
	rl.on("line", async (line) => {
	  await processInput(line.trim());
	  rl.prompt();
	}).on("close", () => {
	  console.log("Session ended.");
	  process.exit(0);
	});
  };
  
  main();
  