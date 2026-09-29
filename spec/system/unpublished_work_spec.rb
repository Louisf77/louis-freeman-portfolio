RSpec.describe "Unpublished work" do
  before { seed_content }

  context "when loading Home" do
    before do
      visit root_path
      page.assert_selector(:css, "h1#hero-title")
    end

    it "keeps the Selected work heading" do
      expect(page).to have_css("#work h2", text: I18n.t("ui.selected_work_heading"))
    end

    it "shows the coming-soon card" do
      expect(page).to have_css("#work", text: I18n.t("ui.selected_work_coming_soon_body"))
    end

    it "keeps Selected work between Experience and Capabilities" do
      expect(all("main section[id]", visible: :all).pluck(:id)).to eq(%w[hero experience work capabilities])
    end

    it "shows no Work link in the nav" do
      expect(page).to have_no_css("nav a", text: I18n.t("ui.nav_work"))
    end

    it "links nowhere on the Work page" do
      expect(page).to have_no_css("a[href^='/work']")
    end
  end

  context "when loading Home on a phone", :compact do
    before do
      visit root_path
      page.assert_selector(:css, "h1#hero-title")
    end

    it "shows the coming-soon card" do
      expect(page).to have_css("#work", text: I18n.t("ui.selected_work_coming_soon_body"))
    end
  end

  context "when opening the Work page directly" do
    let(:not_found_heading) { Nokogiri::HTML(Rails.public_path.join("404.html").read).at_css("h1").text }

    before { visit work_path }

    it "shows the not found page" do
      expect(page).to have_css("h1", text: not_found_heading)
    end
  end
end
