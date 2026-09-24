class CreateCaseStudies < ActiveRecord::Migration[8.1]
  def up
    create_table :case_studies do |t|
      t.string :slug, null: false
      t.string :number, null: false
      t.string :title, null: false
      t.string :years_label, null: false
      t.string :role, null: false
      t.string :diagram_key, null: false
      t.text :headline, null: false
      t.text :description, null: false
      t.jsonb :tags, null: false, default: []
      t.string :metric
      t.boolean :featured, null: false, default: false
      t.integer :position, null: false

      t.timestamps
    end

    add_index :case_studies, :slug, unique: true
    add_index :case_studies, :position, unique: true
    add_index :case_studies, :featured
  end

  def down
    drop_table :case_studies
  end
end
