import { createClient, createAccount } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

let _client: ReturnType<typeof createClient> | null = null;

export function getGenLayerClient() {
  if (!_client) {
    _client = createClient({
      chain: studionet,
      endpoint: process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "http://localhost:4000/api",
    });
  }
  return _client;
}

export function getContractAddress(): `0x${string}` {
  const addr = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS;
  if (!addr) throw new Error("NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS not set");
  return addr as `0x${string}`;
}

/**
 * Create a GenLayer account from a private key env var, or a demo key for dev mode.
 * In production, the private key should correspond to the deployer/admin wallet.
 * For user-facing transactions, the user's injected wallet handles signing.
 */
export function getServerAccount() {
  const raw = process.env.GENLAYER_SERVER_PRIVATE_KEY || "a".repeat(64);
  const pk = raw.startsWith("0x") ? raw : `0x${raw}`;
  return createAccount(pk as `0x${string}`);
}
