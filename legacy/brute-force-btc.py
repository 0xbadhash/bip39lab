import hashlib
import secrets
import binascii
import requests
import time
import sys
import hmac
import logging
import os
import json
import argparse
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration file handling
CONFIG_FILE = "bitcoin_scanner.conf"
DEFAULT_CONFIG = {
    "local_node": {
        "enabled": True,
        "rpc_url": "http://localhost:8332/",
        "rpc_user": "your_username",
        "rpc_password": "your_password",
        "timeout": 30
    },
    "external_apis": {
        "enabled": True,
        "timeout": 15,
        "apis": [
            {
                "name": "Blockstream.info",
                "url": "https://blockstream.info/api/address/{address}/balance",
                "enabled": True,
                "extract_balance": "lambda r: r.json().get(\"confirmed\", 0)"
            },
            {
                "name": "Blockchain.com V3",
                "url": "https://api.blockchain.com/v3/blockchain/address/{address}/balance",
                "enabled": True,
                "extract_balance": "lambda r: r.json().get(\"balance\", 0)"
            },
            {
                "name": "Blockchain.info",
                "url": "https://blockchain.info/rawaddr/{address}",
                "enabled": True,
                "extract_balance": "lambda r: r.json().get(\"final_balance\", 0)"
            },
            {
                "name": "Chain.so",
                "url": "https://chain.so/api/v2/address/BTC/{address}",
                "enabled": True,
                "extract_balance": "lambda r: r.json().get(\"data\", {}).get(\"balance\", 0)"
            },
            {
                "name": "Bitaps.com",
                "url": "https://bitaps.com/api/address/{address}",
                "enabled": True,
                "extract_balance": "lambda r: r.json().get(\"balance\", 0)"
            }
        ]
    },
    "scanner": {
        "rate_limit_delay": 1,
        "log_file": "tested_mnemonics.json",
        "wordlist_url": "https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt"
    }
}

def load_config():
    """Load configuration from file or create default if it doesn't exist"""
    config_path = Path(CONFIG_FILE)
    
    if config_path.exists():
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
            logger.info(f"Loaded configuration from {CONFIG_FILE}")
            return config
        except Exception as e:
            logger.error(f"Failed to load config file: {e}. Using default configuration.")
            return create_default_config()
    else:
        logger.info(f"Config file {CONFIG_FILE} not found. Creating default configuration.")
        return create_default_config()

def create_default_config():
    """Create default configuration file"""
    try:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(DEFAULT_CONFIG, f, indent=4)
        logger.info(f"Created default configuration file: {CONFIG_FILE}")
        logger.info("Please edit this file with your RPC credentials and API preferences.")
        return DEFAULT_CONFIG
    except Exception as e:
        logger.error(f"Failed to create config file: {e}. Using in-memory default.")
        return DEFAULT_CONFIG

def show_config_status():
    """Show current configuration status"""
    print("\n=== Configuration Status ===")
    print(f"Config file: {CONFIG_FILE}")
    print(f"Local node: {'ENABLED' if config['local_node']['enabled'] else 'DISABLED'}")
    if config['local_node']['enabled']:
        print(f"  URL: {config['local_node']['rpc_url']}")
        print(f"  User: {config['local_node']['rpc_user']}")
    
    external_enabled = config["external_apis"]["enabled"]
    print(f"External APIs: {'ENABLED' if external_enabled else 'DISABLED'}")
    if external_enabled:
        enabled_apis = [api['name'] for api in config['external_apis']['apis'] if api['enabled']]
        print(f"  Enabled APIs: {', '.join(enabled_apis)}")
    print("============================\n")

# Load configuration
config = load_config()

# Load wordlist from configured URL
try:
    wordlist_url = config["scanner"]["wordlist_url"]
    response = requests.get(wordlist_url)
    response.raise_for_status()
    wordlist = [word.strip() for word in response.text.splitlines() if word.strip()]
    logger.info(f"Loaded {len(wordlist)} words from {wordlist_url}")
except Exception as e:
    logger.error(f"Failed to load wordlist: {e}")
    sys.exit(1)

# Log file for tested mnemonics with no balance
LOG_FILE = config["scanner"]["log_file"]
tested_mnemonics = set()

def load_tested_mnemonics():
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, 'r') as f:
                data = json.load(f)
                tested_mnemonics.update(data)
            logger.info(f"Loaded {len(tested_mnemonics)} tested mnemonics from {LOG_FILE}")
        except Exception as e:
            logger.warning(f"Failed to load log file: {e}")

def save_tested_mnemonic(mnemonic):
    tested_mnemonics.add(mnemonic)
    try:
        with open(LOG_FILE, 'w') as f:
            json.dump(list(tested_mnemonics), f)
        logger.info(f"Saved mnemonic to log: {mnemonic}")
    except Exception as e:
        logger.error(f"Failed to save to log file: {e}")

# [Keep all the existing Point, ECC, BIP32, address derivation functions exactly as they were]
# Curve parameters from secp256k1
P = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
A = 0
B = 7
G_X = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
G_Y = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8
N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141

class Point:
    def __init__(self, x, y, infinity=False):
        self.x = x
        self.y = y
        self.infinity = infinity

def extended_euclidean(a, b):
    if a == 0:
        return b, 0, 1
    else:
        gcd, y, x = extended_euclidean(b % a, a)
        return gcd, x - (b // a) * y, y

def mod_inverse(a, m):
    gcd, x, _ = extended_euclidean(a, m)
    if gcd != 1:
        raise ValueError("The inverse does not exist")
    else:
        return x % m

def point_add(p1, p2):
    if p1.infinity:
        return p2
    if p2.infinity:
        return p1
    if p1.x == p2.x and p1.y != p2.y:
        return Point(None, None, True)
    if p1.x == p2.x:
        # Doubling
        if p1.y == 0:
            return Point(None, None, True)
        try:
            lamb = (3 * p1.x**2 + A) * mod_inverse(2 * p1.y, P) % P
        except ValueError:
            raise
    else:
        diff_x = (p2.x - p1.x) % P
        if diff_x == 0:
            raise ValueError("Unexpected zero diff_x in non-same x points")
        try:
            lamb = (p2.y - p1.y) * mod_inverse(diff_x, P) % P
        except ValueError:
            raise
    x3 = (lamb**2 - p1.x - p2.x) % P
    y3 = (lamb * (p1.x - x3) - p1.y) % P
    return Point(x3, y3)

def scalar_mult(k, point):
    result = Point(None, None, True)
    addend = point
    while k:
        if k & 1:
            result = point_add(result, addend)
        addend = point_add(addend, addend)
        k >>= 1
    return result

G = Point(G_X, G_Y)

def base58_encode(data):
    alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    n = int.from_bytes(data, 'big')
    result = ''
    while n > 0:
        n, r = divmod(n, 58)
        result = alphabet[r] + result
    leading_zeros = len(data) - len(data.lstrip(b'\x00'))
    return '1' * leading_zeros + result

def convertbits(data, frombits, tobits, pad=True):
    acc = 0
    bits = 0
    ret = []
    maxv = (1 << tobits) - 1
    max_acc = (1 << (frombits + tobits - 1)) - 1
    for value in data:
        if value < 0 or (value >> frombits):
            return None
        acc = ((acc << frombits) | value) & max_acc
        bits += frombits
        while bits >= tobits:
            bits -= tobits
            ret.append((acc >> bits) & maxv)
    if pad:
        if bits:
            ret.append((acc << (tobits - bits)) & maxv)
    elif bits >= frombits or ((acc << (tobits - bits)) & maxv):
        return None
    return ret

def bech32_polymod(values):
    GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]
    chk = 1
    for v in values:
        b = (chk >> 25)
        chk = (chk & 0x1ffffff) << 5 ^ v
        for i in range(5):
            if (b >> i) & 1:
                chk ^= GEN[i]
    return chk

def bech32_hrp_expand(hrp):
    return [ord(x) >> 5 for x in hrp] + [0] + [ord(x) & 31 for x in hrp]

def bech32_create_checksum(hrp, data):
    values = bech32_hrp_expand(hrp) + data
    polymod = bech32_polymod(values + [0, 0, 0, 0, 0, 0]) ^ 1
    return [(polymod >> 5 * (5 - i)) & 31 for i in range(6)]

def bech32_encode(hrp, data):
    combined = data + bech32_create_checksum(hrp, data)
    alphabet = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
    return hrp + '1' + ''.join([alphabet[d] for d in combined])

def pubkey_to_address(pubkey, derivation_type='p2pkh'):
    # COMPRESSED public key format (Ian Coleman standard)
    if pubkey.y % 2 == 0:
        public_key_bytes = b'\x02' + pubkey.x.to_bytes(32, 'big')
    else:
        public_key_bytes = b'\x03' + pubkey.x.to_bytes(32, 'big')
    
    sha = hashlib.sha256(public_key_bytes).digest()
    ripemd = hashlib.new('ripemd160', sha).digest()
    
    if derivation_type == 'p2pkh':
        prefixed = b'\x00' + ripemd
        sha = hashlib.sha256(prefixed).digest()
        sha = hashlib.sha256(sha).digest()
        checksum = sha[:4]
        binary_addr = prefixed + checksum
        address = base58_encode(binary_addr)
    elif derivation_type == 'p2sh':
        # For BIP49 P2SH-P2WPKH: hash160 of the script
        script = b'\x00\x14' + ripemd  # OP_0 + 20-byte hash
        sha = hashlib.sha256(script).digest()
        ripemd_script = hashlib.new('ripemd160', sha).digest()
        prefixed = b'\x05' + ripemd_script
        sha = hashlib.sha256(prefixed).digest()
        sha = hashlib.sha256(sha).digest()
        checksum = sha[:4]
        binary_addr = prefixed + checksum
        address = base58_encode(binary_addr)
    elif derivation_type == 'bech32':
        # For BIP84 native SegWit
        data = convertbits(ripemd, 8, 5)
        address = bech32_encode('bc', [0] + data)
    else:
        raise ValueError("Invalid derivation type")
    
    return address

# BIP32 implementation
def get_master_key(seed):
    h = hmac.new(b'Bitcoin seed', seed, hashlib.sha512).digest()
    master_priv = int.from_bytes(h[0:32], 'big')
    master_chain = h[32:]
    return master_priv, master_chain

def ckd_priv(parent_priv, parent_chain, index):
    if index >= 2**31:  # Hardened child
        msg = b'\x00' + parent_priv.to_bytes(32, 'big') + index.to_bytes(4, 'big')
    else:  # Normal child
        pub = scalar_mult(parent_priv, G)
        if pub.y % 2 == 0:
            compressed_pub = b'\x02' + pub.x.to_bytes(32, 'big')
        else:
            compressed_pub = b'\x03' + pub.x.to_bytes(32, 'big')
        msg = compressed_pub + index.to_bytes(4, 'big')
    
    h = hmac.new(parent_chain, msg, hashlib.sha512).digest()
    il = int.from_bytes(h[0:32], 'big')
    ir = h[32:]
    child_priv = (il + parent_priv) % N
    return child_priv, ir

def derive_priv_key(master_priv, master_chain, path):
    priv = master_priv
    chain = master_chain
    for i in path:
        priv, chain = ckd_priv(priv, chain, i)
    return priv

def get_address(mnemonic, derivation_type):
    logger.info(f"Deriving address for mnemonic: {mnemonic} with type {derivation_type}")
    
    # Generate seed from mnemonic
    seed = hashlib.pbkdf2_hmac('sha512', mnemonic.encode(), b'mnemonic', 2048)
    
    # Get master key
    master_priv, master_chain = get_master_key(seed)
    
    # Set derivation path based on type
    if derivation_type == 'p2pkh':  # BIP44
        full_path = [44 + 2**31, 0 + 2**31, 0 + 2**31, 0, 0]
    elif derivation_type == 'p2sh':  # BIP49
        full_path = [49 + 2**31, 0 + 2**31, 0 + 2**31, 0, 0]
    elif derivation_type == 'bech32':  # BIP84
        full_path = [84 + 2**31, 0 + 2**31, 0 + 2**31, 0, 0]
    else:
        full_path = [44 + 2**31, 0 + 2**31, 0 + 2**31, 0, 0]
    
    # Derive private key
    priv = derive_priv_key(master_priv, master_chain, full_path)
    
    # Get public key
    pub = scalar_mult(priv, G)
    
    # Convert to address
    address = pubkey_to_address(pub, derivation_type)
    logger.info(f"Derived address: {address}")
    return address

def generate_mnemonic(strength):
    entropy = secrets.randbits(strength).to_bytes(strength // 8, 'big')
    entropy_bin = bin(int.from_bytes(entropy, 'big'))[2:].zfill(strength)
    hash_hex = hashlib.sha256(entropy).hexdigest()
    hash_bin = bin(int(hash_hex, 16))[2:].zfill(256)
    checksum_length = strength // 32
    checksum = hash_bin[:checksum_length]
    final_bin = entropy_bin + checksum
    num_words = len(final_bin) // 11
    words = []
    for i in range(num_words):
        start = i * 11
        end = start + 11
        idx = int(final_bin[start:end], 2)
        words.append(wordlist[idx])
    mnemonic = ' '.join(words)
    return mnemonic

# Replace the get_balance function with this improved version:

def get_balance(address):
    logger.info(f"Checking balance for address: {address}")
    balance = None

    # Try local RPC node first if enabled
    if config["local_node"]["enabled"]:
        logger.info("Attempting local RPC node check...")
        try:
            local_config = config["local_node"]
            rpc_url = local_config["rpc_url"]
            rpc_user = local_config["rpc_user"]
            rpc_pass = local_config["rpc_password"]
            timeout = local_config["timeout"]

            logger.info(f"Connecting to local node at {rpc_url}")
            payload = {
                "jsonrpc": "1.0",
                "id": "bitcoin-mnemonic-scanner",
                "method": "scantxoutset",
                "params": ["start", [f"addr({address})"]]
            }
            response = requests.post(
                rpc_url, 
                auth=(rpc_user, rpc_pass), 
                json=payload, 
                timeout=timeout
            )
            logger.info(f"Local node response status: {response.status_code}")
            response.raise_for_status()
            result = response.json().get('result', {})
            logger.debug(f"Local node response: {json.dumps(result, indent=2)}")
            
            if result.get('success'):
                balance_btc = result.get('total_amount', 0)
                balance_sat = int(balance_btc * 100_000_000)
                logger.info(f"✅ Balance from local node: {balance_sat} satoshis")
                return balance_sat
            else:
                logger.error(f"❌ scantxoutset failed on local node. Result: {result}")
        except requests.exceptions.ConnectionError as e:
            logger.error(f"❌ Local node connection failed: {e} - Is your Bitcoin node running?")
        except requests.exceptions.Timeout as e:
            logger.error(f"❌ Local node timeout: {e} - Check your timeout setting")
        except Exception as e:
            logger.error(f"❌ Local node check failed: {e}")

    logger.info("Local node check failed or disabled, trying external APIs...")

    # If local node is disabled or failed, try external APIs
    if config["external_apis"]["enabled"]:
        for api_config in config["external_apis"]["apis"]:
            if not api_config["enabled"]:
                continue
                
            try:
                api_url = api_config["url"].format(address=address)
                logger.info(f"Trying {api_config['name']}: {api_url}")
                
                # Fix the API endpoints here
                if api_config['name'] == "Blockstream.info":
                    # Correct Blockstream endpoint
                    api_url = f"https://blockstream.info/api/address/{address}"
                    response = requests.get(api_url, timeout=config["external_apis"]["timeout"])
                    response.raise_for_status()
                    data = response.json()
                    # Calculate balance: funded - spent
                    funded = data.get('chain_stats', {}).get('funded_txo_sum', 0)
                    spent = data.get('chain_stats', {}).get('spent_txo_sum', 0)
                    balance = funded - spent
                    logger.info(f"✅ Balance from {api_config['name']}: {balance} satoshis")
                    return balance
                    
                elif api_config['name'] == "Blockchain.com V3":
                    # Correct Blockchain.com endpoint
                    api_url = f"https://api.blockchain.com/v3/blockchain/addresses/{address}/balance"
                    response = requests.get(api_url, timeout=config["external_apis"]["timeout"])
                    response.raise_for_status()
                    data = response.json()
                    balance = data.get('balance', {}).get('confirmed', 0)
                    logger.info(f"✅ Balance from {api_config['name']}: {balance} satoshis")
                    return balance
                    
                else:
                    # For other APIs, use the original method
                    extract_func = eval(api_config["extract_balance"])
                    response = requests.get(api_url, timeout=config["external_apis"]["timeout"])
                    response.raise_for_status()
                    balance = extract_func(response)
                    logger.info(f"✅ Balance from {api_config['name']}: {balance} satoshis")
                    return balance
                    
            except Exception as e:
                logger.warning(f"❌ {api_config['name']} check failed: {e}")

    logger.error("❌ All balance checks failed.")
    return 0  # Return 0 as default to avoid NoneType issues

def validate_mnemonic(mnemonic):
    """Validate that a mnemonic contains only valid BIP-39 words"""
    words = mnemonic.split()
    invalid_words = [word for word in words if word not in wordlist]
    
    if invalid_words:
        logger.error(f"Invalid mnemonic: contains invalid words - {', '.join(invalid_words)}")
        return False
    
    if len(words) not in [12, 18, 24]:
        logger.warning(f"Non-standard mnemonic length: {len(words)} words (standard lengths are 12, 18, or 24)")
    
    return True

def process_mnemonic(mnemonic, derivation_types):
    """Process a single mnemonic - derive addresses and check balances"""
    logger.info(f"Processing mnemonic: {mnemonic}")
    print(f"Testing mnemonic: \"{mnemonic}\"")
    
    all_zero = True
    has_error = False
    
    for dtype in derivation_types:
        try:
            address = get_address(mnemonic, dtype)
            balance = get_balance(address)
            
            if balance is None:
                has_error = True
                print(f"Address {address} ({dtype}) balance check failed")
            else:
                print(f"Address {address} ({dtype}) has balance: {balance} satoshis")
                if balance > 0:
                    all_zero = False
                    logger.warning(f"Found balance > 0 for mnemonic: {mnemonic} in {dtype}")
        except Exception as e:
            logger.error(f"Error processing {dtype} derivation for mnemonic: {e}")
            has_error = True
            break
    
    if not has_error and all_zero:
        save_tested_mnemonic(mnemonic)
    
    return not has_error and all_zero

def run_random_generation(word_count, derivation_types):
    """Run the random mnemonic generation and testing loop"""
    strength = {12: 128, 18: 192, 24: 256}[word_count]
    tried = 0
    start_time = time.time()
    rate_limit_delay = config["scanner"]["rate_limit_delay"]
    
    try:
        while True:
            mnemonic = generate_mnemonic(strength)
            if mnemonic in tested_mnemonics:
                logger.info(f"Skipping already tested mnemonic: {mnemonic}")
                continue
            
            process_mnemonic(mnemonic, derivation_types)
            tried += 1
            
            if tried % 10 == 0:
                elapsed = time.time() - start_time
                rate = tried / elapsed if elapsed > 0 else 0
                print(f"Progress: {tried} valid mnemonics tested, {rate:.1f} /sec")
            
            time.sleep(rate_limit_delay)  # Use configured rate limit
    
    except KeyboardInterrupt:
        elapsed = time.time() - start_time
        rate = tried / elapsed if elapsed > 0 else 0
        logger.info("=== DEMO STOPPED ===")
        logger.info(f"Summary: {tried} valid mnemonics tested")
        logger.info(f"Performance: {rate:.1f} per second")
        print("=== DEMO STOPPED ===")
        print(f"Summary: {tried} valid mnemonics tested")
        print(f"Performance: {rate:.1f} per second")
        return tried, rate
    
    return tried, 0

def run_specific_mnemonic(specific_mnemonic, derivation_types):
    """Run processing for a specific mnemonic provided by user"""
    if not validate_mnemonic(specific_mnemonic):
        print("Error: Invalid mnemonic - contains words not in BIP-39 wordlist")
        return False
    
    start_time = time.time()
    success = process_mnemonic(specific_mnemonic, derivation_types)
    elapsed = time.time() - start_time
    
    logger.info(f"Completed testing specific mnemonic in {elapsed:.2f} seconds")
    print(f"Completed testing in {elapsed:.2f} seconds")
    
    return success

def main():
    """Main entry point - handles argument parsing and delegates to appropriate functions"""
    parser = argparse.ArgumentParser(
        description="Educational BIP-39 Demonstration in Python",
        epilog="""
Examples:
  # Test a specific mnemonic (like the example)
  python %(prog)s --mnemonic "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
  
  # Test a specific mnemonic with only bech32 addresses
  python %(prog)s --mnemonic "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about" --derivation_type bech32
  
  # Original random generation mode (12 words, all derivation types)
  python %(prog)s
  
  # Random generation with 24 words, only p2pkh
  python %(prog)s --word_count 24 --derivation_type p2pkh
  
  # Show configuration status
  python %(prog)s --show_config
""",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument('--word_count', type=int, choices=[12, 18, 24], default=12, 
                        help="Number of words in mnemonic (when generating randomly)")
    parser.add_argument('--derivation_type', choices=['p2pkh', 'p2sh', 'bech32', 'all'], default='all', 
                        help="Derivation type or 'all' for all types")
    parser.add_argument('--mnemonic', type=str, 
                        help="Specific mnemonic to test (e.g., 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'). If not provided, random mnemonics will be generated.")
    parser.add_argument('--show_config', action='store_true',
                        help="Show current configuration status and exit")
    args = parser.parse_args()

    # Show config status and exit if requested
    if args.show_config:
        show_config_status()
        return

    # Set up derivation types
    derivation_types = ['p2pkh', 'p2sh', 'bech32'] if args.derivation_type == 'all' else [args.derivation_type]
    
    # Load previously tested mnemonics
    load_tested_mnemonics()

    logger.info("=== EDUCATIONAL DEMO STARTED ===")
    show_config_status()
    print("Press Ctrl+C to stop")

    if args.mnemonic:
        specific_mnemonic = args.mnemonic.strip()
        logger.info(f"Testing specific mnemonic: {specific_mnemonic}")
        run_specific_mnemonic(specific_mnemonic, derivation_types)
    else:
        logger.info(f"Configuration: {args.word_count} words, Derivation: {args.derivation_type}")
        run_random_generation(args.word_count, derivation_types)

if __name__ == "__main__":
    main()