#!/bin/bash

# Deployment script for MERN Bug Tracker
# Usage: ./deploy.sh [backend|frontend|all]

set -e  # Exit on error

ENVIRONMENT=${1:-all}

echo "🚀 Starting deployment process..."

# Function to deploy backend
deploy_backend() {
    echo "📦 Deploying backend..."
    cd server
    
    # Install dependencies
    echo "Installing backend dependencies..."
    npm ci --production=false
    
    # Run tests
    echo "Running backend tests..."
    npm test || echo "⚠️  Tests failed, but continuing deployment..."
    
    # Build (if needed)
    echo "Backend ready for deployment"
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    echo "📦 Deploying frontend..."
    cd client
    
    # Install dependencies
    echo "Installing frontend dependencies..."
    npm ci
    
    # Run tests
    echo "Running frontend tests..."
    npm test -- --watchAll=false || echo "⚠️  Tests failed, but continuing deployment..."
    
    # Build
    echo "Building frontend..."
    npm run build
    
    echo "Frontend build complete"
    cd ..
}

# Main deployment logic
case $ENVIRONMENT in
    backend)
        deploy_backend
        ;;
    frontend)
        deploy_frontend
        ;;
    all)
        deploy_backend
        deploy_frontend
        ;;
    *)
        echo "❌ Invalid option. Use: backend, frontend, or all"
        exit 1
        ;;
esac

echo "✅ Deployment process complete!"

