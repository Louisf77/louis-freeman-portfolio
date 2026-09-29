class RemoveFooterBlurbFromProfiles < ActiveRecord::Migration[8.1]
  def up
    safety_assured { remove_column :profiles, :footer_blurb }
  end

  def down
    add_column :profiles, :footer_blurb, :text
  end
end
