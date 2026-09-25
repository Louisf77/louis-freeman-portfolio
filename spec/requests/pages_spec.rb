require "rails_helper"

RSpec.describe "Pages" do
  let(:seed_content) { Content::Seeder.from_file(path: Content::Seeder::SOURCE_PATH).call }
  let(:base_url) { "http://www.example.com" }

  before { seed_content }

  shared_examples "a page shell" do
    it "returns ok" do
      show_page
      expect(response).to have_http_status(:ok)
    end

    it "renders the React mount point" do
      show_page
      expect(html_response.at_css("div#root")).to be_present
    end

    it "renders the page title" do
      show_page
      expect(html_response.at_css("title").text).to eq(I18n.t("meta.#{page}.title"))
    end

    it "renders the meta description" do
      show_page
      expect(meta_content(name: "description")).to eq(I18n.t("meta.#{page}.description"))
    end

    it "renders the canonical link" do
      show_page
      expect(html_response.at_css("link[rel='canonical']")["href"]).to eq("#{base_url}#{path}")
    end

    it "renders the Open Graph title" do
      show_page
      expect(meta_content(property: "og:title")).to eq(I18n.t("meta.#{page}.title"))
    end

    it "renders the Open Graph description" do
      show_page
      expect(meta_content(property: "og:description")).to eq(I18n.t("meta.#{page}.description"))
    end

    it "renders the Open Graph URL" do
      show_page
      expect(meta_content(property: "og:url")).to eq("#{base_url}#{path}")
    end

    it "renders the Open Graph share image" do
      show_page
      expect(meta_content(property: "og:image")).to eq("#{base_url}/og/default.png")
    end

    it "renders the Open Graph share image size" do
      show_page
      expect(%w[og:image:width og:image:height].map { |property| meta_content(property:) }).to eq(%w[1200 630])
    end

    it "renders the Twitter card" do
      show_page
      expect(meta_content(name: "twitter:card")).to eq("summary_large_image")
    end

    it "renders the Twitter image" do
      show_page
      expect(meta_content(name: "twitter:image")).to eq("#{base_url}/og/default.png")
    end

    it "preconnects to Google Fonts" do
      show_page
      expect(html_response.css("link[rel='preconnect']").pluck("href"))
        .to eq(["https://fonts.googleapis.com", "https://fonts.gstatic.com"])
    end

    it "loads the Google Fonts stylesheet" do
      show_page
      expect(html_response.at_css("link[rel='stylesheet'][href^='https://fonts.googleapis.com/css2']")).to be_present
    end

    it "renders the Person structured data from the profile" do
      show_page
      expect(structured_data_types).to include("Person")
    end

    it "embeds a bootstrap that matches the contract" do
      show_page
      expect(bootstrap).to match_contract("pages/bootstrap")
    end

    it "embeds the profile and page queries" do
      show_page
      expect(bootstrap["queries"].keys).to eq(["profile", page])
    end

    it "embeds the UI strings" do
      show_page
      expect(bootstrap["ui"]).to eq(I18n.t("ui").stringify_keys)
    end

    it "embeds the page query exactly as the API returns it" do
      show_page
      page_query = bootstrap.dig("queries", page)
      get "/api/v1/#{page}", headers: RequestHelpers::JSON_HEADERS
      expect(page_query).to eq(json_response)
    end
  end

  describe "GET /" do
    subject(:show_page) { get root_path }

    let(:page) { "home" }
    let(:path) { "/" }

    it_behaves_like "a page shell"

    it "renders the WebSite structured data" do
      show_page
      expect(structured_data_types).to include("WebSite")
    end

    context "with the seeded profile" do
      let(:person) do
        {
          "@type" => "Person",
          "address" => { "@type" => "PostalAddress", "addressLocality" => "London" },
          "email" => "hello@louisfreeman.co.uk",
          "jobTitle" => "Senior Full Stack Engineer",
          "name" => "Louis Freeman",
          "sameAs" => ["https://www.linkedin.com/in/louis-freeman7/", "https://github.com/Louisf77"],
          "url" => "#{base_url}/",
        }
      end

      it "describes Louis in the Person structured data" do
        show_page
        expect(structured_data_node(type: "Person")).to eq(person)
      end
    end

    context "with an old browser user agent" do
      subject(:show_page) { get root_path, headers: { "User-Agent" => old_browser_user_agent } }

      let(:old_browser_user_agent) do
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) " \
          "Version/9.1.2 Safari/601.7.7"
      end

      it "still serves the page" do
        show_page
        expect(response).to have_http_status(:ok)
      end
    end

    context "with content containing a closing script tag" do
      let(:seed_content) do
        super()
        Profile.current.update!(footer_blurb: "</script><script>alert(1)</script>")
      end

      it "escapes it so the script cannot break out" do
        show_page
        expect(response.body).not_to include("<script>alert(1)")
      end

      it "keeps the original text in the bootstrap" do
        show_page
        expect(bootstrap.dig("queries", "profile", "profile", "footer_blurb"))
          .to eq("</script><script>alert(1)</script>")
      end
    end
  end

  describe "GET /work" do
    subject(:show_page) { get work_path }

    let(:page) { "work" }
    let(:path) { "/work" }

    it_behaves_like "a page shell"

    it "leaves out the WebSite structured data" do
      show_page
      expect(structured_data_types).not_to include("WebSite")
    end
  end

  describe "GET /about" do
    subject(:show_page) { get about_path }

    let(:page) { "about" }
    let(:path) { "/about" }

    it_behaves_like "a page shell"

    it "leaves out the WebSite structured data" do
      show_page
      expect(structured_data_types).not_to include("WebSite")
    end
  end

  describe "GET an unknown path" do
    subject(:show_page) { get "/nope" }

    before do
      allow(Rails.application).to(
        receive(:env_config).and_wrap_original do |original|
          original.call.merge("action_dispatch.show_detailed_exceptions" => false)
        end,
      )
    end

    it "returns not found" do
      show_page
      expect(response).to have_http_status(:not_found)
    end

    it "renders the styled 404 page" do
      show_page
      expect(html_response.at_css("a[href='/']").text).to start_with("Back home")
    end
  end

  def bootstrap
    JSON.parse(html_response.at_css("script#bootstrap[type='application/json']").text)
  end

  def structured_data_nodes
    JSON.parse(html_response.at_css("script[type='application/ld+json']").text).fetch("@graph")
  end

  def structured_data_types
    structured_data_nodes.pluck("@type")
  end

  def structured_data_node(type:)
    structured_data_nodes.find { |node| node["@type"] == type }
  end

  def meta_content(name: nil, property: nil)
    selector = name ? "meta[name='#{name}']" : "meta[property='#{property}']"
    html_response.at_css(selector)["content"]
  end
end
