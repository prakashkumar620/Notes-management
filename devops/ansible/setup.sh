#!/bin/bash

# Ansible Setup Script

echo "================================================"
echo "Ansible Configuration Management Setup"
echo "================================================"

# Check if Ansible is installed
if ! command -v ansible &> /dev/null; then
    echo "❌ Ansible not found. Installing..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y software-properties-common
        sudo add-apt-repository --yes --update ppa:ansible/ansible
        sudo apt-get install -y ansible
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ansible
    fi
fi

echo "✓ Ansible $(ansible --version | head -n 1)"

# Install required collections
echo "Installing required Ansible collections..."
ansible-galaxy collection install community.docker

# Run playbook
echo "Running Ansible playbook..."
cd devops/ansible

ansible-playbook -i inventory.ini site.yml -v

echo ""
echo "✓ Ansible setup completed!"
echo ""
echo "To run playbook again:"
echo "  ansible-playbook -i devops/ansible/inventory.ini devops/ansible/site.yml"
