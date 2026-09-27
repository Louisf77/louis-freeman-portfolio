RSpec.describe "Navigation" do
  let(:profile) { Profile.current }

  before { seed_content }

  context "when following the nav from Home to Work" do
    before do
      visit root_path
      page.assert_selector(:css, "h1#hero-title")
      mark_page_load
      forget_api_requests
      within("nav") { click_on I18n.t("ui.nav_work") }
      page.assert_selector(:css, "h1#work-heading")
    end

    it "renders the Work page without a full reload" do
      expect(page).to be_the_marked_page_load
    end

    it "fetches only the Work content from the API" do
      expect(api_requests).to eq([api_v1_work_path])
    end

    it "receives a Work body that matches the contract" do
      expect(api_response_body(path: api_v1_work_path)).to match_contract("api/v1/work/show")
    end
  end

  context "when following the nav from Work to About" do
    before do
      visit work_path
      page.assert_selector(:css, "h1#work-heading")
      mark_page_load
      forget_api_requests
      within("nav") { click_on I18n.t("ui.nav_about") }
      page.assert_selector(:css, "h1#hi-title")
    end

    it "renders the About page without a full reload" do
      expect(page).to be_the_marked_page_load
    end

    it "receives an About body that matches the contract" do
      expect(api_response_body(path: api_v1_about_path)).to match_contract("api/v1/about/show")
    end
  end

  context "when following the nav from About to Home" do
    before do
      visit about_path
      page.assert_selector(:css, "h1#hi-title")
      mark_page_load
      forget_api_requests
      within("nav") { click_on I18n.t("ui.nav_home") }
      page.assert_selector(:css, "h1#hero-title")
    end

    it "renders Home without a full reload" do
      expect(page).to be_the_marked_page_load
    end

    it "receives a Home body that matches the contract" do
      expect(api_response_body(path: api_v1_home_path)).to match_contract("api/v1/home/show")
    end
  end

  context "when opening the contact menu" do
    before do
      visit root_path
      within("nav") { click_on I18n.t("ui.contact") }
    end

    it "links to the profile's email" do
      expect(page).to have_link(I18n.t("ui.contact_email"), href: "mailto:#{profile.email}")
    end

    it "links to the profile's LinkedIn" do
      expect(page).to have_link(I18n.t("ui.contact_linkedin"), href: profile.linkedin_url)
    end

    it "links to the profile's GitHub" do
      expect(page).to have_link(I18n.t("ui.contact_github"), href: profile.github_url)
    end
  end

  context "when opening the contact menu on a compact screen", :compact do
    before do
      visit root_path
      within("nav") { click_on I18n.t("ui.contact") }
    end

    it "drops the contact links down" do
      expect(page).to have_css(
        "[data-testid='contact-links'][data-variant='dropdown']",
        text: I18n.t("ui.contact_email"),
      )
    end
  end

  context "when the Work API fails on client navigation" do
    let(:work_api) { { failing: true } }

    before do
      visit root_path
      page.assert_selector(:css, "h1#hero-title")
      fail_api_requests(path: api_v1_work_path, failing: -> { work_api.fetch(:failing) })
      within("nav") { click_on I18n.t("ui.nav_work") }
    end

    it "shows the retry panel with the error message" do
      expect(page).to have_css("[role='alert']", text: SystemHelpers::INTERNAL_ERROR_BODY.dig(:errors, 0, :message))
    end

    context "when retrying after the API recovers" do
      before do
        retry_panel = find("[role='alert']")
        work_api[:failing] = false
        retry_panel.click_on I18n.t("ui.retry")
      end

      it "renders the Work page" do
        expect(page).to have_css("h1#work-heading")
      end
    end
  end
end
