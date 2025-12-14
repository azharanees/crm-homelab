aws_region      = "us-east-1"
environment     = "prod"
vpc_cidr        = "10.1.0.0/16"
public_subnets  = ["10.1.1.0/24", "10.1.2.0/24"]
private_subnets = ["10.1.10.0/24", "10.1.11.0/24"]

instance_type    = "t3.large"
desired_capacity = 3
min_capacity     = 2
max_capacity     = 10

db_instance_class = "db.t3.small"
allocated_storage = 100
backup_retention  = 30
