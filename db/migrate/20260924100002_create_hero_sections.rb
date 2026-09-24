class CreateHeroSections < ActiveRecord::Migration[8.1]
  def up
    create_table :hero_sections do |t|
      t.string :greeting_prefix, null: false
      t.string :tagline, null: false

      t.timestamps
    end
  end

  def down
    drop_table :hero_sections
  end
end
