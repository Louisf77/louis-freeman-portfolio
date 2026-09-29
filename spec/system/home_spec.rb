RSpec.describe "Home" do
  let(:hero) { HeroSection.current }
  let(:experiences) { Experience.ordered }
  let(:featured_case_study) { CaseStudy.featured.ordered.last }

  before do
    seed_content
    publish_work
  end

  context "when loading the page" do
    before do
      visit root_path
      page.assert_selector(:css, "h1#hero-title")
    end

    it "renders the hero tagline from the bootstrap" do
      expect(page).to have_css("#hero", text: hero.tagline)
    end

    it "writes the seeded greeting prefix" do
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

  shared_examples "an address-bar jump back to an earlier section" do
    before do
      visit root_path(anchor: "capabilities")
      wait_for_viewport_top(id: "capabilities")
      navigate_from_address_bar(path: root_path(anchor: earlier_section))
    end

    it "lands on the earlier section's own position, not where it sits stuck" do
      expect(find_by_id(earlier_section)).to be_at_the_viewport_top
    end
  end

  context "when the address-bar hash moves up to experience", :smooth_scrolling do
    let(:earlier_section) { "experience" }

    it_behaves_like "an address-bar jump back to an earlier section"
  end

  context "when the address-bar hash moves up to selected work", :smooth_scrolling do
    let(:earlier_section) { "work" }

    it_behaves_like "an address-bar jump back to an earlier section"
  end

  context "when the address-bar hash moves up to experience on a phone", :compact, :smooth_scrolling do
    let(:earlier_section) { "experience" }

    it_behaves_like "an address-bar jump back to an earlier section"
  end

  context "when the address-bar hash moves up to selected work on a phone", :compact, :smooth_scrolling do
    let(:earlier_section) { "work" }

    it_behaves_like "an address-bar jump back to an earlier section"
  end

  shared_examples "a focused control brought out from under the next card" do
    before do
      visit root_path
      page.assert_selector(:css, "h1#hero-title")
      page.scroll_to(find_by_id(covering_section_id), align: :top)
      control.execute_script("this.focus()")
    end

    it "scrolls the focused control into sight" do
      expect(control).to be_uncovered
    end
  end

  context "when focus reaches a control under a later card on a phone", :compact, :smooth_scrolling do
    context "with View all work under the Capabilities card" do
      let(:covering_section_id) { "capabilities" }
      let(:control) { find_link(I18n.t("ui.selected_work_view_all")) }

      it_behaves_like "a focused control brought out from under the next card"
    end

    context "with Next role under the Selected work card" do
      let(:covering_section_id) { "work" }
      let(:control) { find_button(I18n.t("ui.experience_next")) }

      it_behaves_like "a focused control brought out from under the next card"
    end

    context "with Previous role under the Selected work card" do
      let(:covering_section_id) { "work" }
      let(:control) do
        find_button(I18n.t("ui.experience_next")).trigger("click")
        find_button(I18n.t("ui.experience_previous"))
      end

      it_behaves_like "a focused control brought out from under the next card"
    end

    context "when tabbing from the top to View all work" do
      let(:last_stop_text) { I18n.t("ui.selected_work_view_all") }
      let(:covered_stops) { covered_tab_stops_until(text: last_stop_text) }

      before do
        visit root_path
        page.assert_selector(:css, "#work article")
      end

      it "keeps every focused control out from under a later card" do
        expect(covered_stops).to be_empty
      end
    end
  end

  context "with a compact screen", :compact do
    before { visit root_path }

    it "shows the Hnry experience card with its dates" do
      expect(page).to have_css("#experience", text: experiences.first.dates_label)
    end
  end
end
