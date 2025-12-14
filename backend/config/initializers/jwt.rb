JWT_SECRET = ENV["JWT_SECRET"] || "your-secret-key-change-in-production"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION = 24.hours