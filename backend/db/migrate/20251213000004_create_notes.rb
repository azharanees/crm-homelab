class CreateNotes < ActiveRecord::Migration[7.1]
  def change
    create_table :notes do |t|
      t.text :body, null: false
      t.references :user, foreign_key: { on_delete: :cascade }, null: false
      t.references :lead, foreign_key: { on_delete: :cascade }, null: false

      t.timestamps
    end
  end
end
