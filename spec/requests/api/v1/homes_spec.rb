require "rails_helper"

RSpec.describe "Api::V1::Homes" do
  describe "GET /api/v1/home" do
    subject(:show_home) { get api_v1_home_path, headers: RequestHelpers::JSON_HEADERS }

    let(:seeded_sections) { %i[hero_section selected_work_section capabilities_section] }
    let(:leadership) { create(:capability_group, title: "Leadership", position: 2) }
    let(:front_end) { create(:capability_group, title: "Front end", position: 1) }
    let(:seed_home_page) do
      seeded_sections.each { |section| create(section) }
      create(:hero_greeting, text: "a problem solver.", position: 2)
      create(:hero_greeting, text: "Louis.", position: 1)
      create(:experience, company: "Hnry", position: 1)
      create(:case_study, slug: "ai-tooling", position: 2)
      create(:case_study, :featured, slug: "card-issuing", position: 1)
      create(:domain, label: "Banking & card integrations", position: 1)
      create(:capability, capability_group: leadership, name: "Mentoring", position: 2)
      create(:capability, capability_group: leadership, name: "Line management", position: 1)
      create(
        :capability, :in_ticker,
        capability_group: front_end, name: "React 18", ticker_label: "React", position: 1, ticker_position: 2,
      )
      create(:capability, :ungrouped, name: "Ruby", ticker_position: 1)
    end

    before { seed_home_page }

    it "returns ok" do
      show_home
      expect(response).to have_http_status(:ok)
    end

    it "matches the contract" do
      show_home
      expect(json_response).to match_contract("api/v1/home/show")
    end

    it "returns the hero greetings by position" do
      show_home
      expect(json_response.dig("home", "hero", "greetings").pluck("text")).to eq(["Louis.", "a problem solver."])
    end

    it "returns the experiences" do
      show_home
      expect(json_response.dig("home", "experience", "experiences").pluck("company")).to eq(["Hnry"])
    end

    it "returns only featured case studies in selected work" do
      show_home
      expect(json_response.dig("home", "selected_work", "case_studies").pluck("slug")).to eq(["card-issuing"])
    end

    it "returns the capability groups by position" do
      show_home
      expect(json_response.dig("home", "capabilities", "groups").pluck("title")).to eq(["Front end", "Leadership"])
    end

    it "returns each group's capabilities by position" do
      show_home
      expect(json_response.dig("home", "capabilities", "groups", 1, "capabilities").pluck("name"))
        .to eq(["Line management", "Mentoring"])
    end

    it "keeps ungrouped ticker capabilities out of the groups" do
      show_home
      expect(json_response.dig("home", "capabilities", "groups").flat_map { |group| group["capabilities"] }
        .pluck("name")).not_to include("Ruby")
    end

    it "returns the domains" do
      show_home
      expect(json_response.dig("home", "capabilities", "domains").pluck("label")).to eq(["Banking & card integrations"])
    end

    it "returns the ticker by ticker position, preferring the ticker label" do
      show_home
      expect(json_response.dig("home", "capabilities", "ticker").pluck("label", "position"))
        .to eq([["Ruby", 1], ["React", 2]])
    end

    context "without featured case studies" do
      let(:seed_home_page) do
        seeded_sections.each { |section| create(section) }
        create(:case_study, slug: "ai-tooling")
      end

      it "returns an empty selected work list" do
        show_home
        expect(json_response.dig("home", "selected_work", "case_studies")).to eq([])
      end
    end

    shared_examples "a home page with a missing section" do
      it "returns not found" do
        show_home
        expect(response).to have_http_status(:not_found)
      end

      it "matches the error contract" do
        show_home
        expect(json_response).to match_contract("api/v1/error")
      end

      it "names the missing section" do
        show_home
        expect(json_response["errors"].pluck("message")).to eq(["#{missing_section} has not been seeded"])
      end
    end

    context "without the hero section seeded" do
      let(:seeded_sections) { %i[selected_work_section capabilities_section] }
      let(:missing_section) { "Hero section" }

      it_behaves_like "a home page with a missing section"
    end

    context "without the selected work section seeded" do
      let(:seeded_sections) { %i[hero_section capabilities_section] }
      let(:missing_section) { "Selected work section" }

      it_behaves_like "a home page with a missing section"
    end

    context "without the capabilities section seeded" do
      let(:seeded_sections) { %i[hero_section selected_work_section] }
      let(:missing_section) { "Capabilities section" }

      it_behaves_like "a home page with a missing section"
    end
  end
end
