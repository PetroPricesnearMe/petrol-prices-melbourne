#!/bin/bash

###############################################################################
# Database Restore Script
# Restores Baserow data from backup files
###############################################################################

set -e

# Configuration
BACKUP_DIR="./backups"
LOG_FILE="./logs/restore_$(date +%Y%m%d_%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

# Usage information
usage() {
    echo "Usage: $0 --file=<backup_file> --table-id=<table_id> [--dry-run]"
    echo ""
    echo "Options:"
    echo "  --file        Path to backup file (required)"
    echo "  --table-id    Target Baserow table ID (required)"
    echo "  --dry-run     Preview changes without applying them"
    echo ""
    echo "Examples:"
    echo "  $0 --file=backups/petrol_stations_20240101.json.gz --table-id=123456"
    echo "  $0 --file=backups/latest.json.gz --table-id=123456 --dry-run"
    exit 1
}

# Parse command line arguments
BACKUP_FILE=""
TABLE_ID=""
DRY_RUN=false

for arg in "$@"; do
    case $arg in
        --file=*)
            BACKUP_FILE="${arg#*=}"
            shift
            ;;
        --table-id=*)
            TABLE_ID="${arg#*=}"
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            usage
            ;;
        *)
            log_error "Unknown option: $arg"
            usage
            ;;
    esac
done

# Validate arguments
if [ -z "$BACKUP_FILE" ] || [ -z "$TABLE_ID" ]; then
    log_error "Missing required arguments"
    usage
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check environment variables
if [ -z "$BASEROW_API_TOKEN" ]; then
    log_error "BASEROW_API_TOKEN is not set"
    exit 1
fi

# Decompress backup if needed
decompress_backup() {
    local file=$1

    if [[ "$file" == *.gz ]]; then
        log_info "Decompressing backup file..."
        local decompressed="${file%.gz}"
        gunzip -c "$file" > "$decompressed"
        echo "$decompressed"
    else
        echo "$file"
    fi
}

# Restore data to Baserow
restore_data() {
    local data_file=$1
    local table_id=$2

    log_info "Reading backup data..."
    local data=$(cat "$data_file")

    # Parse JSON and count rows
    local row_count=$(echo "$data" | jq '.results | length')
    log_info "Found $row_count rows to restore"

    if [ "$DRY_RUN" = true ]; then
        log_warn "DRY RUN: Would restore $row_count rows to table $table_id"
        log_info "Preview of first row:"
        echo "$data" | jq '.results[0]' | head -20
        return 0
    fi

    # Ask for confirmation
    read -p "⚠️  This will modify table $table_id. Continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        log_warn "Restore cancelled by user"
        exit 0
    fi

    log_info "Starting restore process..."

    # Extract rows from backup
    local rows=$(echo "$data" | jq -c '.results[]')
    local success_count=0
    local error_count=0

    # Restore each row
    while IFS= read -r row; do
        # Remove 'id' field as Baserow will generate new IDs
        local row_data=$(echo "$row" | jq 'del(.id)')

        # Create row in Baserow
        local response=$(curl -s -w "\n%{http_code}" \
            -X POST \
            -H "Authorization: Token $BASEROW_API_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$row_data" \
            "${BASEROW_API_URL:-https://api.baserow.io}/api/database/rows/table/${table_id}/?user_field_names=true")

        local http_code=$(echo "$response" | tail -n1)

        if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
            ((success_count++))
            echo -ne "\rRestored: $success_count / $row_count"
        else
            ((error_count++))
            log_warn "Failed to restore row. HTTP Status: $http_code"
        fi
    done <<< "$rows"

    echo ""
    log_info "Restore complete! Success: $success_count, Errors: $error_count"
}

# Main execution
main() {
    log_info "Starting database restore process..."

    mkdir -p "./logs"

    # Decompress backup if needed
    local data_file=$(decompress_backup "$BACKUP_FILE")

    # Validate JSON
    if ! jq empty "$data_file" 2>/dev/null; then
        log_error "Invalid JSON in backup file"
        exit 1
    fi

    # Restore data
    restore_data "$data_file" "$TABLE_ID"

    # Cleanup temporary files
    if [ "$data_file" != "$BACKUP_FILE" ]; then
        rm -f "$data_file"
    fi

    log_info "Database restore completed!"
}

# Run main function
main
