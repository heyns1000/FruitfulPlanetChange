# Disaster Recovery Plan

## Overview

This document outlines the disaster recovery (DR) procedures for FruitfulPlanet application.

## Recovery Time Objective (RTO) and Recovery Point Objective (RPO)

- **RTO**: 4 hours (maximum downtime acceptable)
- **RPO**: 1 hour (maximum acceptable data loss)

## Backup Strategy

### Database Backups

**Automated Backups:**
- **Frequency**: Every 6 hours
- **Retention**: 30 days for daily, 90 days for weekly, 1 year for monthly
- **Location**: AWS S3 with cross-region replication
- **Encryption**: AES-256 encryption at rest

**Manual Backups:**
```bash
./scripts/backup-database.sh production
```

### Application State

**Session Data:**
- Stored in Redis with persistence enabled
- RDB snapshots every 6 hours
- AOF (Append Only File) for durability

**File Uploads:**
- Stored in S3 with versioning enabled
- Cross-region replication to backup region
- Lifecycle policies for old versions

### Configuration Backups

**Infrastructure as Code:**
- All Kubernetes manifests in Git
- Environment variables in sealed-secrets
- Regular Git backups

## Disaster Scenarios

### Scenario 1: Database Failure

**Detection:**
- Health check failures
- Application errors
- Monitoring alerts

**Recovery Procedure:**

1. **Assess Situation**
   ```bash
   # Check database status
   kubectl get pods -n fruitfulplanet | grep postgres
   kubectl logs postgres-0 -n fruitfulplanet
   ```

2. **Attempt Restart**
   ```bash
   kubectl delete pod postgres-0 -n fruitfulplanet
   ```

3. **Restore from Backup (if needed)**
   ```bash
   # Download latest backup
   aws s3 cp s3://fruitfulplanet-backups/latest.sql.gz ./
   
   # Restore database
   ./scripts/restore-database.sh latest.sql.gz production
   ```

4. **Verify**
   ```bash
   # Check application health
   curl https://fruitfulplanet.com/api/health/readiness
   ```

### Scenario 2: Complete Region Failure

**Detection:**
- All services down in primary region
- DNS health checks failing
- Multiple monitoring alerts

**Recovery Procedure:**

1. **Activate DR Region**
   ```bash
   # Promote read replica to primary
   aws rds promote-read-replica \
     --db-instance-identifier fruitfulplanet-replica-eu
   ```

2. **Update DNS**
   ```bash
   # Update Route53 to point to DR region
   aws route53 change-resource-record-sets \
     --hosted-zone-id Z123 \
     --change-batch file://failover-to-dr.json
   ```

3. **Scale Up DR Region**
   ```bash
   kubectl scale deployment fruitfulplanet-app --replicas=10 -n fruitfulplanet
   ```

4. **Verify and Monitor**
   - Check application functionality
   - Monitor error rates
   - Verify data consistency

### Scenario 3: Data Corruption

**Detection:**
- Data inconsistencies reported
- Failed integrity checks
- Application errors

**Recovery Procedure:**

1. **Identify Corruption Scope**
   ```bash
   # Check database logs
   kubectl logs postgres-0 -n fruitfulplanet --tail=1000
   ```

2. **Stop Writes**
   ```bash
   # Scale down application temporarily
   kubectl scale deployment fruitfulplanet-app --replicas=0
   ```

3. **Restore from Point-in-Time**
   ```bash
   # Restore to point before corruption
   aws rds restore-db-instance-to-point-in-time \
     --source-db-instance-identifier fruitfulplanet-prod \
     --target-db-instance-identifier fruitfulplanet-restored \
     --restore-time 2025-11-20T00:00:00Z
   ```

4. **Verify Data**
   ```bash
   # Run data integrity checks
   npm run db:verify
   ```

5. **Switch to Restored Database**
   ```bash
   # Update DATABASE_URL in secrets
   kubectl edit secret app-secrets -n fruitfulplanet
   ```

6. **Resume Operations**
   ```bash
   kubectl scale deployment fruitfulplanet-app --replicas=3
   ```

### Scenario 4: Security Breach

**Detection:**
- Unusual access patterns
- Security alerts
- Suspected unauthorized access

**Response Procedure:**

1. **Isolate Affected Systems**
   ```bash
   # Remove from load balancer
   kubectl scale deployment fruitfulplanet-app --replicas=0
   ```

2. **Assess Damage**
   - Review access logs
   - Check for data exfiltration
   - Identify entry point

3. **Secure Systems**
   ```bash
   # Rotate all secrets
   kubectl delete secret app-secrets -n fruitfulplanet
   kubectl create secret generic app-secrets --from-env-file=.env.new
   
   # Update firewall rules
   # Force password resets for users
   ```

4. **Restore from Clean Backup**
   - If systems compromised, restore from known-good backup
   - Verify no malicious code present

5. **Document Incident**
   - Create incident report
   - Update security procedures
   - Notify stakeholders if required

## Communication Plan

### Internal Communication

**Incident Commander:** CTO or designated on-call engineer

**Communication Channels:**
- Slack: #incidents channel
- Email: incidents@fruitfulplanet.com
- Phone: Emergency contact list

**Status Updates:**
- Every 30 minutes during active incident
- Every 2 hours during recovery

### External Communication

**User Communication:**
```
Subject: Service Status Update

We are currently experiencing [issue description]. 
Our team is actively working on resolution.

Current Status: [status]
Expected Resolution: [time]

We apologize for the inconvenience.
```

**Status Page Updates:**
- Post initial incident within 15 minutes
- Update every 30 minutes
- Post resolution and post-mortem

## Testing and Drills

### Quarterly DR Drills

**Q1 Drill:** Database failure and restore
**Q2 Drill:** Region failover
**Q3 Drill:** Data corruption recovery
**Q4 Drill:** Full disaster simulation

### Drill Procedure

1. Schedule drill (announce to team)
2. Execute scenario
3. Measure RTO/RPO achievement
4. Document issues and improvements
5. Update procedures

### Testing Checklist

- [ ] Backup restoration successful
- [ ] Failover completed within RTO
- [ ] Data loss within RPO
- [ ] Application fully functional
- [ ] Monitoring and alerts working
- [ ] Team communication effective

## Recovery Checklist

### Immediate Actions (0-30 minutes)

- [ ] Declare incident
- [ ] Assemble response team
- [ ] Assess scope of disaster
- [ ] Activate backup systems
- [ ] Notify stakeholders

### Short-term Actions (30 minutes - 4 hours)

- [ ] Implement recovery plan
- [ ] Restore from backups
- [ ] Verify system functionality
- [ ] Monitor for issues
- [ ] Provide regular updates

### Long-term Actions (4+ hours)

- [ ] Complete recovery
- [ ] Verify data integrity
- [ ] Resume normal operations
- [ ] Document incident
- [ ] Conduct post-mortem
- [ ] Implement improvements

## Post-Incident Review

### Post-Mortem Template

```markdown
# Incident Post-Mortem

## Summary
[Brief description of incident]

## Timeline
- [Time]: Incident detected
- [Time]: Response initiated
- [Time]: Resolution completed

## Impact
- Duration: [X hours]
- Users affected: [number]
- Data loss: [description]
- Financial impact: [amount]

## Root Cause
[Detailed analysis]

## What Went Well
- [List positive aspects]

## What Went Wrong
- [List issues encountered]

## Action Items
- [ ] [Action item 1]
- [ ] [Action item 2]

## Lessons Learned
[Key takeaways]
```

## Contact Information

**Emergency Contacts:**
- Incident Commander: [phone]
- DevOps Lead: [phone]
- Database Admin: [phone]
- Security Lead: [phone]

**Vendor Support:**
- AWS Support: [case submission link]
- Database Provider: [support email/phone]
- CDN Provider: [support email/phone]

## Document Maintenance

- **Review Frequency**: Quarterly
- **Last Updated**: 2025-11-20
- **Next Review**: 2026-02-20
- **Owner**: DevOps Team

## Resources

- [Backup Scripts](../scripts/)
- [Kubernetes Manifests](../k8s/)
- [Monitoring Dashboards](https://monitoring.fruitfulplanet.com)
- [Runbooks](./runbooks/)
