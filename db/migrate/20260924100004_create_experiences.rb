class CreateExperiences < ActiveRecord::Migration[8.1]
  def up
    create_table :experiences do |t|
      t.string :company, null: false
      t.string :role, null: false
      t.string :dates_label, null: false
      t.string :year_label, null: false
      t.string :duration_label
      t.string :watermark
      t.text :summary, null: false
      t.jsonb :highlights, null: false, default: []
      t.jsonb :tags, null: false, default: []
      t.jsonb :subs, null: false, default: []
      t.boolean :education, null: false, default: false
      t.integer :position, null: false

      t.timestamps
    end

    add_index :experiences, :position, unique: true
  end

  def down
    drop_table :experiences
  end
end
