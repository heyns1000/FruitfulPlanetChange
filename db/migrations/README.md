# Database Migrations

This directory contains database migration scripts for schema versioning and evolution.

## Migration Workflow

### Creating a Migration

```bash
# Generate a new migration
pnpm run db:generate

# This will create a new migration file in db/migrations/
```

### Running Migrations

```bash
# Push schema changes to database
pnpm run db:push

# For production, use migrations instead of push
pnpm run db:migrate
```

### Migration Files

Migration files are named with timestamps: `YYYY-MM-DD-HH-MM-SS_description.sql`

Example: `2025-11-20-01-22-00_create_users_table.sql`

## Best Practices

1. **Never modify existing migrations** - Create new migrations for changes
2. **Test migrations** - Always test in development before production
3. **Backup before migrating** - Always backup production database first
4. **Keep migrations small** - One logical change per migration
5. **Document breaking changes** - Add comments for significant changes

## Migration Structure

```sql
-- Migration: Create users table
-- Date: 2025-11-20

-- Up Migration
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration (for rollback)
-- DROP TABLE users;
```

## Rollback

To rollback a migration:

```bash
# Rollback last migration
pnpm run db:rollback

# Rollback to specific version
pnpm run db:rollback -- --to=YYYY-MM-DD-HH-MM-SS
```

## Production Deployment

1. Backup database
2. Test migration in staging
3. Schedule maintenance window if needed
4. Run migration
5. Verify application functionality
6. Monitor for issues

## Common Migration Tasks

### Adding a Column

```sql
ALTER TABLE table_name
ADD COLUMN column_name VARCHAR(255);
```

### Removing a Column

```sql
ALTER TABLE table_name
DROP COLUMN column_name;
```

### Creating an Index

```sql
CREATE INDEX idx_table_column
ON table_name(column_name);
```

### Adding a Foreign Key

```sql
ALTER TABLE child_table
ADD CONSTRAINT fk_parent
FOREIGN KEY (parent_id)
REFERENCES parent_table(id);
```

## Troubleshooting

### Migration Failed

1. Check error message
2. Verify database connectivity
3. Check for conflicts (duplicate names, etc.)
4. Rollback if necessary
5. Fix issue and retry

### Schema Out of Sync

```bash
# Reset development database (WARNING: destroys data)
pnpm run db:reset
pnpm run db:push
```
