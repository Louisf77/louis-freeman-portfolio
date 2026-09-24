require "rails_helper"

RSpec.describe "Cookie consent", :js do
  let(:banner_title) { I18n.t("ui.cookie_banner_title") }
  let(:google_request_pattern) { /google|doubleclick|gstatic/ }

  def banner
    find(:region, banner_title)
  end

  def browser_cookie_names
    page.driver.cookies.keys
  end

  def google_requests
    page.driver.browser.network.traffic.map { |exchange| exchange.request.url }.grep(google_request_pattern)
  end

  def stored_choice
    JSON.parse(CGI.unescape(page.driver.cookies.fetch(CookieConsent::COOKIE_NAME).value))
  end

  context "when visiting for the first time" do
    before { visit root_path }

    it "shows the banner" do
      expect(page).to have_selector(:region, banner_title)
    end

    it "sets no analytics cookies" do
      expect(browser_cookie_names.grep(/\A_ga/)).to be_empty
    end

    it "stores no consent choice yet" do
      expect(browser_cookie_names).not_to include(CookieConsent::COOKIE_NAME)
    end

    it "defaults Consent Mode to denied" do
      expect(page.evaluate_script("JSON.stringify(window.dataLayer)")).to include('"analytics_storage":"denied"')
    end
  end

  context "when rejecting all" do
    before do
      visit root_path
      banner.click_on(I18n.t("ui.cookie_reject_all"))
      page.assert_no_selector(:region, banner_title)
    end

    it "hides the banner" do
      expect(page).to have_no_selector(:region, banner_title)
    end

    it "stores analytics as denied" do
      expect(stored_choice).to include("analytics" => false)
    end

    it "sets no analytics cookies" do
      expect(browser_cookie_names.grep(/\A_ga/)).to be_empty
    end

    it "makes no requests to Google" do
      expect(google_requests).to be_empty
    end
  end

  context "when accepting all" do
    before do
      visit root_path
      banner.click_on(I18n.t("ui.cookie_accept_all"))
      page.assert_no_selector(:region, banner_title)
      visit root_path
      page.assert_selector(:css, "h1", text: I18n.t("ui.hello_heading"))
    end

    it "keeps the banner hidden after a reload" do
      expect(page).to have_no_selector(:region, banner_title)
    end

    it "applies the stored grant to Consent Mode on page load" do
      expect(page.evaluate_script("JSON.stringify(window.dataLayer)")).to include('"analytics_storage":"granted"')
    end
  end

  context "when dismissing with Escape" do
    before do
      visit root_path
      page.assert_selector(:region, banner_title)
      find("body").send_keys(:escape)
      page.assert_no_selector(:region, banner_title)
    end

    it "stores analytics as denied" do
      expect(stored_choice).to include("analytics" => false)
    end
  end

  context "when reopening from Cookie settings" do
    before do
      visit root_path
      banner.click_on(I18n.t("ui.cookie_reject_all"))
      click_on I18n.t("ui.cookie_settings")
    end

    it "shows the banner again" do
      expect(page).to have_selector(:region, banner_title)
    end
  end
end
