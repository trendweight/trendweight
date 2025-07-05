#!/bin/bash

LOG_FILE="$1"
DEBUG_FILE="${LOG_FILE%.log}.debug"

echo "[$(date)] Starting ANSI strip for $LOG_FILE" >> "$DEBUG_FILE"

# Try multiple methods and see which works
{
    echo "[$(date)] Method 1: perl with \\e" >> "$DEBUG_FILE"
    perl -pe 's/\e\[[0-9;]*m//g' > "${LOG_FILE}.method1" 2>> "$DEBUG_FILE"
} || {
    echo "[$(date)] Method 1 failed with exit code $?" >> "$DEBUG_FILE"
}

# Also try with octal escape
{
    echo "[$(date)] Method 2: perl with octal \\033" >> "$DEBUG_FILE"
    perl -pe 's/\033\[[0-9;]*m//g' > "${LOG_FILE}.method2" 2>> "$DEBUG_FILE"
} || {
    echo "[$(date)] Method 2 failed with exit code $?" >> "$DEBUG_FILE"
}

# Try with printf format
{
    echo "[$(date)] Method 3: perl with \\x1b" >> "$DEBUG_FILE"
    perl -pe 's/\x1b\[[0-9;]*m//g' > "${LOG_FILE}.method3" 2>> "$DEBUG_FILE"
} || {
    echo "[$(date)] Method 3 failed with exit code $?" >> "$DEBUG_FILE"
}

# For now, just use cat so we get output
cat > "$LOG_FILE"