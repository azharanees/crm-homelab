aws_region      = "us-east-1"
environment     = "dev"
vpc_cidr        = "10.0.0.0/16"
public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnets = ["10.0.10.0/24", "10.0.11.0/24"]

instance_type    = "t3.medium"
desired_capacity = 2
min_capacity     = 1
max_capacity     = 4

db_instance_class = "db.t3.micro"
allocated_storage = 20
backup_retention  = 7
