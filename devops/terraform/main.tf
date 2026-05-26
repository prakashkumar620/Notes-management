terraform {
  required_version = ">= 1.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Network
resource "docker_network" "notes_network" {
  name   = "notes-management-network"
  driver = "bridge"
}

# MongoDB Container
resource "docker_image" "mongodb" {
  name         = "mongo:latest"
  keep_locally = false
}

resource "docker_container" "mongodb" {
  name  = "notes-mongodb-tf"
  image = docker_image.mongodb.id
  
  env = [
    "MONGO_INITDB_ROOT_USERNAME=admin",
    "MONGO_INITDB_ROOT_PASSWORD=password"
  ]
  
  ports {
    internal = 27017
    external = 27017
  }
  
  networks_advanced {
    name = docker_network.notes_network.name
  }
  
  volumes {
    container_path = "/data/db"
    volume_name    = "mongodb_data"
  }
}

# Backend Container
resource "docker_image" "backend" {
  name         = "notes-backend:latest"
  keep_locally = true
}

resource "docker_container" "backend" {
  name    = "notes-backend-tf"
  image   = docker_image.backend.id
  depends_on = [docker_container.mongodb]
  
  env = [
    "MONGODB_URI=mongodb://admin:password@notes-mongodb-tf:27017/notes-management?authSource=admin",
    "JWT_SECRET=your_super_secret_jwt_key_change_this_in_production",
    "NODE_ENV=production",
    "PORT=5000"
  ]
  
  ports {
    internal = 5000
    external = 5000
  }
  
  networks_advanced {
    name = docker_network.notes_network.name
  }
  
  volumes {
    container_path = "/app/uploads"
    volume_name    = "backend_uploads"
  }
}

# Frontend Container
resource "docker_image" "frontend" {
  name         = "notes-frontend:latest"
  keep_locally = true
}

resource "docker_container" "frontend" {
  name    = "notes-frontend-tf"
  image   = docker_image.frontend.id
  depends_on = [docker_container.backend]
  
  ports {
    internal = 80
    external = 3000
  }
  
  networks_advanced {
    name = docker_network.notes_network.name
  }
}

# Outputs
output "frontend_url" {
  value       = "http://localhost:3000"
  description = "Frontend URL"
}

output "backend_url" {
  value       = "http://localhost:5000"
  description = "Backend API URL"
}

output "mongodb_url" {
  value       = "mongodb://admin:password@localhost:27017/notes-management?authSource=admin"
  description = "MongoDB Connection String"
}
