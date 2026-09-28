RSpec.describe "Analytics", :umami do
  let(:profile) { Profile.current }
  let(:case_studies) { CaseStudy.ordered }
  let(:featured_case_study) { CaseStudy.featured.ordered.third }

  before do
    seed_content
    stub_umami_script
  end

  context "when clicking the nav email link on Home" do
    before do
      visit root_path
      page.assert_selector(:css, "h1#hero-title")
      within("nav") do
        click_on I18n.t("ui.contact")
        page.execute_script("document.addEventListener('click', (event) => event.preventDefault())")
        click_on I18n.t("ui.contact_email")
      end
    end

    it "tracks a nav email contact click on the home page" do
      expect(umami_events("contact_click")).to eq([{ "location" => "nav", "method" => "email", "page_type" => "home" }])
    end
  end

  context "when clicking the footer GitHub link on About" do
    before do
      visit about_path
      page.assert_selector(:css, "h1#hi-title")
      within("footer") { click_on I18n.t("ui.contact_github") }
    end

    it "tracks a footer GitHub contact click on the about page" do
      expect(umami_events("contact_click"))
        .to eq([{ "location" => "footer", "method" => "github", "page_type" => "about" }])
    end
  end

  context "when clicking the nav LinkedIn link on Work" do
    before do
      visit work_path
      page.assert_selector(:css, "h1#work-heading")
      within("nav") do
        click_on I18n.t("ui.contact")
        click_on I18n.t("ui.contact_linkedin")
      end
    end

    it "tracks a nav LinkedIn contact click on the work page" do
      expect(umami_events("contact_click"))
        .to eq([{ "location" => "nav", "method" => "linkedin", "page_type" => "work" }])
    end
  end

  shared_examples "a single case study view from the home link" do
    it "tracks only the home link view, not the cards scrolled past or landed on" do
      wait_past_case_study_dwell
      expect(umami_events("case_study_view"))
        .to eq([{ "case_study_slug" => featured_case_study.slug, "source" => "home_link" }])
    end
  end

  context "when reading the first case study from the Home accordion" do
    let(:featured_case_study) { CaseStudy.featured.ordered.first }

    before { read_case_study_from_home_accordion }

    it_behaves_like "a single case study view from the home link"
  end

  context "when reading the third case study from the Home accordion" do
    before { read_case_study_from_home_accordion }

    it_behaves_like "a single case study view from the home link"
  end

  context "when dwelling on another case study after landing from Home" do
    let(:other_case_study) { case_studies.last }
    let(:expected_views) do
      [
        { "case_study_slug" => featured_case_study.slug, "source" => "home_link" },
        { "case_study_slug" => other_case_study.slug, "source" => "work_scroll" },
      ]
    end

    before do
      read_case_study_from_home_accordion
      page.scroll_to(find("article##{other_case_study.slug}"))
      wait_for_case_study_view(slug: other_case_study.slug)
    end

    it "tracks the home link view, then the other case study" do
      expect(umami_events("case_study_view")).to eq(expected_views)
    end
  end

  context "when reading a case study from the Home card stack", :compact do
    let(:featured_case_study) { CaseStudy.featured.ordered.first }

    before do
      visit root_path
      page.assert_selector(:css, "h1#hero-title")
      find("#work article", text: featured_case_study.title)
        .find_link(I18n.t("ui.selected_work_read_case_study"))
        .trigger("click")
      page.assert_selector(:css, "article##{featured_case_study.slug}")
    end

    it_behaves_like "a single case study view from the home link"
  end

  context "when scrolling through the Work page" do
    let(:work_scroll_slugs) do
      umami_events("case_study_view").select { |data| data["source"] == "work_scroll" }.pluck("case_study_slug")
    end

    before do
      visit work_path
      page.assert_selector(:css, "h1#work-heading")
      case_studies.each do |case_study|
        page.scroll_to(find("article##{case_study.slug}"))
        wait_for_case_study_view(slug: case_study.slug)
      end
      page.scroll_to(:top)
      wait_past_case_study_dwell
    end

    it "tracks every case study once" do
      expect(work_scroll_slugs).to eq(case_studies.map(&:slug))
    end
  end

  context "when opening the privacy note" do
    before do
      visit about_path
      page.assert_selector(:css, "h1#hi-title")
      within("footer") { click_on I18n.t("ui.privacy_link") }
    end

    it "describes what Umami records" do
      expect(page).to have_css("dialog[open]", text: I18n.t("ui.privacy_body"))
    end
  end

  context "when browsing and contacting" do
    before do
      visit root_path
      page.assert_selector(:css, "h1#hero-title")
      within("footer") { click_on I18n.t("ui.contact_linkedin") }
    end

    it "sets no cookies other than the Rails session" do
      session_key = Rails.application.config.session_options.fetch(:key)
      expect(page.driver.cookies.keys - [session_key]).to be_empty
    end

    it "stores nothing in localStorage" do
      expect(page.evaluate_script("window.localStorage.length")).to eq(0)
    end
  end

  def read_case_study_from_home_accordion
    visit root_path
    within("#work") do
      click_on featured_case_study.title
      find("#work-panel-#{featured_case_study.slug}").click_on I18n.t("ui.selected_work_read_case_study")
    end
    page.assert_selector(:css, "article##{featured_case_study.slug}")
  end
end
