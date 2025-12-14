class Task < ApplicationRecord
  belongs_to :user
  belongs_to :lead

  validates :title, :user_id, :lead_id, presence: true
  validates :status, inclusion: { in: %w(open completed) }

  enum status: { open: "open", completed: "completed" }

  scope :for_user, ->(user_id) { where(user_id: user_id) }
  scope :overdue, -> { where("due_date < ?", Time.zone.today) }
  scope :due_today, -> { where("due_date = ?", Time.zone.today) }
  scope :open, -> { where(status: "open") }
end
