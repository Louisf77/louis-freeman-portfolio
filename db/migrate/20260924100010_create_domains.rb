class CreateDomains < ActiveRecord::Migration[8.1]
  def up
    create_table :domains do |t|
      t.string :label, null: false
      t.integer :position, null: false

      t.timestamps
    end

    add_index :domains, :position, unique: true
  end

  def down
    drop_table :domains
  end
end
