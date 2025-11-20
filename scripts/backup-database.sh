#!/bin/bash
# Database Backup Script
# Usage: ./scripts/backup-database.sh [environment]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${BACKUP_DIR:-./backups}"
BACKUP_FILE="${BACKUP_DIR}/backup_${ENVIRONMENT}_${TIMESTAMP}.sql.gz"

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    source ".env.${ENVIRONMENT}"
fi

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "Starting database backup for ${ENVIRONMENT}..."
echo "Backup file: ${BACKUP_FILE}"

# Extract database connection details from DATABASE_URL
# Format: postgresql://username:password@host:port/dbname
DB_URL=${DATABASE_URL}

if [ -z "$DB_URL" ]; then
    echo "ERROR: DATABASE_URL not set"
    exit 1
fi

# Parse DATABASE_URL
DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*@.*/\1/p')
DB_PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Perform backup
PGPASSWORD=$DB_PASS pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --format=plain \
    --no-owner \
    --no-acl \
    | gzip > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "Backup completed successfully!"
    echo "Backup size: ${BACKUP_SIZE}"
    echo "Backup location: ${BACKUP_FILE}"
    
    # Upload to S3 if configured
    if [ -n "$AWS_S3_BACKUP_BUCKET" ]; then
        echo "Uploading backup to S3..."
        aws s3 cp "$BACKUP_FILE" "s3://${AWS_S3_BACKUP_BUCKET}/database-backups/"
        echo "Backup uploaded to S3"
    fi
    
    # Clean up old backups (keep last 30 days)
    find "$BACKUP_DIR" -name "backup_${ENVIRONMENT}_*.sql.gz" -mtime +30 -delete
    echo "Old backups cleaned up"
else
    echo "ERROR: Backup failed"
    exit 1
fi

echo "Backup process completed"
