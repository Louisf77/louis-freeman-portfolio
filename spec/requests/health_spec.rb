require "rails_helper"

RSpec.describe "Health check" do
  describe "GET /up" do
    subject(:health_check) { get rails_health_check_path }

    it "returns ok" do
      health_check
      expect(response).to have_http_status(:ok)
    end
  end
end
