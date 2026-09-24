class CreateCapabilityGroups < ActiveRecord::Migration[8.1]
  def up
    create_table :capability_groups do |t|
      t.string :title, null: false
      t.integer :position, null: false

      t.timestamps
    end

    add_index :capability_groups, :position, unique: true
  end

  def down
    drop_table :capability_groups
  end
end
