class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.date :due_date
      t.string :status, default: "open", null: false
      t.references :user, foreign_key: { on_delete: :cascade }, null: false
      t.references :lead, foreign_key: { on_delete: :cascade }, null: false

      t.timestamps
    end
  end
end
