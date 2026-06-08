# MedReview — AI-Powered Healthcare Triage on GenLayer

MedReview is a decentralised healthcare triage application built on [GenLayer](https://genlayer.com). It uses GenLayer's Intelligent Contracts to run AI-powered symptom triage on-chain, giving users verifiable, transparent health guidance — not a diagnosis.

**Live App:** https://medreview-six.vercel.app

---

## What It Does

Users connect their Web3 wallet, submit a health concern, and sign a GenLayer transaction. The intelligent contract runs an AI triage and returns a structured result — urgency level, red flags, recommended next steps, and questions to ask a doctor — all verifiable on-chain.

### 6 Review Types

| Type | Contract Method |
|------|----------------|
| Symptom Review | `submit_symptom_review` |
| Report Review (lab results, scans, letters) | `submit_report_review` |
| Medication Concern | `submit_report_review` |
| Child Symptom Review | `submit_symptom_review` |
| Pregnancy Concern | `submit_symptom_review` |
| Follow-up Review | `submit_follow_up` |

### Urgency Levels Returned by the AI Contract

`SELF_MONITOR` → `ROUTINE_DOCTOR` → `SOON_DOCTOR` → `URGENT_CARE` → `EMERGENCY`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router, Turbopack) |
| Smart Contract | GenLayer Intelligent Contract (Python) |
| Wallet | MetaMask via `genlayer-js` + wagmi |
| Database (cache) | Supabase (Postgres + RLS) |
| Deployment | Vercel |

**GenLayer is the source of truth.** Supabase is a cache layer only — triage results come from the contract, not the database.

---

## Key Architecture Decisions

- **Browser-side contract reads** — `readContract` runs in the browser using the studionet chain transport, which is more reliable than server-side for this use case
- **MetaMask signing** — all writes go through `eth_sendTransaction` via MetaMask, never a stored private key for user transactions
- **RLS enforced** — wallet owners can only read their own data; no public health profiles
- **Emergency warnings are never hidden** — red flags and EMERGENCY urgency always surface regardless of UI state

---

## Smart Contract

Located at [`contracts/MedReview.py`](contracts/MedReview.py)

Deployed on GenLayer Studionet: `0x5a4908AFf834c9A8D7bA9Bf217CC2488540eA1C6`

---

## Running Locally

```bash
# Clone
git clone https://github.com/Ifem1/MedReview.git
cd MedReview

# Install
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and GenLayer values

# Run
npm run dev
```

### Required Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS=
NEXT_PUBLIC_GENLAYER_RPC_URL=
NEXT_PUBLIC_CHAIN_ID=61999
GENLAYER_SERVER_PRIVATE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Safety & Disclaimers

- MedReview provides triage guidance only — it is **not a diagnosis**
- It does **not** prescribe medication or recommend dosage changes
- It is **never** a substitute for emergency services
- For emergencies, call your local emergency number immediately

---

## Links

- **Live App:** https://medreview-six.vercel.app
- **GitHub:** https://github.com/Ifem1/MedReview
- **GenLayer Explorer:** https://genlayer-explorer.vercel.app
- **Contract Address:** `0x5a4908AFf834c9A8D7bA9Bf217CC2488540eA1C6`
