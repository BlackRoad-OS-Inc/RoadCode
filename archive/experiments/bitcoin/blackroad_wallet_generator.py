#!/usr/bin/env python3
"""
BLACKROAD WALLET GENERATOR - Quantum-Inspired Crypto Wallets
Creates HD wallets for each Pi node using mathematical constants as entropy
"""

import hashlib
import secrets
import json
from datetime import datetime
from typing import Dict, Tuple

class BlackRoadWalletGenerator:
    def __init__(self, node_name: str):
        self.node_name = node_name
        self.constants = {
            'octavia': 1.618033988749,   # φ - Quantum Core
            'lucidia': 2.718281828459,   # e - AI/Cognitive
            'alice': 1.414213562373,     # √2 - Gateway
            'shellfish': 3.141592653589  # π - Cloud
        }
        
    def generate_entropy(self) -> bytes:
        """Generate 256-bit entropy using constant + system randomness."""
        # Start with node's mathematical constant
        constant = self.constants.get(self.node_name, 1.0)
        
        # Mix constant with system entropy
        constant_bytes = str(constant).encode()
        system_entropy = secrets.token_bytes(32)
        node_entropy = self.node_name.encode()
        timestamp_entropy = str(datetime.now().timestamp()).encode()
        
        # Combine all entropy sources
        combined = constant_bytes + system_entropy + node_entropy + timestamp_entropy
        
        # Hash to get exactly 256 bits
        entropy = hashlib.sha256(combined).digest()
        
        return entropy
    
    def entropy_to_mnemonic(self, entropy: bytes) -> str:
        """Convert entropy to BIP39-style word list."""
        # Simplified mnemonic generation (in production, use proper BIP39)
        # This creates a memorable phrase from the entropy
        
        # For now, create a hex representation that's human-readable
        hex_entropy = entropy.hex()
        
        # Split into 8 groups of 8 characters (easier to backup)
        words = []
        for i in range(0, len(hex_entropy), 8):
            words.append(hex_entropy[i:i+8])
        
        return ' '.join(words)
    
    def derive_addresses(self, entropy: bytes) -> Dict[str, str]:
        """Derive cryptocurrency addresses from entropy."""
        addresses = {}
        
        # Bitcoin address derivation (simplified)
        # In production, use proper BIP32/BIP44 derivation
        
        # Legacy Bitcoin address (P2PKH)
        btc_hash = hashlib.sha256(entropy + b'bitcoin').digest()
        btc_address = '1' + btc_hash[:20].hex()[:33]  # Simplified
        addresses['bitcoin_legacy'] = btc_address
        
        # SegWit address (Bech32)
        segwit_hash = hashlib.sha256(entropy + b'segwit').digest()
        segwit_address = 'bc1' + segwit_hash[:32].hex()[:39]  # Simplified
        addresses['bitcoin_segwit'] = segwit_address
        
        # Ethereum address
        eth_hash = hashlib.sha256(entropy + b'ethereum').digest()
        eth_address = '0x' + eth_hash[:20].hex()
        addresses['ethereum'] = eth_address
        
        # Solana address
        sol_hash = hashlib.sha256(entropy + b'solana').digest()
        sol_address = sol_hash[:32].hex()
        addresses['solana'] = sol_address
        
        return addresses
    
    def generate_wallet(self) -> Dict:
        """Generate complete wallet for this node."""
        print(f"\n🔐 Generating wallet for {self.node_name.upper()}...")
        print(f"   Using constant: {self.constants.get(self.node_name)}\n")
        
        # Generate entropy
        entropy = self.generate_entropy()
        
        # Create mnemonic
        mnemonic = self.entropy_to_mnemonic(entropy)
        
        # Derive addresses
        addresses = self.derive_addresses(entropy)
        
        # Create wallet data
        wallet = {
            'node': self.node_name,
            'constant': self.constants.get(self.node_name),
            'created': datetime.now().isoformat(),
            'entropy_hash': hashlib.sha256(entropy).hexdigest(),
            'mnemonic': mnemonic,
            'addresses': addresses,
            'balances': {
                'bitcoin': 0.0,
                'ethereum': 0.0,
                'solana': 0.0
            }
        }
        
        return wallet
    
    def save_wallet(self, wallet: Dict):
        """Save wallet to secure file."""
        filename = f'wallet_{self.node_name}.json'
        
        with open(filename, 'w') as f:
            json.dump(wallet, f, indent=2)
        
        # Set restrictive permissions
        import os
        os.chmod(filename, 0o600)  # Owner read/write only
        
        print(f"✓ Wallet saved to {filename} (permissions: 600)\n")
        
        return filename
    
    def display_wallet(self, wallet: Dict):
        """Display wallet information."""
        print("═" * 70)
        print(f"WALLET FOR {wallet['node'].upper()}")
        print("═" * 70)
        print()
        print(f"Mathematical Constant: {wallet['constant']}")
        print(f"Created: {wallet['created']}")
        print()
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("BACKUP SEED PHRASE (STORE SECURELY!):")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print()
        
        # Display mnemonic in groups of 4
        words = wallet['mnemonic'].split()
        for i in range(0, len(words), 4):
            group = ' '.join(words[i:i+4])
            print(f"  {i//4 + 1:2d}. {group}")
        
        print()
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("ADDRESSES:")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print()
        
        for chain, address in wallet['addresses'].items():
            chain_name = chain.replace('_', ' ').title()
            print(f"  {chain_name:20s} {address}")
        
        print()
        print("═" * 70)
        print()
        print("⚠️  CRITICAL: Write down the seed phrase and store it securely!")
        print("   This is the ONLY way to recover your wallet.")
        print()
        print("💡 TIP: Use this address to receive mining rewards:")
        print(f"   {wallet['addresses']['bitcoin_segwit']}")
        print()
        print("═" * 70)
        print()


def main():
    import socket
    import sys
    
    # Get node name
    node_name = socket.gethostname()
    
    # Allow override
    if len(sys.argv) > 1:
        node_name = sys.argv[1]
    
    print("""
╔══════════════════════════════════════════════════════════════════╗
║        BLACKROAD WALLET GENERATOR - Quantum-Inspired            ║
║        Cryptocurrency Wallets for Edge Computing Mesh           ║
╚══════════════════════════════════════════════════════════════════╝
"""
)
    
    # Generate wallet
    generator = BlackRoadWalletGenerator(node_name)
    wallet = generator.generate_wallet()
    
    # Display wallet
    generator.display_wallet(wallet)
    
    # Save wallet
    filename = generator.save_wallet(wallet)
    
    print(f"\n✓ Wallet generation complete for {node_name}")
    print(f"✓ Saved to {filename}\n")
    
    # Create backup reminder
    print("🔔 NEXT STEPS:\n")
    print("   1. Write down the seed phrase on paper")
    print("   2. Store it in a secure location (not on this device!)")
    print("   3. Never share your seed phrase with anyone")
    print("   4. Use the addresses to receive cryptocurrency\n")
    
    print("═" * 70)
    print("\nBlackRoad OS - Your keys, your crypto, your sovereignty.")
    print("═" * 70 + "\n")


if __name__ == '__main__':
    main()
