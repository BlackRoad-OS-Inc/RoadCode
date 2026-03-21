# Paper 11: The Amundson Sequence — Paper A (LaTeX, 13pp)

**Author:** Alexa Louise Amundson
**Institution:** BlackRoad OS, Inc. · Lakeville, MN
**Contact:** alexa@blackroad.company
**Date:** March 2026
**Source:** Local — `~/Downloads/amundson paper a.pdf` (13 pages, LaTeX)
**Verified:** 2026-03-21 by CECE session

---

## Abstract

We introduce and study the sequence G(n) = n^(n+1)/(n+1)^n, which we call the *Amundson sequence*. We establish five algebraically equivalent representations, forward and backward translation invariance, a removable singularity at n=0, and a mirror duality M(n) = 1/G(n) such that G and M form dual envelopes of e. We derive a closed-form product formula, ratio formula, and sixth representation via triangular numbers. We show G satisfies a first-order linear ODE and arises from a variational principle. The Ramanujan asymptotic refinement gives G(n) = n/e + 1/(2e) + O(1/n). We define the **Amundson constant** A_G = Σ G(n)/n! ≈ 1.244331783986725, verified to fifteen decimal places.

## Table of Contents (9 Sections)

1. **Definition, Origin, and Physical Motivation** — G(n) definition, Bohr electron velocity identity, canonical form
2. **Five Equivalent Forms and Translation Invariance** — F1-F5 representations, forward/backward invariance
3. **The Removable Singularity and the Mirror Function** — G(0) = 0 cleanly, G-M duality
4. **Product Formula, Ratio Formula, and Triangular Encoding** — Telescoping product, ratio, Form 6
5. **Asymptotics and the Amundson Constant** — Ramanujan refinement, A_G ≈ 1.24433
6. **The First-Order ODE and Variational Origin** — Log differentiation, variational principle
7. **The Two-Variable Extension and Statistical Boundary** — G(n,m) generalization
8. **Open Questions** — 10+ research directions
9. **Summary of Principal Results** — All theorems collected

## The Five Forms

| Form | Expression | Name |
|------|-----------|------|
| F1 | G(n) = n / (1+1/n)^n | Quotient |
| F2 | G(n) = n · (n/(n+1))^n | Product |
| F3 | G(n) = n^(n+1) / (n+1)^n | Canonical |
| F4 | G(n) = n · Π(k=1..n) n/(n+1) | Iterated product |
| F5 | G(n) = (n+1) / (1+1/n)^(n+1) | Forward form |

## Key Results

- **Bohr Velocity Identity** (Thm 1.1): G(n) = n · (v_{n+1}/v_n)^n — exact, not analogy
- **Translation Invariance** (Cor 2.4): G is reproduced by both n→n+1 and n→n-1
- **Self-Referential Stability** (Rmk 2.5): Unlike Turing's halting oracle, self-application of G is productive, not paradoxical
- **Removable Singularity** (Thm 3.1): G(0) = 0^1/1^0 = 0/1 = 0, no indeterminate form
- **G-M Duality** (Thm 3.3): G(n)·M(n) = 1 for all n > 0
- **Telescoping Product**: Π G(k) = (n!)² / (n+1)^n
- **Ratio Formula**: G(n)/G(n-1) = [n²/(n²-1)]^n
- **Form 6 (Triangular)**: G(n) = n^(2n+1) / (2T(n))^n where T(n) = n(n+1)/2
- **Amundson Constant**: A_G = Σ G(n)/n! ≈ 1.244331783986725 (15 decimal places, new constant)
- **Ramanujan Regularization**: Divergent sum regularizes to -1/(12e)
- **ODE**: G satisfies first-order linear ODE via logarithmic differentiation
- **Variational**: G arises from δ∫½(G'-fG)² dn = 0

## Initial Values

| n | G(n) | Exact | Decimal |
|---|------|-------|---------|
| 0 | 0^1/1^0 | 0 | 0 |
| 1 | 1²/2¹ | 1/2 | 0.500 |
| 2 | 2³/3² | 8/9 | 0.888... |
| 3 | 3⁴/4³ | 81/64 | 1.265625 |
| 4 | 4⁵/5⁴ | 1024/625 | 1.6384 |
| 5 | 5⁶/6⁵ | 15625/7776 | 2.00902... |

---

**Status**: Verified against 13-page LaTeX PDF. This is the foundational paper.
