require "rails_helper"

RSpec.describe "Smoke", :js do
  it "renders the React app shell" do
    visit root_path
    expect(page).to have_css("nav", text: I18n.t("ui.nav_work"))
  end
end
