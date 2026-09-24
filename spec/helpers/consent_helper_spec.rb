require "rails_helper"

RSpec.describe ConsentHelper do
  describe "#consent_mode_script_tag" do
    subject(:script) { helper.consent_mode_script_tag }

    let(:stored_choice) { nil }

    before do
      helper.request.cookies[CookieConsent::COOKIE_NAME] = stored_choice if stored_choice
    end

    it "denies analytics storage by default" do
      expect(script).to include('"analytics_storage":"denied"')
    end

    it "denies ad storage by default" do
      expect(script).to include('"ad_storage":"denied"')
    end

    it "grants security storage by default" do
      expect(script).to include('"security_storage":"granted"')
    end

    it "waits for an update before sending hits" do
      expect(script).to include('"wait_for_update":500')
    end

    it "does not grant analytics without a stored choice" do
      expect(script).not_to include('"analytics_storage":"granted"')
    end

    context "with a stored choice that grants analytics" do
      let(:stored_choice) { { analytics: true, version: CookieConsent::VERSION }.to_json }

      it "applies the stored choice straight away" do
        expect(script).to include('gtag("consent","update",{"analytics_storage":"granted"})')
      end
    end

    context "with a stored choice that denies analytics" do
      let(:stored_choice) { { analytics: false, version: CookieConsent::VERSION }.to_json }

      it "keeps analytics denied" do
        expect(script).not_to include('"analytics_storage":"granted"')
      end
    end
  end
end
