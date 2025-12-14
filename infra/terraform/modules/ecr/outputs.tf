output "api_repository_url" {
  description = "ECR API repository URL"
  value       = aws_ecr_repository.api.repository_url
}

output "web_repository_url" {
  description = "ECR Web repository URL"
  value       = aws_ecr_repository.web.repository_url
}

output "api_repository_arn" {
  description = "ECR API repository ARN"
  value       = aws_ecr_repository.api.arn
}

output "web_repository_arn" {
  description = "ECR Web repository ARN"
  value       = aws_ecr_repository.web.arn
}
