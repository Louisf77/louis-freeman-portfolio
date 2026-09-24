class CreateWorkHeaders < ActiveRecord::Migration[8.1]
  def up
    create_table :work_headers do |t|
      t.text :intro, null: false

      t.timestamps
    end
  end

  def down
    drop_table :work_headers
  end
end
