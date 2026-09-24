class CreateHeroGreetings < ActiveRecord::Migration[8.1]
  def up
    create_table :hero_greetings do |t|
      t.string :text, null: false
      t.integer :position, null: false

      t.timestamps
    end

    add_index :hero_greetings, :position, unique: true
  end

  def down
    drop_table :hero_greetings
  end
end
