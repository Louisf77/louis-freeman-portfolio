require "rails_helper"

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

    it "embeds the UI strings in the bootstrap JSON" do
      home
      expect(response.body).to include(I18n.t("ui.hello_heading"))
    end
  end
end
