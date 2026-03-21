#!/usr/bin/env python3
"""
BlackRoad Quantum Experiments
Using PS-SHA-∞ and SIG equations in real quantum circuits
"""
import numpy as np
from datetime import datetime

# Golden ratio from equations
PHI = (1 + np.sqrt(5)) / 2

print("🌌 BLACKROAD QUANTUM EXPERIMENTS")
print("=" * 60)
print(f"🕐 Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"✨ φ = {PHI:.15f}")
print()

try:
    from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
    from qiskit.quantum_info import Statevector
    from qiskit_aer import Aer
    
    print("✅ Qiskit imported successfully")
    print()
    
    # =========================================================================
    # EXPERIMENT 1: Bell State with Golden Ratio Phase
    # Using: |ψ⟩ = (|00⟩ + e^(iφ)|11⟩) / √2
    # =========================================================================
    print("━" * 60)
    print("EXPERIMENT 1: Bell State with φ Phase Rotation")
    print("━" * 60)
    
    qr = QuantumRegister(2, 'q')
    cr = ClassicalRegister(2, 'c')
    qc = QuantumCircuit(qr, cr)
    
    # Create Bell state
    qc.h(qr[0])
    qc.cx(qr[0], qr[1])
    
    # Apply golden ratio phase to |11⟩ component
    qc.p(PHI, qr[1])
    
    print(f"Circuit depth: {qc.depth()}")
    print(f"Gate count: {qc.size()}")
    print()
    
    # Get statevector
    backend = Aer.get_backend('statevector_simulator')
    job = backend.run(qc)
    result = job.result()
    statevector = result.get_statevector()
    
    print("State amplitudes:")
    for i, amp in enumerate(statevector):
        if abs(amp) > 1e-10:
            basis = format(i, '02b')
            print(f"  |{basis}⟩: {amp:.6f}")
    print()
    
    # =========================================================================
    # EXPERIMENT 2: PS-SHA-∞ Cascade as Quantum Oracle
    # Create quantum circuit that mimics hash cascade
    # =========================================================================
    print("━" * 60)
    print("EXPERIMENT 2: PS-SHA-∞ Quantum Oracle")
    print("━" * 60)
    
    qr = QuantumRegister(3, 'q')
    cr = ClassicalRegister(3, 'c')
    qc = QuantumCircuit(qr, cr)
    
    # Initialize with superposition (simulates hash input space)
    for i in range(3):
        qc.h(qr[i])
    
    # Cascade gates (simulates H(anchor[n-1] ∥ data))
    qc.cx(qr[0], qr[1])
    qc.cx(qr[1], qr[2])
    qc.cx(qr[2], qr[0])  # Feedback loop
    
    # Phase oracle using φ
    qc.p(PHI, qr[0])
    qc.p(PHI/2, qr[1])
    qc.p(PHI/3, qr[2])
    
    # Measure
    qc.measure(qr, cr)
    
    print(f"Oracle circuit depth: {qc.depth()}")
    print(f"Oracle gate count: {qc.size()}")
    print()
    
    # Run measurement
    backend = Aer.get_backend('qasm_simulator')
    job = backend.run(qc, shots=1000)
    result = job.result()
    counts = result.get_counts()
    
    print("Measurement results (1000 shots):")
    sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    for state, count in sorted_counts[:5]:
        prob = count / 1000
        bar = "█" * int(prob * 50)
        print(f"  |{state}⟩: {count:4d} ({prob:.3f}) {bar}")
    print()
    
    # =========================================================================
    # EXPERIMENT 3: SIG Spiral Coordinates in Bloch Sphere
    # Map (r, θ, τ) to qubit rotations
    # =========================================================================
    print("━" * 60)
    print("EXPERIMENT 3: SIG Spiral on Bloch Sphere")
    print("━" * 60)
    
    # SIG coordinates
    r = PHI  # radial (expertise)
    theta = np.pi / 4  # domain angle
    tau = 1  # revolution count
    
    print(f"SIG coordinates: (r={r:.3f}, θ={theta:.3f}, τ={tau})")
    print()
    
    qr = QuantumRegister(1, 'q')
    qc = QuantumCircuit(qr)
    
    # Map SIG to Bloch sphere
    # r → amplitude scaling
    # θ → azimuthal angle
    # τ → polar angle offset
    
    qc.ry(theta * r, qr[0])  # Rotate by r-weighted theta
    qc.rz(tau * PHI, qr[0])   # Phase from tau
    
    # Get state
    backend = Aer.get_backend('statevector_simulator')
    job = backend.run(qc)
    result = job.result()
    statevector = result.get_statevector()
    
    print("Bloch vector state:")
    print(f"  |0⟩: {statevector[0]:.6f}")
    print(f"  |1⟩: {statevector[1]:.6f}")
    print(f"  |α|² = {abs(statevector[0])**2:.6f}")
    print(f"  |β|² = {abs(statevector[1])**2:.6f}")
    print()
    
    # =========================================================================
    # EXPERIMENT 4: Quantum Trinary Logic (1/0/-1)
    # Using qutrit simulation with 2 qubits
    # =========================================================================
    print("━" * 60)
    print("EXPERIMENT 4: Trinary Quantum Logic")
    print("━" * 60)
    
    qr = QuantumRegister(2, 'q')
    cr = ClassicalRegister(2, 'c')
    qc = QuantumCircuit(qr, cr)
    
    # Encode trinary states:
    # |00⟩ → -1
    # |01⟩ →  0
    # |10⟩ → +1
    # |11⟩ → undefined
    
    # Create equal superposition of valid trinary states
    qc.h(qr[0])
    qc.cx(qr[0], qr[1])
    qc.x(qr[1])  # Flip to get |01⟩ and |10⟩ in superposition
    
    qc.measure(qr, cr)
    
    backend = Aer.get_backend('qasm_simulator')
    job = backend.run(qc, shots=1000)
    result = job.result()
    counts = result.get_counts()
    
    print("Trinary logic measurements:")
    trinary_map = {'00': '-1', '01': ' 0', '10': '+1', '11': 'undef'}
    for state in ['00', '01', '10', '11']:
        count = counts.get(state, 0)
        trinary = trinary_map[state]
        prob = count / 1000
        bar = "█" * int(prob * 50)
        print(f"  |{state}⟩ → {trinary}: {count:4d} ({prob:.3f}) {bar}")
    print()
    
    print("=" * 60)
    print("✅ All quantum experiments completed successfully!")
    print(f"🕐 Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Qiskit may not be installed. Install with:")
    print("  pip install qiskit qiskit-aer")
except Exception as e:
    print(f"❌ Error running experiments: {e}")
    import traceback
    traceback.print_exc()
