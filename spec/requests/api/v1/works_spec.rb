require "rails_helper"

RSpec.describe "Api::V1::Works" do
  describe "GET /api/v1/work" do
    subject(:show_work) { get api_v1_work_path, headers: RequestHelpers::JSON_HEADERS }

    let(:work_header) { create(:work_header) }
    let(:non_featured_case_study) { create(:case_study, slug: "ai-tooling", position: 2) }
    let(:featured_case_study) { create(:case_study, :featured, slug: "card-issuing", position: 1) }

    context "with the work header seeded" do
      before do
        work_header
        non_featured_case_study
        featured_case_study
      end

      it "returns ok" do
        show_work
        expect(response).to have_http_status(:ok)
      end

      it "matches the contract" do
        show_work
        expect(json_response).to match_contract("api/v1/work/show")
      end

      it "returns the header intro" do
        show_work
        expect(json_response.dig("work", "header", "intro")).to eq(work_header.intro)
      end

      it "returns every case study by position, featured or not" do
        show_work
        expect(json_response.dig("work", "case_studies").pluck("slug")).to eq(%w[card-issuing ai-tooling])
      end
    end

    context "without the work header seeded" do
      it "returns not found" do
        show_work
        expect(response).to have_http_status(:not_found)
      end

      it "matches the error contract" do
        show_work
        expect(json_response).to match_contract("api/v1/error")
      end

      it "names the missing section" do
        show_work
        expect(json_response["errors"].pluck("message")).to eq(["Work header has not been seeded"])
      end
    end
  end
end
