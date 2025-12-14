class User < ApplicationRecord
  has_secure_password

  has_many :leads, foreign_key: "owner_id", dependent: :destroy
  has_many :tasks, dependent: :destroy
  has_many :notes, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
  validates :name, presence: true
  validates :role, presence: true, inclusion: { in: %w(rep manager) }

  enum role: { rep: "rep", manager: "manager" }

  def generate_jwt_token
    payload = { user_id: id, email: email, exp: (Time.now + 24.hours).to_i }
    JWT.encode(payload, ENV["JWT_SECRET"] || "your-secret-key", "HS256")
  end

  def self.decode_jwt_token(token)
    decoded = JWT.decode(token, ENV["JWT_SECRET"] || "your-secret-key", true, algorithm: "HS256")
    decoded
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end
end
