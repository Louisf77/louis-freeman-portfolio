RSpec.describe CaseStudy do
  it_behaves_like "a positioned item"
  it_behaves_like "a record requiring",
                  :slug, :number, :title, :years_label, :role, :diagram_key, :headline, :description

  describe ".featured" do
    let(:featured_case_study) { create(:case_study, :featured) }
    let(:unfeatured_case_study) { create(:case_study) }

    it "returns only featured case studies" do
      featured_case_study
      unfeatured_case_study
      expect(described_class.featured).to eq([featured_case_study])
    end
  end

  describe "validations" do
    subject(:case_study) { build(:case_study, diagram_key:, slug:) }

    let(:diagram_key) { "cards" }
    let(:slug) { "card-issuing" }

    CaseStudy::DIAGRAM_KEYS.each do |key|
      context "with the #{key} diagram" do
        let(:diagram_key) { key }

        it { is_expected.to be_valid }
      end
    end

    context "with an unknown diagram" do
      let(:diagram_key) { "VizCards.dc.html" }

      it { is_expected.not_to be_valid }
    end

    context "with a slug already taken" do
      before { create(:case_study, slug:) }

      it { is_expected.not_to be_valid }
    end
  end
end
