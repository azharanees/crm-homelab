# Uncomment after creating S3 bucket and DynamoDB table
# terraform {
#   backend "s3" {
#     bucket         = "your-org-terraform-state"
#     key            = "crm/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-locks"
#   }
# }

# For now, use local backend
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}
