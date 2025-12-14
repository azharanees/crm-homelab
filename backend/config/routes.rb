Rails.application.routes.draw do
  # Health check endpoint
  get "/up", to: proc { [200, {}, ["OK"]] }

  namespace :api do
    namespace :v1 do
      # Auth endpoints
      post "auth/register", to: "auth#register"
      post "auth/login", to: "auth#login"
      get "auth/me", to: "auth#me"

      # Leads endpoints
      resources :leads do
        resources :tasks, only: [:index, :create]
        resources :notes, only: [:index, :create]
      end

      # Task and Note routes
      resources :tasks, only: [:update, :destroy]
      resources :notes, only: [:destroy]
    end
  end
end
