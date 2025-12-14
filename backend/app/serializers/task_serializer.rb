class TaskSerializer < ActiveModel::Serializer
  attributes :id, :title, :due_date, :status, :created_at, :updated_at
  
  belongs_to :user, serializer: UserSerializer
end
