terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Service Account Role for API (IRSA)
resource "aws_iam_role" "crm_api_sa" {
  name = "${var.environment}-crm-api-sa"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = var.oidc_provider_arn
        }
        Condition = {
          StringEquals = {
            "${replace(var.oidc_issuer, "https://", "")}:sub" = "system:serviceaccount:crm:api"
            "${replace(var.oidc_issuer, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}

# Policy for API to access RDS
resource "aws_iam_role_policy" "crm_api_rds" {
  name = "${var.environment}-crm-api-rds"
  role = aws_iam_role.crm_api_sa.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "rds:DescribeDBInstances",
          "rds-db:connect"
        ]
        Resource = var.rds_arn
      }
    ]
  })
}

# Policy for API to access Secrets Manager
resource "aws_iam_role_policy" "crm_api_secrets" {
  name = "${var.environment}-crm-api-secrets"
  role = aws_iam_role.crm_api_sa.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = "arn:aws:secretsmanager:*:*:secret:${var.environment}/crm/*"
      }
    ]
  })
}
