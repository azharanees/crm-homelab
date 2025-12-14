FROM ruby:3.4.7-slim

WORKDIR /app

# Set production environment
ENV RAILS_ENV=production
ENV BUNDLE_WITHOUT=development:test
ENV RAILS_LOG_TO_STDOUT=true
ENV RAILS_SERVE_STATIC_FILES=true

# Install dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    libyaml-dev \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install bundler
RUN gem install bundler

# Copy BOTH Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle install --jobs 4 --retry 3

# Copy the rest of the app
COPY . .

# Precompile assets
RUN bundle exec rails assets:precompile 2>&1 | grep -v "Yarn not installed" || true

# Create log and tmp directories with proper permissions
RUN mkdir -p log tmp/pids tmp/sockets && \
    chmod -R u+rwx log tmp

# Don't change ownership to nobody yet (we need to write during startup)
# USER nobody will cause issues with database migrations

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/up || exit 1

ENTRYPOINT ["/app/bin/docker-entrypoint"]
CMD ["bin/rails", "server", "-b", "0.0.0.0"]
