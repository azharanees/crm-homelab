module Api
  module V1
    class AuthController < ApplicationController
      before_action :authorize_request, except: [:register, :login]

      def register
        user = User.new(user_params)

        if user.save
          token = encode_token(user.id)

          render json: {
            user: ActiveModelSerializers::SerializableResource.new(user, serializer: UserSerializer),
            token: token
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        # Handle both top-level and nested params
        email = params[:email] || params.dig(:auth, :email)
        password = params[:password] || params.dig(:auth, :password)
        
        user = User.find_by(email: email)

        if user&.authenticate(password)
          token = encode_token(user.id)

          render json: {
            user: ActiveModelSerializers::SerializableResource.new(user, serializer: UserSerializer),
            token: token
          }, status: :ok
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end

      def me
        render json: current_user, serializer: UserSerializer, status: :ok
      end

      private

      def user_params
        params.require(:user).permit(:email, :password, :name, :role)
      end
    end
  end
end