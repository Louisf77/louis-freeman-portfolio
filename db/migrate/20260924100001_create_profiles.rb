class CreateProfiles < ActiveRecord::Migration[8.1]
  def up
    create_table :profiles do |t|
      t.string :name, null: false
      t.string :role, null: false
      t.string :location, null: false
      t.string :email, null: false
      t.string :linkedin_url, null: false
      t.string :github_url, null: false
      t.text :footer_blurb, null: false

      t.timestamps
    end
  end

  def down
    drop_table :profiles
  end
end
