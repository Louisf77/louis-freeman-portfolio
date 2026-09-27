RSpec.describe "Home" do
  let(:hero) { HeroSection.current }
  let(:experiences) { Experience.ordered }
  let(:featured_case_study) { CaseStudy.featured.ordered.last }

  before { seed_content }

  context "when loading the page" do
    before do
      visit root_path
      page.assert_selector(:css, "h1#hero-title")
    end

    it "renders the hero tagline from the bootstrap" do
      expect(page).to have_css("#hero", text: hero.tagline)
    end

    it "writes the typed greeting from the seeded endings" do
      expect(page).to have_css("[data-testid='typed-greeting']", text: hero.greeting_prefix.strip)
    end

    it "names every greeting ending in the heading" do
      expect(page).to have_css("h1#hero-title", text: HeroGreeting.ordered.last.text.delete_suffix("."))
    end

    it "hydrates from the bootstrap without calling the API" do
      expect(api_requests).to be_empty
    end
  end

  context "when picking a company in the experience deck" do
    let(:last_experience) { experiences.last }

    before do
      visit root_path
      within("#experience") { click_on last_experience.company }
    end

    it "selects that company's tab" do
      expect(page).to have_css("#experience [role='tab'][aria-selected='true']", text: last_experience.company)
    end

    it "shows that company's card" do
      expect(page).to have_css("#experience [role='tabpanel']", text: last_experience.role)
    end
  end

  context "when reading a case study from the selected work accordion" do
    before do
      visit root_path
      within("#work") do
        click_on featured_case_study.title
        find("#work-panel-#{featured_case_study.slug}").click_on I18n.t("ui.selected_work_read_case_study")
      end
      page.assert_selector(:css, "article##{featured_case_study.slug}")
    end

    it "lands on the case study's anchor on the Work page" do
      expect(page).to have_current_path(/#{Regexp.escape(work_path(anchor: featured_case_study.slug))}\z/, url: true)
    end

    it "scrolls the case study into view" do
      expect(find("##{featured_case_study.slug}")).to be_in_viewport
    end
  end

  context "with a compact screen", :compact do
    before { visit root_path }

    it "shows the Hnry experience card with its dates" do
      expect(page).to have_css("#experience", text: experiences.first.dates_label)
    end
  end
end
