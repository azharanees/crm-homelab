class Note < ApplicationRecord
  belongs_to :user
  belongs_to :lead

  validates :body, :user_id, :lead_id, presence: true

  scope :recent, -> { order(created_at: :desc) }
end
