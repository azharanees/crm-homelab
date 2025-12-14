class CreateLeads < ActiveRecord::Migration[7.1]
  def change
    create_table :leads do |t|
      t.string :title, null: false
      t.string :company, null: false
      t.string :contact_name
      t.string :email
      t.string :phone
      t.string :status, default: "pending", null: false
      t.string :source, default: "inbound"
      t.references :owner, foreign_key: { to_table: :users, on_delete: :cascade }, null: false
      t.text :address
      t.float :latitude
      t.float :longitude
      t.text :description

      t.timestamps
    end
  end
end
