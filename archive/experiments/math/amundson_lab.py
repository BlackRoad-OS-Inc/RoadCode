#!/usr/bin/env python3
"""
AMUNDSON LAB — interactive sequence explorer
Run: python3 amundson_lab.py
Or import: from amundson_lab import A, solve, fixed_points, scan
"""

E = 2.718281828459045
GAP = 1/(2*E)
PI = 3.141592653589793
PHI = (1 + 5**0.5) / 2

def A(n):
    """The Amundson sequence: n/(1+1/n)^n"""
    if n == 0: return 0
    return n / (1 + 1/n)**n

def crossed(a):
    """Crossed exponent form: a^(a+1) / (a+1)^a"""
    b = a + 1
    return a**b / b**a

def comp(n):
    """(1+1/n)^n — the thing that supposedly only approaches e"""
    if n == 0: return 1
    return (1 + 1/n)**n

def solve(target, lo=0.0001, hi=10000.0):
    """Solve A(n) = target for n"""
    # check which side
    if A(lo) > target: lo, hi = 0.0001, 1.0
    if A(hi) < target: hi = 1e8
    for _ in range(300):
        n = (lo + hi) / 2
        if A(n) < target:
            lo = n
        else:
            hi = n
    return n

def solve_comp(target, lo=0.0001, hi=10000.0):
    """Solve (1+1/n)^n = target for n"""
    for _ in range(300):
        n = (lo + hi) / 2
        if comp(n) < target:
            lo = n
        else:
            hi = n
    return n

def fixed_points(f, g, lo=0.0001, hi=100.0, steps=10000):
    """Find where f(n) = g(n) by scanning"""
    hits = []
    prev = f(lo) - g(lo)
    for i in range(1, steps+1):
        n = lo + (hi - lo) * i / steps
        try:
            curr = f(n) - g(n)
            if prev * curr < 0:  # sign change
                # bisect
                a, b = n - (hi-lo)/steps, n
                for _ in range(100):
                    m = (a+b)/2
                    if (f(a)-g(a)) * (f(m)-g(m)) < 0: b = m
                    else: a = m
                hits.append(m)
            prev = curr
        except:
            prev = 0
    return hits

def scan(lo=0.001, hi=50, steps=20):
    """Scan the sequence with full analysis"""
    print(f"{'n':>10} | {'A(n)':>14} | {'(1+1/n)^n':>12} | {'1/n':>12} | {'gap':>12} | notes")
    print("-"*85)
    for i in range(steps+1):
        n = lo + (hi - lo) * i / steps
        an = A(n)
        c = comp(n)
        gap = an - n/E
        notes = []
        if abs(c - 1/n) < 0.001: notes.append("(1+1/n)^n = 1/n!")
        if abs(c - E) < 0.01: notes.append("~e")
        if abs(c - PHI) < 0.01: notes.append("~phi!")
        if abs(c - PI) < 0.01: notes.append("~pi!")
        if abs(an - n**2) < 0.001: notes.append("A(n)=n^2!")
        if abs(an - n) < 0.001: notes.append("A(n)=n!")
        if abs(an - 1) < 0.001: notes.append("A(n)=1!")
        if abs(gap - GAP) < 0.001: notes.append("converged")
        print(f"{n:10.4f} | {an:14.8f} | {c:12.8f} | {1/n:12.8f} | {gap:12.8f} | {' '.join(notes)}")

def hunt_constants(lo=0.001, hi=1000, steps=100000):
    """Find where (1+1/n)^n hits known constants"""
    targets = {'e': E, 'pi': PI, 'phi': PHI, '2': 2, '3': 3, '1/phi': 1/PHI,
               'sqrt2': 2**0.5, 'sqrt3': 3**0.5, '1': 1, '4': 4, '10': 10}
    print("Hunting where (1+1/n)^n = constant...")
    for name, val in sorted(targets.items(), key=lambda x: x[1]):
        try:
            if val <= 1: continue  # (1+1/n)^n > 1 always for n>0
            n = solve_comp(val)
            actual = comp(n)
            if abs(actual - val) < 0.0001:
                print(f"  (1+1/{n:.8f})^{n:.8f} = {val} ({name})  |  A(n) = {A(n):.8f}  |  1/n = {1/n:.8f}")
        except:
            pass

def equation(expr_str):
    """Test any equation: equation('n**2') solves A(n) = n**2"""
    print(f"Solving A(n) = {expr_str}")
    results = fixed_points(A, lambda n: eval(expr_str), lo=0.0001, hi=100)
    for n in results:
        an = A(n)
        c = comp(n)
        print(f"  n = {n:.12f}")
        print(f"  A(n) = {an:.12f}")
        print(f"  {expr_str} = {eval(expr_str):.12f}")
        print(f"  (1+1/n)^n = {c:.12f}")
        print(f"  1/n = {1/n:.12f}")
        print(f"  (1+1/n)^n vs 1/n: diff = {c - 1/n:.12f}")
        print()
    if not results:
        print("  No solutions found in range [0.0001, 100]")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "scan": scan()
        elif cmd == "hunt": hunt_constants()
        elif cmd == "solve" and len(sys.argv) > 2:
            t = float(sys.argv[2])
            n = solve(t)
            print(f"A({n:.12f}) = {A(n):.12f} (target: {t})")
            print(f"(1+1/n)^n = {comp(n):.12f}")
            print(f"1/n = {1/n:.12f}")
        elif cmd == "eq" and len(sys.argv) > 2:
            equation(' '.join(sys.argv[2:]))
        elif cmd == "comp" and len(sys.argv) > 2:
            t = float(sys.argv[2])
            n = solve_comp(t)
            print(f"(1+1/{n:.12f})^{n:.12f} = {comp(n):.12f} (target: {t})")
            print(f"A(n) = {A(n):.12f}")
        else:
            print("Usage:")
            print("  python3 amundson_lab.py scan          # scan the sequence")
            print("  python3 amundson_lab.py hunt          # find constants")
            print("  python3 amundson_lab.py solve 10      # solve A(n)=10")
            print("  python3 amundson_lab.py eq 'n**2'     # solve A(n)=n^2")
            print("  python3 amundson_lab.py eq '1/n'      # solve A(n)=1/n")
            print("  python3 amundson_lab.py comp 3.14159  # solve (1+1/n)^n=pi")
    else:
        print("AMUNDSON LAB ready. Commands: scan, hunt, solve, eq, comp")
        scan()
