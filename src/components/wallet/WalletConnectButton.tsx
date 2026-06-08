"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  compact?: boolean;
}

function truncateAddress(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function WalletConnectButton({ compact = false }: Props) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Defer rendering until after hydration to avoid server/client mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a stable placeholder on the server and before mount
  if (!mounted) {
    return (
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white"
        style={{ backgroundColor: "var(--color-teal)", fontFamily: "var(--font-heading)" }}
        disabled
      >
        <Wallet className="w-4 h-4" />
        {!compact && <span>Connect Wallet</span>}
        {compact && <span className="hidden sm:inline">Connect</span>}
      </button>
    );
  }

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: injected() })}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white"
        style={{ backgroundColor: "var(--color-teal)", fontFamily: "var(--font-heading)" }}
      >
        <Wallet className="w-4 h-4" />
        {!compact && <span>Connect Wallet</span>}
        {compact && <span className="hidden sm:inline">Connect</span>}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border"
        style={{
          backgroundColor: "var(--color-surface-soft)",
          borderColor: "var(--color-border)",
          color: "var(--color-ink)",
        }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: "var(--color-urgency-green)" }}
        />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
          {truncateAddress(address!)}
        </span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-lg border py-1 z-50"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <button
              onClick={() => { disconnect(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors text-left hover:bg-[var(--color-surface-soft)]"
              style={{ color: "var(--color-ink-secondary)" }}
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}
