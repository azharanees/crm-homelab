output "api_service_account_role_arn" {
  description = "API service account role ARN"
  value       = aws_iam_role.crm_api_sa.arn
}
