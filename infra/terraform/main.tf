module "vpc" {
  source = "./modules/vpc"

  environment     = var.environment
  vpc_cidr        = var.vpc_cidr
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
}

module "eks" {
  source = "./modules/eks"

  environment        = var.environment
  cluster_name       = var.cluster_name
  kubernetes_version = var.kubernetes_version
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids  = module.vpc.public_subnet_ids
  instance_type      = var.instance_type
  desired_capacity   = var.desired_capacity
  min_capacity       = var.min_capacity
  max_capacity       = var.max_capacity
}

module "rds" {
  source = "./modules/rds"

  environment       = var.environment
  db_subnet_ids     = module.vpc.private_subnet_ids
  vpc_id            = module.vpc.vpc_id
  postgres_version  = var.postgres_version
  instance_class    = var.db_instance_class
  db_username       = var.db_username
  allocated_storage = var.allocated_storage
  backup_retention  = var.backup_retention
}

module "ecr" {
  source = "./modules/ecr"

  environment = var.environment
}

module "iam" {
  source = "./modules/iam"

  environment       = var.environment
  oidc_provider_arn = module.eks.oidc_provider_arn
  oidc_issuer       = module.eks.oidc_issuer
  rds_arn           = module.rds.db_instance_arn
}
