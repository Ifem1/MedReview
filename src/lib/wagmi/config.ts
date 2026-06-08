import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const studionetChain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 61999),
  name: "GenLayer Studionet",
  nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "http://localhost:4000/api"],
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [studionetChain],
  connectors: [injected()],
  transports: {
    [studionetChain.id]: http(
      process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "http://localhost:4000/api"
    ),
  },
});
