class CreateCapabilities < ActiveRecord::Migration[8.1]
  def up
    create_table :capabilities do |t|
      t.references :capability_group, foreign_key: true
      t.string :name, null: false
      t.integer :position
      t.boolean :in_ticker, null: false, default: false
      t.string :ticker_label
      t.integer :ticker_position

      t.timestamps
    end

    add_index :capabilities, %i[capability_group_id position], unique: true
    add_index :capabilities, :ticker_position, unique: true, where: "ticker_position IS NOT NULL"
  end

  def down
    drop_table :capabilities
  end
end
