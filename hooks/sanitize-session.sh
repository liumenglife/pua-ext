#!/bin/bash
# PUA session sanitizer — strips sensitive data before upload
# Usage: bash sanitize-session.sh [session.jsonl] [output.jsonl]

INPUT="${1:-$(ls -t ~/.claude/projects/*/sessions/*.jsonl 2>/dev/null | head -1)}"
OUTPUT="${2:-/tmp/pua-sanitized-session.jsonl}"

if [ -z "$INPUT" ] || [ ! -f "$INPUT" ]; then
  echo "No session file found" >&2
  exit 1
fi

python3 << 'PYEOF' "$INPUT" "$OUTPUT"
import sys, json, re, os

input_file = sys.argv[1]
output_file = sys.argv[2]

# Patterns to strip
PATTERNS = [
    # File paths
    (r'/Users/[^\s"]+', '[PATH]'),
    (r'/home/[^\s"]+', '[PATH]'),
    (r'C:\\Users\\[^\s"]+', '[PATH]'),
    (r'~/.+?(?=[\s"\']|$)', '[PATH]'),
    # API keys and tokens
    (r'(sk-[a-zA-Z0-9]{20,})', '[API_KEY]'),
    (r'(ghp_[a-zA-Z0-9]{36})', '[GITHUB_TOKEN]'),
    (r'(ghu_[a-zA-Z0-9]{36})', '[GITHUB_TOKEN]'),
    (r'(AKIA[A-Z0-9]{16})', '[AWS_KEY]'),
    (r'(eyJ[a-zA-Z0-9_-]{50,})', '[JWT]'),
    (r'(Bearer\s+[a-zA-Z0-9_.-]+)', '[BEARER_TOKEN]'),
    # Emails
    (r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', '[EMAIL]'),
    # IP addresses
    (r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', '[IP]'),
    # SSH keys
    (r'ssh-(rsa|ed25519|ecdsa)\s+\S+', '[SSH_KEY]'),
    # Private keys
    (r'-----BEGIN[^-]+PRIVATE KEY-----[\s\S]*?-----END[^-]+PRIVATE KEY-----', '[PRIVATE_KEY]'),
    # Passwords in URLs
    (r'://[^:]+:[^@]+@', '://[CRED]@'),
]

def sanitize(text):
    if not isinstance(text, str):
        return text
    for pattern, replacement in PATTERNS:
        text = re.sub(pattern, replacement, text)
    return text

def sanitize_obj(obj):
    if isinstance(obj, str):
        return sanitize(obj)
    elif isinstance(obj, dict):
        return {k: sanitize_obj(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_obj(item) for item in obj]
    return obj

count = 0
with open(input_file) as f, open(output_file, 'w') as out:
    for line in f:
        try:
            data = json.loads(line)
            sanitized = sanitize_obj(data)
            out.write(json.dumps(sanitized, ensure_ascii=False) + '\n')
            count += 1
        except:
            pass

print(f"Sanitized {count} lines → {output_file}")
PYEOF
