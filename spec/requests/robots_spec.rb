RSpec.describe "Robots" do
  describe "GET /robots.txt" do
    subject(:show_robots) { get "/robots.txt" }

    def robots_lines
      response.body.lines.map(&:strip)
    end

    it "returns ok" do
      show_robots
      expect(response).to have_http_status(:ok)
    end

    it "is served as plain text" do
      show_robots
      expect(response.media_type).to eq("text/plain")
    end

    it "applies to every crawler" do
      show_robots
      expect(robots_lines).to include("User-agent: *")
    end

    it "allows the whole site" do
      show_robots
      expect(robots_lines).to include("Allow: /")
    end

    it "disallows only the JSON API" do
      show_robots
      expect(robots_lines.grep(/\ADisallow:/)).to eq(["Disallow: /api/"])
    end

    it "points to the sitemap on the production origin" do
      show_robots
      expect(robots_lines).to include("Sitemap: https://louisfreeman.co.uk/sitemap.xml")
    end
  end
end
