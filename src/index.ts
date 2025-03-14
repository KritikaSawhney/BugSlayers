import {
	Aptos,
	AptosConfig,
	Ed25519PrivateKey,
	HexInput,
	Network,
	PrivateKey,
	PrivateKeyVariants,
} from "@aptos-labs/ts-sdk"
import { AgentRuntime, LocalSigner } from "move-agent-kit"

export const main = async () => {
	const aptosConfig = new AptosConfig({
		network: Network.DEVNET, // Switched from MAINNET to DEVNET
	})
	const aptos = new Aptos(aptosConfig)
	const account = await aptos.deriveAccountFromPrivateKey({
		privateKey: new Ed25519PrivateKey(
			PrivateKey.formatPrivateKey('0x83bb3dad53379f9e114ce9b0e7a94677d7f9788fb8208b71b2dce67308e91f63' , PrivateKeyVariants.Ed25519)
		),
	})

	const signer = new LocalSigner(account, Network.DEVNET) // Switched from MAINNET to DEVNET
	const agentRuntime = new AgentRuntime(signer, aptos)

	const balance = await agentRuntime.getBalance()

	console.log(balance)
}

main()
	
