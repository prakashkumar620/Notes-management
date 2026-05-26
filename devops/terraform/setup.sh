#!/bin/bash

# Terraform Setup Script

echo "================================================"
echo "Terraform Infrastructure Setup"
echo "================================================"

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform not found. Installing..."
    
    # Download Terraform (for Windows, use manual download or WSL)
    TERRAFORM_VERSION="1.3.0"
    
    # For Linux/Mac
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip
        unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip
        sudo mv terraform /usr/local/bin/
        rm terraform_${TERRAFORM_VERSION}_linux_amd64.zip
    fi
fi

echo "✓ Terraform $(terraform version -json | grep terraform_version)"

# Initialize Terraform
echo "Initializing Terraform..."
cd devops/terraform
terraform init

# Plan infrastructure
echo "Planning infrastructure..."
terraform plan -out=tfplan

# Ask for confirmation
read -p "Do you want to apply the infrastructure? (yes/no) " -n 3 -r
echo
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Applying infrastructure..."
    terraform apply tfplan
    
    echo ""
    echo "✓ Infrastructure deployed!"
    echo ""
    echo "Outputs:"
    terraform output
else
    echo "Cancelled"
fi
