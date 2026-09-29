RSpec.describe "Public file caching" do
  subject(:cache_control) do
    get path
    response.headers["cache-control"]
  end

  context "with a fingerprinted Vite asset" do
    let(:path) { ViteRuby.instance.manifest.path_for("application.tsx", type: :typescript) }

    it "caches it for a year as immutable" do
      expect(cache_control).to eq(PublicFileCaching::FINGERPRINTED_CACHE_CONTROL)
    end
  end

  context "with an unfingerprinted image" do
    let(:path) { "/og/default.png" }

    it "caches it briefly" do
      expect(cache_control).to eq(PublicFileCaching::SHORT_CACHE_CONTROL)
    end
  end

  context "with a favicon" do
    let(:path) { "/favicon.ico" }

    it "caches it briefly" do
      expect(cache_control).to eq(PublicFileCaching::SHORT_CACHE_CONTROL)
    end
  end
end
