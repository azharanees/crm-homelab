class Lead < ApplicationRecord
  belongs_to :owner, class_name: "User"
  has_many :tasks, dependent: :destroy
  has_many :notes, dependent: :destroy

  validates :title, :company, :status, presence: true
  validates :status, inclusion: { in: %w(new_lead pending contacted qualified won lost) }
  validates :source, inclusion: { in: %w(referral cold_call inbound other) }, allow_blank: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :owner_id, presence: true

  enum status: { new_lead: "new_lead", pending: "pending", contacted: "contacted", qualified: "qualified", won: "won", lost: "lost" }
  enum source: { referral: "referral", cold_call: "cold_call", inbound: "inbound", other: "other" }

  scope :by_owner, ->(user_id) { where(owner_id: user_id) }
  scope :by_status, ->(status) { where(status: status) if status.present? }
  scope :by_source, ->(source) { where(source: source) if source.present? }
  scope :search, ->(q) { where("title ILIKE ? OR company ILIKE ? OR contact_name ILIKE ?", "%#{q}%", "%#{q}%", "%#{q}%") if q.present? }
end
