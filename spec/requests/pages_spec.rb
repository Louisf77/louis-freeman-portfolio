RSpec.describe "Pages" do
  describe "GET /" do
    subject(:home) { get root_path }

    it "returns ok" do
      home
      expect(response).to have_http_status(:ok)
    end

    it "renders the React mount point" do
      home
      expect(response.body).to include('<div id="root"></div>')
    end

    context "with an old browser user agent" do
      subject(:home) { get root_path, headers: { "User-Agent" => old_browser_user_agent } }

      let(:old_browser_user_agent) do
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) " \
          "Version/9.1.2 Safari/601.7.7"
      end

      it "still serves the page" do
        home
        expect(response).to have_http_status(:ok)
      end
    end

    it "embeds the UI strings in the bootstrap JSON" do
      home
      expect(response.body).to include(I18n.t("ui.hello_heading"))
    end
  end
end
