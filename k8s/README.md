# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying FruitfulPlanet to a Kubernetes cluster.

## Prerequisites

- Kubernetes cluster (1.24+)
- kubectl configured to access your cluster
- cert-manager installed (for SSL certificates)
- NGINX Ingress Controller installed

## Files

- `namespace.yaml` - Creates the fruitfulplanet namespace
- `configmap.yaml` - Application configuration (non-sensitive)
- `secrets.yaml` - Secrets template (must be customized)
- `deployment.yaml` - Application, PostgreSQL, and Redis deployments
- `service.yaml` - Kubernetes services for internal communication
- `hpa.yaml` - Horizontal Pod Autoscaler for automatic scaling
- `ingress.yaml` - Ingress configuration for external access with SSL

## Deployment Steps

### 1. Update Secrets

**IMPORTANT**: Before deploying, update `secrets.yaml` with actual values:

```bash
# Do NOT commit secrets.yaml with actual values
# Use kubectl create secret or a secrets management solution like sealed-secrets
kubectl create secret generic app-secrets \
  --from-literal=SESSION_SECRET='your-secure-session-secret' \
  --from-literal=DATABASE_URL='postgresql://user:pass@postgres-service:5432/fruitfulplanet' \
  --from-literal=REDIS_URL='redis://redis-service:6379' \
  --namespace=fruitfulplanet
```

### 2. Apply Manifests

```bash
# Create namespace
kubectl apply -f namespace.yaml

# Create ConfigMaps and Secrets
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml

# Deploy applications
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Configure autoscaling and ingress
kubectl apply -f hpa.yaml
kubectl apply -f ingress.yaml
```

### 3. Update Ingress Hostname

Edit `ingress.yaml` and replace `fruitfulplanet.example.com` with your actual domain.

### 4. Verify Deployment

```bash
# Check pods
kubectl get pods -n fruitfulplanet

# Check services
kubectl get svc -n fruitfulplanet

# Check ingress
kubectl get ingress -n fruitfulplanet

# View logs
kubectl logs -f deployment/fruitfulplanet-app -n fruitfulplanet
```

## Scaling

The application automatically scales between 3-10 replicas based on CPU and memory usage (configured in `hpa.yaml`).

To manually scale:

```bash
kubectl scale deployment/fruitfulplanet-app --replicas=5 -n fruitfulplanet
```

## Updating the Application

```bash
# Update image
kubectl set image deployment/fruitfulplanet-app app=fruitfulplanet-app:v2.0.0 -n fruitfulplanet

# Check rollout status
kubectl rollout status deployment/fruitfulplanet-app -n fruitfulplanet

# Rollback if needed
kubectl rollout undo deployment/fruitfulplanet-app -n fruitfulplanet
```

## Monitoring

Prometheus metrics are exposed on `/metrics` endpoint (port 5000).

Health checks:

- Liveness probe: `/api/health/liveness`
- Readiness probe: `/api/health/readiness`

## Production Considerations

1. **Secrets Management**: Use external secrets management (AWS Secrets Manager, HashiCorp Vault, Sealed Secrets)
2. **Database**: Consider using a managed database service (RDS, Cloud SQL) instead of in-cluster PostgreSQL
3. **Persistent Storage**: Configure proper storage classes for production workloads
4. **Backup**: Implement regular database backups
5. **Monitoring**: Deploy Prometheus and Grafana for comprehensive monitoring
6. **Logging**: Set up centralized logging (ELK, Loki, or cloud provider solutions)
7. **Network Policies**: Implement network policies for enhanced security
8. **Resource Limits**: Adjust resource requests/limits based on actual usage
9. **Multi-Region**: Consider multi-region deployment for high availability

## Cleanup

```bash
kubectl delete namespace fruitfulplanet
```
