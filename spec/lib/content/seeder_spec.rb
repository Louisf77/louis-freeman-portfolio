RSpec.describe Content::Seeder do
  subject(:seeder) { described_class.new(content:) }

  let(:content) { JSON.parse(described_class::SOURCE_PATH.read) }
  let(:example_case_studies) do
    %w[one two three].map.with_index(1) do |word, number|
      {
        "id" => format("%02d", number),
        "slug" => "example-project-#{word}",
        "title" => "Example project #{word}",
        "years" => "2025",
        "headline" => "Placeholder headline.",
        "description" => "Placeholder description.",
        "role" => "Lead engineer",
        "tags" => ["Rails"],
        "diagramKey" => CaseStudy::DIAGRAM_KEYS.fetch(number - 1),
        "metric" => nil,
      }
    end
  end

  describe ".from_file" do
    subject(:seeder) { described_class.from_file(path: described_class::SOURCE_PATH) }

    it "seeds the content in the file" do
      seeder.call
      expect(Profile.current.email).to eq("hello@louisfreeman.co.uk")
    end
  end

  describe "#call" do
    context "when run twice" do
      before do
        seeder.call
        described_class.new(content:).call
      end

      {
        Profile => 1,
        HeroSection => 1,
        SelectedWorkSection => 1,
        CapabilitiesSection => 1,
        WorkHeader => 1,
        AboutIntro => 1,
        HeroGreeting => 4,
        Experience => 6,
        CaseStudy => 0,
        CapabilityGroup => 4,
        Capability => 26,
        Domain => 8,
        ChatMessage => 3,
        Hobby => 7,
        EarlierRole => 2,
      }.each do |model, expected_count|
        it "leaves #{expected_count} #{model.name.pluralize(expected_count)}" do
          expect(model.count).to eq(expected_count)
        end
      end

      it "puts 12 capabilities in the ticker" do
        expect(Capability.in_ticker.count).to eq(12)
      end
    end

    context "when seeded" do
      before { seeder.call }

      it "keeps the greeting prefix's trailing space" do
        expect(HeroSection.current.greeting_prefix).to eq("Hi, I'm ")
      end

      it "orders the hero greetings as in the content" do
        expect(HeroGreeting.ordered.pluck(:text)).to eq(content.dig("home", "greetingEndings"))
      end

      it "maps experience length to the duration label" do
        expect(Experience.find_by!(company: "Soho House").duration_label).to eq("2 years, 2 months")
      end

      it "leaves the duration label empty when the content has no length" do
        expect(Experience.find_by!(company: "Hnry").duration_label).to be_nil
      end

      it "maps experience subs with date labels" do
        expect(Experience.find_by!(company: "Hnry").subs.first)
          .to eq("date_label" => "Dec 2025", "label" => "Promoted to Senior Software Engineer")
      end

      it "marks education with its watermark" do
        expect(Experience.find_by!(education: true).watermark).to eq("UON")
      end

      it "defaults missing highlights to an empty list" do
        expect(Experience.find_by!(company: "Academy").highlights).to eq([])
      end

      it "orders the ticker as in the content" do
        expect(Capability.in_ticker.map { |capability| capability.ticker_label || capability.name })
          .to eq(content.dig("home", "stackTicker"))
      end

      it "links a ticker entry to its capability" do
        expect(Capability.find_by!(ticker_label: "Rails").name).to eq("Ruby on Rails")
      end

      it "adds Ruby to the ticker without a group" do
        expect(Capability.find_by!(name: "Ruby").capability_group).to be_nil
      end

      it "orders each group's capabilities as in the content" do
        expect(CapabilityGroup.find_by!(title: "AI").capabilities.ordered.pluck(:name))
          .to eq(content.dig("home", "capabilities", 1, "items"))
      end

      it "maps conversation highlights" do
        expect(ChatMessage.ordered.last.highlights).to eq(["Product Design & Manufacture Engineering"])
      end

      it "seeds every hobby as a cut-out" do
        expect(Hobby.where(photo: true)).to be_empty
      end

      it "points hobbies at png cut-outs" do
        expect(Hobby.find_by!(name: "Football").image_path).to eq("/images/hobbies/football.png")
      end
    end

    context "with rows already stored" do
      before do
        create(:profile, name: "Old name")
        create(:hero_greeting, position: 5, text: "a stale greeting.")
        seeder.call
      end

      it "updates the singleton in place" do
        expect(Profile.current.name).to eq("Louis Freeman")
      end

      it "removes items the content no longer has" do
        expect(HeroGreeting.pluck(:text)).not_to include("a stale greeting.")
      end
    end

    context "with a ticker entry that has moved" do
      before do
        seeder.call
        content["home"]["stackTicker"] = content.dig("home", "stackTicker").rotate
        described_class.new(content:).call
      end

      it "reorders the ticker" do
        expect(Capability.in_ticker.first.name).to eq("TypeScript")
      end
    end

    context "with case studies in the content" do
      before do
        content["work"]["caseStudies"] = example_case_studies
        seeder.call
      end

      it "keeps the case studies' slugs in order" do
        expect(CaseStudy.ordered.pluck(:slug)).to eq(%w[example-project-one example-project-two example-project-three])
      end

      it "stores each case study's diagram key" do
        expect(CaseStudy.ordered.pluck(:diagram_key)).to eq(%w[cards identity tax])
      end

      it "maps the case study id to its number" do
        expect(CaseStudy.find_by!(slug: "example-project-three").number).to eq("03")
      end

      it "features every case study" do
        expect(CaseStudy.featured.count).to eq(3)
      end
    end

    context "with case studies that have moved" do
      before do
        content["work"]["caseStudies"] = example_case_studies
        seeder.call
        content["work"]["caseStudies"].reverse!
        described_class.new(content:).call
      end

      it "reorders the case studies" do
        expect(CaseStudy.ordered.pluck(:slug))
          .to eq(%w[example-project-three example-project-two example-project-one])
      end
    end

    context "with a case study removed from the content" do
      let(:logger) { instance_double(Logger, info: nil) }

      before do
        content["work"]["caseStudies"] = example_case_studies
        seeder.call
        content["work"]["caseStudies"].pop
        described_class.new(content:, logger:).call
      end

      it "removes the case study" do
        expect(CaseStudy.pluck(:slug)).not_to include("example-project-three")
      end

      it "logs the removed case study by slug" do
        expect(logger).to have_received(:info).with('Content::Seeder: removing CaseStudy slug="example-project-three"')
      end
    end

    context "with a capability group removed from the content" do
      before do
        seeder.call
        content["home"]["capabilities"].shift
        described_class.new(content:).call
      end

      it "removes the group" do
        expect(CapabilityGroup.count).to eq(3)
      end

      it "removes the group's capabilities" do
        expect(Capability.pluck(:name)).not_to include("Line management")
      end
    end

    context "with an ungrouped capability dropped from the ticker" do
      before do
        seeder.call
        content["home"]["stackTicker"].delete("Ruby")
        described_class.new(content:).call
      end

      it "removes the capability" do
        expect(Capability.pluck(:name)).not_to include("Ruby")
      end
    end

    context "with a stale item stored" do
      subject(:seeder) { described_class.new(content:, logger:) }

      let(:logger) { instance_double(Logger, info: nil) }

      before do
        create(:hero_greeting, position: 5, text: "a stale greeting.")
        seeder.call
      end

      it "logs the removed item by position" do
        expect(logger).to have_received(:info).with("Content::Seeder: removing HeroGreeting position=5")
      end
    end

    context "with an unknown diagram key" do
      before do
        content["work"]["caseStudies"] = example_case_studies
        content["work"]["caseStudies"].first["diagramKey"] = "unknown"
      end

      it "raises naming the invalid diagram key" do
        expect { seeder.call }.to raise_error(ActiveRecord::RecordInvalid, /Diagram key/)
      end

      it "stores nothing" do
        expect { suppress(ActiveRecord::RecordInvalid) { seeder.call } }.not_to change(Profile, :count)
      end
    end

    context "with a ticker entry that matches no capability" do
      before { content["home"]["capabilities"].last["items"].delete("Kubernetes") }

      it "raises naming the ticker entry" do
        expect { seeder.call }.to raise_error(Content::UnknownContentError, /Kubernetes/)
      end
    end
  end
end
