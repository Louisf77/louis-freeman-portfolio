RSpec.describe Pages::BootstrapSerializer do
  subject(:serializer) { described_class.new(page:, ui_strings:) }

  let(:page) { :work }
  let(:ui_strings) { { retry: "Retry" } }

  describe "#initialize" do
    context "with an unknown page" do
      let(:page) { :blog }

      it "raises an error naming the page" do
        expect { serializer }.to raise_error(ArgumentError, /Unknown page :blog/)
      end
    end
  end

  describe "#as_json" do
    before do
      create(:profile)
      create(:work_header)
      create(:case_study)
    end

    it "includes the given UI strings" do
      expect(serializer.as_json[:ui]).to eq(ui_strings)
    end

    it "includes the profile and page queries" do
      expect(serializer.as_json[:queries].keys).to eq(%i[profile work])
    end

    it "matches the contract" do
      expect(serializer.as_json.deep_stringify_keys).to match_contract("pages/bootstrap")
    end

    context "with work unpublished" do
      before { CaseStudy.delete_all }

      it "raises the named not-published error" do
        expect { serializer.as_json }.to raise_error(WorkPublication::NotPublishedError)
      end
    end
  end
end
