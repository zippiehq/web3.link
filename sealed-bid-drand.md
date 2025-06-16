
# Sealed Bid via drand Timelock Encryption

This design uses **drand timelock encryption** to implement a sealed bid mechanism for time-bounded **computation slots**.

## Overview

Sealed bids ensure that participants submit their bids without knowledge of the bids submitted by others. Only after a predetermined time are all bids revealed, preserving fairness and preventing front-running.

This mechanism enables fair allocation of scarce **computation slots**, where participants bid for the right to execute jobs or access resources within a defined time window. The approach supports early resolution, decentralized verification, and works across L1 and L2 environments.

## Mechanism

- **Encryption Phase**:
  - Each bidder encrypts their bid using a timelock encryption scheme powered by [drand](https://drand.love/), a distributed randomness beacon.
  - The encryption uses the public randomness that will be revealed at a future round `R`, ensuring the bid cannot be decrypted until that time.

- **Submission Phase**:
  - Encrypted bids are submitted on **Ethereum L1** as calldata.
  - This ensures canonical ordering, strong inclusion guarantees, and universal access to the sealed bids.
  - Bidders may optionally attach metadata (e.g. address, commitment proofs).

- **Reveal Phase**:
  - When drand publishes randomness for round `R`, the ciphertexts can be decrypted.
  - All bids are revealed simultaneously, preserving the integrity of the sealed bid process.

## Early Resolution (Pre-Reveal Winner Selection)

To allow the system to resolve outcomes (e.g. assign computation slots) ahead of the public decryption, a **prior round `R - Δ`** is used to derive a shared secret:

- At round `R - Δ`, drand emits a randomness value.
- Because all encrypted bids are posted on L1, **anyone** can use this randomness to decrypt all bids and determine the winner.
- This process is **fully public and permissionless** — there is no need for a trusted party or TEE.
- The result may be optionally proven using a TEE or ZK proof, but winner knowledge is available to everyone at the same time.

This early resolution window allows the system to coordinate ahead of time, while still ensuring full public verifiability once `R` arrives.

## L1 Time Anchoring for Timelock Rounds

To securely enforce the timeline (e.g., "before reveal"), the protocol uses **Ethereum L1 block hashes** as a trust anchor:

- A known L1 block hash `H_L1` is used to establish when drand round `R - Δ` should be available.
- The system maps block timestamps to drand rounds using the known emission rate (e.g., one round every 30 seconds).
- Smart contracts and watchers can use `H_L1` to determine whether early evaluation is allowed.

This anchoring ensures that timelock boundaries are objectively and securely enforced using the Ethereum base layer.

## TEE-Based Early Proofs Across L2s

Although anyone can decrypt bids and determine the winner once `R - Δ` randomness is live, some systems may require **verifiable proofs** for coordination across layers:

- TEEs (e.g. Nitro Enclaves, SGX) or ZK circuits may be used to:
  - Decrypt bids.
  - Evaluate winner logic.
  - Generate attestations, signatures, or ZK proofs.

These proofs can then be:
- Submitted to **any L2 or off-chain coordination layer**.
- Used to conditionally trigger slot assignments or finalize auctions within the pre-reveal window.

This design ensures **cross-rollup coordination**, **verifiable early resolution**, and **trusted execution without requiring centralized parties**.

## Step-by-Step: Slot Winner Selection

1. **Slot announcement**:
   - A new computation slot is announced, targeting a future execution window.
   - This corresponds to a drand round `R` whose randomness will unlock the bids.

2. **Bid encryption**:
   - Bidders encrypt their bid values using timelock encryption tied to drand round `R`.

3. **Bid submission**:
   - Encrypted bids are submitted to Ethereum L1 before a cutoff time.
   - All bids are publicly visible, but their contents remain hidden.

4. **Early resolution window begins**:
   - At drand round `R - Δ`, randomness is published.
   - Anyone can now decrypt all bids and determine the winner.

5. **Optional proof generation**:
   - A TEE or verifier may produce a signature or ZK proof of the result for consumption by smart contracts or off-chain agents.

6. **Slot finalization**:
   - Once round `R` arrives and the original bids are decrypted publicly, the result can be fully audited.
   - If early proofs were published, they can be confirmed against the final reveal.
   - Disputes or slashing mechanisms may apply in case of mismatch or fraud.

This process ensures secure, private bidding with deterministic and verifiable resolution — usable across chains and execution layers.

## Slot Duration and L1 Signaling Constraints

Because early evaluation depends on **secure signaling of L1 block hashes to L2s or TEEs**, slot durations must account for potential delays:

- **L1 block finalization**: ~12 minutes (to ensure canonical inclusion)
- **Bridge or oracle relay to L2**: ~1–3 additional minutes
- **Total delay budget**: ~15 minutes before `R - Δ` is considered confirmed

As a result, slot timing must safely accommodate this delay before any early evaluation begins.

### Recommended Minimum Slot Durations

| Use Case                          | Recommended Slot Length |
|----------------------------------|--------------------------|
| MEV markets, fast auctions       | ≥ 30 minutes             |
| General compute bidding          | ≥ 1 hour                 |
| Storage/enclave-heavy workflows  | ≥ 6 hours                |

The system does not prescribe a fixed slot length. Instead, applications may configure slot durations based on their compute models and coordination needs.

## Execution Responsibility by Layer

This protocol is designed to minimize on-chain computation and maximize cross-layer verifiability.

| Layer         | Responsibility                                    | Compute Required |
|---------------|----------------------------------------------------|------------------|
| **L1**        | Stores encrypted bids, exposes block hash          | ❌ No            |
| **L2**        | Reads L1 block hash, accepts/verifies winner proofs| ✅ Minimal        |
| **TEE/ZK**    | (Optional) Generates proof of winner                | ✅ Optional       |
| **Users**     | Submit bids, decrypt bids, verify results          | ✅ Yes            |

Ethereum L1 acts purely as a **data and finality layer**. It does not perform any computation or verification. All evaluation and winner selection is accessible to the public at the unlock time.

## Benefits

- **Fairness**: Prevents front-running or collusion by ensuring bids remain secret until the reveal phase.
- **Advance Coordination**: Enables early winner detection based on open randomness.
- **Universal Access**: All participants can access encrypted bids directly from L1 calldata.
- **Trust-minimized**: No trusted party is needed to evaluate or declare winners.
- **Cross-chain Compatible**: Any L2 or off-chain agent can validate results against shared L1 data.
- **Robust Security**: L1 guarantees simplify consensus and reduce reorg or censorship risk.

## Applications

- Auctions and fee markets
- Pre-confirmed compute slot allocation
- Private coordination in decentralized systems
- Resource scheduling with secrecy guarantees

## References

- [drand Timelock Encryption](https://drand.love/developer/timelock/)
- [Timelock Puzzles and Applications](https://eprint.iacr.org/2015/910.pdf)
- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
