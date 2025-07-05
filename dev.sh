#!/bin/bash

# Create logs directory with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="logs/$TIMESTAMP"
mkdir -p "$LOG_DIR"

# Colors for output
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Color

# Function to prefix output with colored label
prefix_output() {
    local label="$1"
    local color="$2"
    local logfile="$3"
    
    while IFS= read -r line; do
        echo -e "${color}[$label]${NC} $line"
        echo "[$label] $line" >> "$logfile"
    done
}

# Start API server
echo "Starting API server..."
(cd apps/api/TrendWeight && dotnet watch 2>&1 | prefix_output "API" "$YELLOW" "$LOG_DIR/api.log") &
API_PID=$!

# Start Web server
echo "Starting Web server..."
(cd apps/web && npm run dev 2>&1 | prefix_output "WEB" "$BLUE" "$LOG_DIR/web.log") &
WEB_PID=$!

# Create symlinks to latest logs
ln -sf "$TIMESTAMP" logs/latest

echo "Servers started. Logs in $LOG_DIR/"
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap 'kill $API_PID $WEB_PID 2>/dev/null; exit' INT
wait