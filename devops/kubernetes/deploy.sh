#!/bin/bash

# Kubernetes Deployment Script

echo "================================"
echo "Prakash Study Stack - K8s Setup"
echo "================================"

# Create namespace
echo "Creating namespace..."
kubectl apply -f devops/kubernetes/mongodb-deployment.yaml
sleep 10

echo "Deploying MongoDB..."
kubectl apply -f devops/kubernetes/mongodb-deployment.yaml

echo "Deploying Backend..."
kubectl apply -f devops/kubernetes/backend-deployment.yaml

echo "Deploying Frontend..."
kubectl apply -f devops/kubernetes/frontend-deployment.yaml

echo "Setting up Ingress..."
kubectl apply -f devops/kubernetes/ingress.yaml

echo "✓ All deployments completed!"
echo ""
echo "Check status with:"
echo "  kubectl get pods -n notes-management"
echo "  kubectl get svc -n notes-management"
echo ""
echo "Port forward to access:"
echo "  kubectl port-forward -n notes-management svc/frontend 3000:80"
echo "  kubectl port-forward -n notes-management svc/backend 5000:5000"
