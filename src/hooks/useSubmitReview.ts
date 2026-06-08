"use client";

import { useState } from "react";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { useAccount } from "wagmi";
import type { JsonRpcAccount } from "viem";

const CONTRACT = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS as `0x${string}`;

/**
 * Calls GenLayer contract write functions using the user's connected wallet.
 *
 * GenLayer JS has two signing paths:
 *   - account.type === "local"  → signs with private key locally (server path)
 *   - account.type !== "local"  → calls eth_sendTransaction → routed to
 *                                  window.ethereum (MetaMask) automatically
 *
 * By creating the client without a pre-set account and passing a json-rpc
 * account to writeContract, GenLayer encodes calldata in its own format
 * (shows as Type: Call in explorer) while MetaMask handles signing.
 */
export function useSubmitReview() {
  const { address } = useAccount();
  const [isWriting, setIsWriting] = useState(false);
  const [writeError, setWriteError] = useState<Error | null>(null);

  async function submitReview(
    functionName: "submit_symptom_review" | "submit_report_review" | "submit_follow_up",
    args: string[]
  ): Promise<string> {
    if (!CONTRACT)  throw new Error("Missing MedReview contract address");
    if (!args[0])   throw new Error("Missing reviewId");
    if (!args[1])   throw new Error("Missing payload JSON");

    const senderAddress = address;
    if (!senderAddress) throw new Error("Wallet not connected — please connect first");

    setIsWriting(true);
    setWriteError(null);

    console.log("[MedReview] Calling contract write", {
      contractAddress: CONTRACT,
      method: functionName,
      reviewId: args[0],
    });

    try {
      // Create GenLayer client with NO pre-set account.
      // This sets isAddress = true internally, which makes GenLayer route
      // eth_sendTransaction to window.ethereum (MetaMask) instead of
      // signing locally with a private key.
      const client = createClient({ chain: studionet });

      // Pass a json-rpc account (type !== "local") so GenLayer takes the
      // eth_sendTransaction path (MetaMask signs) not the local-sign path.
      const account: JsonRpcAccount = {
        address: senderAddress,
        type: "json-rpc",
      };

      const txHash = await client.writeContract({
        address: CONTRACT,
        functionName,
        args: args,
        account,
        value: BigInt(0),
      });

      console.log("[MedReview] Contract write confirmed", {
        txHash,
        method: functionName,
        reviewId: args[0],
      });

      return txHash as string;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setWriteError(e);
      throw e;
    } finally {
      setIsWriting(false);
    }
  }

  return { submitReview, isWriting, writeError };
}
