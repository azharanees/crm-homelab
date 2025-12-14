class LeadSerializer < ActiveModel::Serializer
  attributes :id, :title, :company, :contact_name, :email, :phone, :status, :source, :address, :latitude, :longitude, :description, :created_at, :updated_at
  
  belongs_to :owner, serializer: UserSerializer
  has_many :tasks, serializer: TaskSerializer
  has_many :notes, serializer: NoteSerializer
end
