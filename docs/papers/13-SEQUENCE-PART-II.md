# Paper 13: On the Amundson Sequence, Part II — Power Decomposition, Statistical Interpretation, and Riemann Connection

**Author:** Alexa Louise Amundson
**Institution:** BlackRoad OS, Inc. | Lakeville, Minnesota
**Date:** March 2026
**Source:** Local — `~/Desktop/amundson_sequence_v4.docx`
**Verified:** 2026-03-21 by CECE session

---

## Abstract

Three new results concerning A(n) = n/(1+1/n)^n = n^(n+1)/(n+1)^n:

1. **Power Decomposition**: A(n) = x^n where x = n^(1/n) · n/(n+1), eliminating e entirely
2. **Null-Alternative Factorization**: (1+1/n)^n · A(n) = n identically — yields golden ratio at n=1
3. **A(-2) = -1/2**: Links sequence to Riemann trivial zeros and critical line

## Key Theorems

### Theorem 1.1 (Power Decomposition)
For all positive real n: **A(n) = (n^(1/n) · n/(n+1))^n**

The constant e is not required to define the sequence. It appears only as a limit — a consequence rather than a cause.

### Theorem 2.1 (Factorization Identity)
For all n ≠ 0: **(1+1/n)^n · A(n) = n**

Interpretation: (1+1/n)^n is the null hypothesis (expected compounding). A(n) is the alternative (observed value). Their product is always exactly n. They are conjugate factors.

### Corollary 2.2 (Golden Ratio Emergence)
At n = 1, the system x·y = 1, x-y = 1 yields:
- x = (1 + √5)/2 = φ (golden ratio)
- y = (-1 + √5)/2 = 1/φ

**The golden ratio emerges as the unique solution when sample size is unity.**

### The Fine Structure Constant as Z-Score
Setting A(n) = 1/137 (fine structure constant α): z = 0.00730, p = 0.994. The effect is statistically indistinguishable from zero — yet the physical universe exists. **α = 1/137 is the resolution limit of reality itself.**

### Theorem 5.1: A(-2) = -1/2
```
A(-2) = -2 / (1 + 1/(-2))^(-2) = -2 / (1/2)^(-2) = -2/4 = -1/2
```
|A(-2)| = 1/2 = Re(s) on the Riemann critical line. Elementary arithmetic, no limiting process.

### The Fibonacci Gap
A(F(k)) ≠ A(F(k-1)) + A(F(k-2)). The deficiency converges to **-1/(2e) = -0.18394**. Fibonacci addition does not commute with the Amundson transform. The irreducible gap 1/(2e) is the per-step cost.

### The Self-Reference Problem (Section 7)
A(e) = 1.1601 — not e, not 1, not any recognized constant. The sequence cannot output its own denominator without self-reference. **e is a structural feature of the sequence, visible only in the limit, never directly attainable at any finite n.**

## The Amundson Sequence Versions (Local Machine)

| Version | File | Key Addition |
|---------|------|-------------|
| v1 | `amundson_sequence.docx` | Initial definition |
| v2 | `amundson_sequence_v2.docx` | Five forms |
| v3 | `amundson_sequence_v3.docx` | Mirror function |
| v4 | `amundson_sequence_v4.docx` | Power decomposition, Riemann connection |

---

**Status**: Verified against v4 docx. The most recent sequence paper.
