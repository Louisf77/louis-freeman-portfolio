class CreateCapabilitiesSections < ActiveRecord::Migration[8.1]
  def up
    create_table :capabilities_sections do |t|
      t.string :title, null: false
      t.text :intro, null: false

      t.timestamps
    end
  end

  def down
    drop_table :capabilities_sections
  end
end
