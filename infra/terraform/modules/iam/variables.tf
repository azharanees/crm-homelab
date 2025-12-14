variable "environment" {
  description = "Environment name"
  type        = string
}

variable "oidc_provider_arn" {
  description = "OIDC provider ARN"
  type        = string
}

variable "oidc_issuer" {
  description = "OIDC issuer URL"
  type        = string
}

variable "rds_arn" {
  description = "RDS instance ARN"
  type        = string
}
