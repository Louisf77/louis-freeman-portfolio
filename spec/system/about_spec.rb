RSpec.describe "About" do
  let(:hnry) { Experience.find_by!(company: "Hnry") }

  before do
    seed_content
    visit about_path
    page.assert_selector(:css, "h1#hi-title")
  end

  it "renders the intro heading from the bootstrap" do
    expect(page).to have_css("h1#hi-title", text: AboutIntro.current.heading, normalize_ws: true)
  end

  context "when scrolling through the conversation" do
    before { page.scroll_to(find_by_id("hi"), align: :bottom) }

    it "reveals the last question" do
      expect(page).to have_css("#hi li", text: ChatMessage.ordered.last.question)
    end

    it "reveals the last answer" do
      expect(page).to have_css("#hi li", text: ChatMessage.ordered.last.answer)
    end

    it "marks the highlighted phrases in the answers" do
      expect(page).to have_css("#hi mark", text: ChatMessage.ordered.last.highlights.first)
    end
  end

  it "shows a card per hobby" do
    expect(page).to have_css("#out li", text: Hobby.ordered.last.name)
  end

  it "lists the earlier roles" do
    expect(page).to have_css("#out", text: EarlierRole.ordered.first.text)
  end

  it "shows the timeline with the most recent role first" do
    expect(page).to have_css("#experience-list li:first-child", text: hnry.company)
  end

  it "hydrates from the bootstrap without calling the API" do
    expect(api_requests).to be_empty
  end

  context "when expanding the timeline" do
    before { find("button[aria-controls='experience-list'][aria-expanded='false']").click }

    it "shows every entry" do
      expect(page).to have_css("#experience-list li", count: Experience.count)
    end
  end
end
