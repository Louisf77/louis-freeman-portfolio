RSpec.describe "No non-essential cookies", :js do
  let(:session_key) { Rails.application.config.session_options.fetch(:key) }

  def cookies_in_browser
    page.driver.cookies.keys
  end

  context "when visiting for the first time" do
    before do
      Content::Seeder.from_file(path: Content::Seeder::SOURCE_PATH).call
      visit root_path
      page.assert_selector(:css, "nav", text: I18n.t("ui.nav_work"))
    end

    it "sets no cookies other than the Rails session" do
      expect(cookies_in_browser - [session_key]).to be_empty
    end

    it "stores nothing in localStorage" do
      expect(page.evaluate_script("window.localStorage.length")).to eq(0)
    end

    it "stores nothing in sessionStorage" do
      expect(page.evaluate_script("window.sessionStorage.length")).to eq(0)
    end

    it "shows no cookie banner" do
      expect(page).to have_no_text(/cookie/i)
    end
  end
end
