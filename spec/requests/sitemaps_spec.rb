RSpec.describe "Sitemaps" do
  describe "GET /sitemap.xml" do
    subject(:show_sitemap) { get "/sitemap.xml" }

    let(:sitemap_namespace) { { "sitemap" => "http://www.sitemaps.org/schemas/sitemap/0.9" } }

    def sitemap_locations
      Nokogiri::XML(response.body).xpath("//sitemap:urlset/sitemap:url/sitemap:loc", sitemap_namespace).map(&:text)
    end

    it "returns ok" do
      show_sitemap
      expect(response).to have_http_status(:ok)
    end

    it "is served as XML" do
      show_sitemap
      expect(response.media_type).to eq("application/xml")
    end

    it "lists the three public pages on the production origin" do
      show_sitemap
      expect(sitemap_locations).to eq(
        ["https://louisfreeman.co.uk/", "https://louisfreeman.co.uk/work", "https://louisfreeman.co.uk/about"],
      )
    end

    context "when requested on another host" do
      subject(:show_sitemap) { get "/sitemap.xml", headers: { "Host" => "www.louisfreeman.co.uk" } }

      it "keeps the URLs on the production origin" do
        show_sitemap
        expect(sitemap_locations).to all(start_with("https://louisfreeman.co.uk/"))
      end
    end
  end
end
