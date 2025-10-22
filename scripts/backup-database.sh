#!/bin/bash

###############################################################################
# Database Backup Script
# Backs up Baserow data to local storage and optionally to cloud storage
###############################################################################

set -e

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="./logs/backup_${DATE}.log"

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

# Check required environment variables
check_env_vars() {
    log_info "Checking environment variables..."

    if [ -z "$BASEROW_API_TOKEN" ]; then
        log_error "BASEROW_API_TOKEN is not set"
        exit 1
    fi

    if [ -z "$BASEROW_PETROL_STATIONS_TABLE_ID" ]; then
        log_warn "BASEROW_PETROL_STATIONS_TABLE_ID is not set, skipping stations backup"
    fi

    if [ -z "$BASEROW_FUEL_PRICES_TABLE_ID" ]; then
        log_warn "BASEROW_FUEL_PRICES_TABLE_ID is not set, skipping prices backup"
    fi
}

# Create backup directories
setup_directories() {
    log_info "Setting up backup directories..."
    mkdir -p "$BACKUP_DIR"
    mkdir -p "./logs"
}

# Backup Baserow table
backup_table() {
    local table_id=$1
    local table_name=$2
    local backup_file="${BACKUP_DIR}/${table_name}_${DATE}.json"

    log_info "Backing up ${table_name} (Table ID: ${table_id})..."

    # Fetch all rows from the table
    local response=$(curl -s -w "\n%{http_code}" \
        -H "Authorization: Token $BASEROW_API_TOKEN" \
        "${BASEROW_API_URL:-https://api.baserow.io}/api/database/rows/table/${table_id}/?user_field_names=true&size=10000")

    # Extract HTTP status code
    local http_code=$(echo "$response" | tail -n1)
    local data=$(echo "$response" | head -n-1)

    if [ "$http_code" -eq 200 ]; then
        echo "$data" > "$backup_file"
        log_info "Successfully backed up ${table_name} to ${backup_file}"

        # Compress backup
        gzip "$backup_file"
        log_info "Compressed backup to ${backup_file}.gz"

        return 0
    else
        log_error "Failed to backup ${table_name}. HTTP Status: ${http_code}"
        return 1
    fi
}

# Clean old backups (keep last 30 days)
cleanup_old_backups() {
    log_info "Cleaning up old backups (keeping last 30 days)..."
    find "$BACKUP_DIR" -name "*.json.gz" -type f -mtime +30 -delete
    log_info "Cleanup complete"
}

# Upload to cloud storage (optional)
upload_to_cloud() {
    local file=$1

    # AWS S3 Example
    if [ -n "$AWS_S3_BUCKET" ]; then
        log_info "Uploading to AWS S3..."
        if command -v aws &> /dev/null; then
            aws s3 cp "$file" "s3://${AWS_S3_BUCKET}/backups/$(basename $file)"
            log_info "Successfully uploaded to S3"
        else
            log_warn "AWS CLI not found, skipping S3 upload"
        fi
    fi

    # Azure Blob Storage Example
    if [ -n "$AZURE_STORAGE_ACCOUNT" ] && [ -n "$AZURE_STORAGE_CONTAINER" ]; then
        log_info "Uploading to Azure Blob Storage..."
        if command -v az &> /dev/null; then
            az storage blob upload \
                --account-name "$AZURE_STORAGE_ACCOUNT" \
                --container-name "$AZURE_STORAGE_CONTAINER" \
                --name "backups/$(basename $file)" \
                --file "$file"
            log_info "Successfully uploaded to Azure"
        else
            log_warn "Azure CLI not found, skipping Azure upload"
        fi
    fi
}

# Main execution
main() {
    log_info "Starting database backup process..."
    log_info "Timestamp: $DATE"

    # Setup
    check_env_vars
    setup_directories

    # Backup petrol stations
    if [ -n "$BASEROW_PETROL_STATIONS_TABLE_ID" ]; then
        if backup_table "$BASEROW_PETROL_STATIONS_TABLE_ID" "petrol_stations"; then
            upload_to_cloud "${BACKUP_DIR}/petrol_stations_${DATE}.json.gz"
        fi
    fi

    # Backup fuel prices
    if [ -n "$BASEROW_FUEL_PRICES_TABLE_ID" ]; then
        if backup_table "$BASEROW_FUEL_PRICES_TABLE_ID" "fuel_prices"; then
            upload_to_cloud "${BACKUP_DIR}/fuel_prices_${DATE}.json.gz"
        fi
    fi

    # Cleanup old backups
    cleanup_old_backups

    log_info "Backup process completed successfully!"
}

# Run main function
main "$@"
