module Api
  module V1
    class ApplicationController < ::ApplicationController
      before_action :authorize_request

      protected

      def jwt_secret
        ENV['SECRET_KEY_BASE'] || Rails.application.credentials.secret_key_base || Rails.application.secrets.secret_key_base
      end

      def encode_token(user_id)
        payload = { user_id: user_id, exp: 24.hours.from_now.to_i }
        JWT.encode(payload, jwt_secret)
      end

      def decode_token
        return nil unless request.headers['Authorization']
        
        token = request.headers['Authorization'].split(' ').last
        begin
          JWT.decode(token, jwt_secret)[0]
        rescue JWT::DecodeError
          nil
        end
      end

      def current_user
        @current_user ||= User.find_by(id: decode_token&.dig('user_id')) if decode_token
      end

      def authorize_request
        render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user || action_allows_unauthenticated?
      end

      def action_allows_unauthenticated?
        ['register', 'login'].include?(action_name)
      end
    end
  end
end
