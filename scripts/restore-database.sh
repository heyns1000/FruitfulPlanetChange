#!/bin/bash
# Database Restore Script
# Usage: ./scripts/restore-database.sh <backup-file> [environment]

set -e

BACKUP_FILE=$1
ENVIRONMENT=${2:-development}

if [ -z "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not specified"
    echo "Usage: $0 <backup-file> [environment]"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    source ".env.${ENVIRONMENT}"
fi

echo "WARNING: This will restore database for ${ENVIRONMENT}"
echo "Backup file: ${BACKUP_FILE}"
read -p "Are you sure you want to continue? (yes/no) " -n 3 -r
echo
if [[ ! $REPLY =~ ^yes$ ]]; then
    echo "Restore cancelled"
    exit 0
fi

# Extract database connection details
DB_URL=${DATABASE_URL}

if [ -z "$DB_URL" ]; then
    echo "ERROR: DATABASE_URL not set"
    exit 1
fi

DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*@.*/\1/p')
DB_PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Starting database restore..."

# Check if file is gzipped
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | PGPASSWORD=$DB_PASS psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME"
else
    PGPASSWORD=$DB_PASS psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -f "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo "Database restore completed successfully!"
else
    echo "ERROR: Database restore failed"
    exit 1
fi
