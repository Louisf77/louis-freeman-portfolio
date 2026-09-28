RSpec.describe "Work" do
  let(:case_studies) { CaseStudy.ordered }

  context "with seeded content" do
    before { seed_content }

    context "when loading the page" do
      before do
        visit work_path
        page.assert_selector(:css, "h1#work-heading")
      end

      it "renders the header intro from the bootstrap" do
        expect(page).to have_css("section[aria-labelledby='work-heading']", text: WorkHeader.current.intro)
      end

      it "renders a card per case study" do
        expect(page).to have_css("article[id]", count: case_studies.count)
      end

      it "orders the cards by position" do
        expect(all("article h2").map(&:text)).to eq(case_studies.map(&:title))
      end

      it "gives every card its slug as an anchor" do
        expect(all("article").pluck(:id)).to match_array(case_studies.map(&:slug))
      end

      it "hides the metric of case studies without one" do
        expect(page).to have_no_text(I18n.t("ui.case_study_metric"))
      end

      it "hydrates from the bootstrap without calling the API" do
        expect(api_requests).to be_empty
      end
    end

    context "when opening a case study anchor directly" do
      let(:case_study) { case_studies.third }

      before do
        visit work_path(anchor: case_study.slug)
        page.assert_selector(:css, "article##{case_study.slug}")
      end

      it "scrolls the case study into view" do
        expect(find("##{case_study.slug}")).to be_in_viewport
      end
    end
  end

  context "without the work header seeded" do
    let(:unavailable_heading) { Nokogiri::HTML(Rails.public_path.join("503.html").read).at_css("h1").text }

    before do
      seed_content
      WorkHeader.delete_all
      visit work_path
    end

    it "shows the unavailable page" do
      expect(page).to have_css("h1", text: unavailable_heading)
    end

    it "responds 503 so crawlers retry" do
      expect(page.status_code).to eq(503)
    end
  end
end
