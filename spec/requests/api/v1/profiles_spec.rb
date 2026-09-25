require "rails_helper"

RSpec.describe "Api::V1::Profiles" do
  describe "GET /api/v1/profile" do
    subject(:show_profile) { get api_v1_profile_path, headers: RequestHelpers::JSON_HEADERS }

    context "with a seeded profile" do
      before { create(:profile) }

      it "returns ok" do
        show_profile
        expect(response).to have_http_status(:ok)
      end

      it "matches the contract" do
        show_profile
        expect(json_response).to match_contract("api/v1/profile/show")
      end

      it "returns the profile" do
        show_profile
        expect(json_response.dig("profile", "github_url")).to eq("https://github.com/Louisf77")
      end

      it "allows public caching for five minutes" do
        show_profile
        expect(response.headers["Cache-Control"].split(", ")).to contain_exactly("public", "max-age=300")
      end
    end

    context "without a seeded profile" do
      it "returns not found" do
        show_profile
        expect(response).to have_http_status(:not_found)
      end

      it "matches the error contract" do
        show_profile
        expect(json_response).to match_contract("api/v1/error")
      end

      it "names the missing section" do
        show_profile
        expect(json_response["errors"]).to contain_exactly(
          "code" => "not_found", "field" => nil, "message" => "Profile has not been seeded",
        )
      end

      it "is not publicly cached" do
        show_profile
        expect(response.headers["Cache-Control"]).not_to include("public")
      end
    end

    context "when loading the profile fails unexpectedly" do
      before { allow(Profile).to receive(:current).and_raise(ActiveRecord::ConnectionNotEstablished, "database down") }

      it "returns an internal server error" do
        show_profile
        expect(response).to have_http_status(:internal_server_error)
      end

      it "matches the error contract" do
        show_profile
        expect(json_response).to match_contract("api/v1/error")
      end

      it "returns an internal error code" do
        show_profile
        expect(json_response["errors"].pluck("code")).to eq(["internal_error"])
      end

      it "logs the error class and message" do
        allow(Rails.logger).to receive(:error)
        show_profile
        expect(Rails.logger).to have_received(:error).with("ActiveRecord::ConnectionNotEstablished: database down")
      end
    end
  end
end
