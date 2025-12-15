# Disable Prometheus in development to avoid initialization errors
# Enable it only in production with proper middleware setup
if Rails.env.production?
  require 'prometheus_exporter/middleware'
  
  # This will be used in config.ru or application.rb middleware stack
  # Rails.application.middleware.use PrometheusExporter::Middleware
end
