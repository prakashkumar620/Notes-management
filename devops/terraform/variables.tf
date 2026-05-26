terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}

variable "docker_host" {
  default = "unix:///var/run/docker.sock"
}

variable "network_name" {
  default = "notes-management-network"
}

variable "mongodb_root_username" {
  default = "admin"
}

variable "mongodb_root_password" {
  default = "password"
  sensitive = true
}

variable "jwt_secret" {
  default = "your_super_secret_jwt_key_change_this_in_production"
  sensitive = true
}
