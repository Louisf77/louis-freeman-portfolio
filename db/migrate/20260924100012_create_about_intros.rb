class CreateAboutIntros < ActiveRecord::Migration[8.1]
  def up
    create_table :about_intros do |t|
      t.string :heading, null: false
      t.string :subline, null: false

      t.timestamps
    end
  end

  def down
    drop_table :about_intros
  end
end
