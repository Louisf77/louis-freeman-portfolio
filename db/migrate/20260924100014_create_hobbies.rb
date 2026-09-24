class CreateHobbies < ActiveRecord::Migration[8.1]
  def up
    create_table :hobbies do |t|
      t.string :name, null: false
      t.string :image_path, null: false
      t.boolean :photo, null: false, default: false
      t.integer :position, null: false

      t.timestamps
    end

    add_index :hobbies, :position, unique: true
  end

  def down
    drop_table :hobbies
  end
end
