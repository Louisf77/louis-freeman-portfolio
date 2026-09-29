RSpec.describe WorkPublication do
  subject(:work_publication) { described_class.new }

  describe "#published?" do
    context "without case studies" do
      it { is_expected.not_to be_published }
    end

    context "with a case study" do
      before { create(:case_study) }

      it { is_expected.to be_published }
    end

    context "with only an unfeatured case study" do
      before { create(:case_study, featured: false) }

      it { is_expected.to be_published }
    end
  end

  describe "#ensure_published!" do
    context "without case studies" do
      it "raises the named not-published error" do
        expect { work_publication.ensure_published! }
          .to raise_error(described_class::NotPublishedError, "Work has not been published")
      end
    end

    context "with a case study" do
      before { create(:case_study) }

      it "does not raise" do
        expect { work_publication.ensure_published! }.not_to raise_error
      end
    end
  end
end
