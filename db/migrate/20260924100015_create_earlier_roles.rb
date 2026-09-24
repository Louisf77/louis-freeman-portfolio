class CreateEarlierRoles < ActiveRecord::Migration[8.1]
  def up
    create_table :earlier_roles do |t|
      t.string :text, null: false
      t.integer :position, null: false

      t.timestamps
    end

    add_index :earlier_roles, :position, unique: true
  end

  def down
    drop_table :earlier_roles
  end
end
