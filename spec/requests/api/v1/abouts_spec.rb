RSpec.describe "Api::V1::Abouts" do
  describe "GET /api/v1/about" do
    subject(:show_about) { get api_v1_about_path, headers: RequestHelpers::JSON_HEADERS }

    let(:seed_about_page) do
      create(:about_intro)
      create(:chat_message, question: "And outside work?", position: 2)
      create(:chat_message, question: "So, what do you do?", position: 1)
      create(:hobby, :photo, name: "Cycling", position: 2)
      create(:hobby, name: "Rugby", position: 1)
      create(:earlier_role, text: "Led a team of court attendants.", position: 1)
      create(:experience, :education, company: "University of Nottingham", position: 2)
      create(:experience, company: "Hnry", subs: [{ date_label: "Dec 2025", label: "Promoted" }], position: 1)
    end

    context "with the about intro seeded" do
      before { seed_about_page }

      it "returns ok" do
        show_about
        expect(response).to have_http_status(:ok)
      end

      it "matches the contract" do
        show_about
        expect(json_response).to match_contract("api/v1/about/show")
      end

      it "returns the conversation by position" do
        show_about
        expect(json_response.dig("about", "conversation").pluck("question"))
          .to eq(["So, what do you do?", "And outside work?"])
      end

      it "returns the hobbies by position" do
        show_about
        expect(json_response.dig("about", "hobbies", "items").pluck("name")).to eq(%w[Rugby Cycling])
      end

      it "returns the earlier roles" do
        show_about
        expect(json_response.dig("about", "hobbies", "earlier_roles").pluck("text"))
          .to eq(["Led a team of court attendants."])
      end

      it "returns the timeline by position" do
        show_about
        expect(json_response.dig("about", "timeline").pluck("company")).to eq(["Hnry", "University of Nottingham"])
      end

      it "returns experience subs with date labels" do
        show_about
        expect(json_response.dig("about", "timeline", 0, "subs"))
          .to eq([{ "date_label" => "Dec 2025", "label" => "Promoted" }])
      end
    end

    context "without the about intro seeded" do
      it "returns not found" do
        show_about
        expect(response).to have_http_status(:not_found)
      end

      it "matches the error contract" do
        show_about
        expect(json_response).to match_contract("api/v1/error")
      end

      it "names the missing section" do
        show_about
        expect(json_response["errors"].pluck("message")).to eq(["About intro has not been seeded"])
      end
    end
  end
end
