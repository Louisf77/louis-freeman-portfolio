class CreateSelectedWorkSections < ActiveRecord::Migration[8.1]
  def up
    create_table :selected_work_sections do |t|
      t.text :intro, null: false

      t.timestamps
    end
  end

  def down
    drop_table :selected_work_sections
  end
end
