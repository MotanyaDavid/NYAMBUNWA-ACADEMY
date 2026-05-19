# ============================================
# NYAMBUNWA ACADEMY
# reset_password.py - Admin Password Reset Tool
# ============================================
# Usage: python reset_password.py

from werkzeug.security import generate_password_hash
import os

print("\n" + "="*50)
print("  NYAMBUNWA ACADEMY - Password Reset")
print("="*50 + "\n")

# Get new password
new_password = input("Enter new admin password: ")
confirm_password = input("Confirm new password: ")

if new_password != confirm_password:
    print("\n❌ Passwords do not match. Try again.")
    exit()

if len(new_password) < 8:
    print("\n❌ Password must be at least 8 characters.")
    exit()

# Generate hash
new_hash = generate_password_hash(new_password, method='pbkdf2:sha256')

# Update .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')

if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        lines = f.readlines()
    
    with open(env_path, 'w') as f:
        for line in lines:
            if line.startswith('ADMIN_PASSWORD_HASH='):
                f.write(f'ADMIN_PASSWORD_HASH={new_hash}\n')
            else:
                f.write(line)
else:
    print("\n❌ .env file not found. Creating one...")
    with open(env_path, 'w') as f:
        f.write(f'ADMIN_USERNAME=admin\n')
        f.write(f'ADMIN_PASSWORD_HASH={new_hash}\n')

print(f"\n✅ Password reset successful!")
print(f"   Username: admin")
print(f"   New hash saved to .env file")
print(f"   Restart the server for changes to take effect.\n")