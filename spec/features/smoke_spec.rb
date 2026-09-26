RSpec.describe "Smoke", :js do
  it "renders the React app" do
    visit root_path
    expect(page).to have_css("h1", text: I18n.t("ui.hello_heading"))
  end
end
