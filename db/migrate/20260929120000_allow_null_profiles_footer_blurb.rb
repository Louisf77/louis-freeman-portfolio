class AllowNullProfilesFooterBlurb < ActiveRecord::Migration[8.1]
  def up
    change_column_null :profiles, :footer_blurb, true
  end

  def down
    change_column_null :profiles, :footer_blurb, false, ""
  end
end
