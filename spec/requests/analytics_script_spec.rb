RSpec.describe "Analytics script" do
  subject(:show_page) { get path }

  let(:umami_script_selector) { "script[src='https://cloud.umami.is/script.js']" }

  before { Content::Seeder.from_file(path: Content::Seeder::SOURCE_PATH).call }

  shared_examples "a page with the Umami script" do
    context "without a Umami website ID configured" do
      around do |example|
        with_umami_website_id(nil) { example.run }
      end

      it "leaves the script out" do
        show_page
        expect(umami_script).to be_nil
      end
    end

    context "with a blank Umami website ID configured" do
      around do |example|
        with_umami_website_id("") { example.run }
      end

      it "leaves the script out" do
        show_page
        expect(umami_script).to be_nil
      end
    end

    context "with a Umami website ID configured" do
      around do |example|
        with_umami_website_id("4f1c2a8e-0000-4000-8000-000000000000") { example.run }
      end

      it "loads the script" do
        show_page
        expect(umami_script).to be_present
      end

      it "passes the website ID" do
        show_page
        expect(umami_script["data-website-id"]).to eq("4f1c2a8e-0000-4000-8000-000000000000")
      end

      it "limits tracking to the production domain" do
        show_page
        expect(umami_script["data-domains"]).to eq("louisfreeman.co.uk")
      end

      it "tracks page views automatically" do
        show_page
        expect(umami_script["data-auto-track"]).to eq("true")
      end

      it "defers the script" do
        show_page
        expect(umami_script["defer"]).not_to be_nil
      end

      it "loads it in the head" do
        show_page
        expect(html_response.at_css("head #{umami_script_selector}")).to be_present
      end
    end
  end

  describe "GET /" do
    let(:path) { "/" }

    it_behaves_like "a page with the Umami script"
  end

  describe "GET /work" do
    let(:path) { "/work" }

    before { create(:case_study) }

    it_behaves_like "a page with the Umami script"
  end

  describe "GET /about" do
    let(:path) { "/about" }

    it_behaves_like "a page with the Umami script"
  end

  def umami_script
    html_response.at_css(umami_script_selector)
  end
end
