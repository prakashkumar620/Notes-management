#!/bin/bash

# Monitoring Stack Setup Script

echo "================================================"
echo "Prometheus + Grafana Monitoring Stack"
echo "================================================"

MONITORING_PORT=9090
GRAFANA_PORT=3001

echo "Starting Prometheus and Grafana..."

cd devops/monitoring

# Start monitoring stack
docker-compose up -d

sleep 5

echo "✓ Prometheus started on port ${MONITORING_PORT}"
echo "✓ Grafana started on port ${GRAFANA_PORT}"
echo ""
echo "Access URLs:"
echo "  Prometheus: http://localhost:${MONITORING_PORT}"
echo "  Grafana:    http://localhost:${GRAFANA_PORT}"
echo ""
echo "Default Grafana credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "Setup Instructions:"
echo "  1. Add Prometheus as data source (http://prometheus:9090)"
echo "  2. Create dashboards for:"
echo "     - Backend API metrics"
echo "     - Database performance"
echo "     - System resources"
echo "     - Application errors"
echo ""
echo "View logs:"
echo "  docker-compose logs -f prometheus"
echo "  docker-compose logs -f grafana"
