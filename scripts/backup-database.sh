#!/bin/bash

###############################################################################
# Database Backup Script
#
# Description: Automated backup of Baserow database
# Usage: ./scripts/backup-database.sh
# Schedule: Run daily via cron or GitHub Actions
###############################################################################

set -e  # Exit on error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$BACKUP_DIR/backup_$DATE.log"

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

# Create backup directory
mkdir -p "$BACKUP_DIR"

log_info "Starting database backup at $(date)"

# Check required environment variables
if [ -z "$BASEROW_API_TOKEN" ]; then
    log_error "BASEROW_API_TOKEN is not set"
    exit 1
fi

if [ -z "$BASEROW_STATIONS_TABLE_ID" ]; then
    log_error "BASEROW_STATIONS_TABLE_ID is not set"
    exit 1
fi

if [ -z "$BASEROW_FUEL_PRICES_TABLE_ID" ]; then
    log_error "BASEROW_FUEL_PRICES_TABLE_ID is not set"
    exit 1
fi

# Backup function
backup_table() {
    local TABLE_ID=$1
    local TABLE_NAME=$2
    local OUTPUT_FILE="$BACKUP_DIR/${TABLE_NAME}_$DATE.json"

    log_info "Backing up $TABLE_NAME (ID: $TABLE_ID)..."

    # Fetch all rows from the table
    curl -s -H "Authorization: Token $BASEROW_API_TOKEN" \
        "https://api.baserow.io/api/database/rows/table/$TABLE_ID/?user_field_names=true&size=10000" \
        -o "$OUTPUT_FILE"

    if [ $? -eq 0 ]; then
        log_info "Successfully backed up $TABLE_NAME"

        # Compress the backup
        gzip "$OUTPUT_FILE"
        log_info "Compressed backup: ${OUTPUT_FILE}.gz"

        # Calculate file size
        SIZE=$(du -h "${OUTPUT_FILE}.gz" | cut -f1)
        log_info "Backup size: $SIZE"

        return 0
    else
        log_error "Failed to backup $TABLE_NAME"
        return 1
    fi
}

# Perform backups
backup_table "$BASEROW_STATIONS_TABLE_ID" "petrol_stations"
STATIONS_STATUS=$?

backup_table "$BASEROW_FUEL_PRICES_TABLE_ID" "fuel_prices"
PRICES_STATUS=$?

# Cleanup old backups (keep last 30 days)
log_info "Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.json.gz" -mtime +30 -delete
find "$BACKUP_DIR" -name "*.log" -mtime +30 -delete

# Count remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "*.json.gz" | wc -l)
log_info "Total backups retained: $BACKUP_COUNT"

# Upload to cloud storage (optional - uncomment and configure)
# if [ ! -z "$AWS_S3_BUCKET" ]; then
#     log_info "Uploading backups to S3..."
#     aws s3 sync "$BACKUP_DIR" "s3://$AWS_S3_BUCKET/database-backups/" \
#         --exclude "*" --include "*.json.gz"
#     log_info "Upload complete"
# fi

# Summary
log_info "================================"
log_info "Backup Summary"
log_info "================================"
log_info "Date: $(date)"
log_info "Stations backup: $([ $STATIONS_STATUS -eq 0 ] && echo 'SUCCESS' || echo 'FAILED')"
log_info "Fuel prices backup: $([ $PRICES_STATUS -eq 0 ] && echo 'SUCCESS' || echo 'FAILED')"
log_info "Backup location: $BACKUP_DIR"
log_info "================================"

# Exit with appropriate status
if [ $STATIONS_STATUS -eq 0 ] && [ $PRICES_STATUS -eq 0 ]; then
    log_info "All backups completed successfully! ✓"
    exit 0
else
    log_error "Some backups failed! ✗"
    exit 1
fi
