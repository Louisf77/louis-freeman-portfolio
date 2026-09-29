RSpec.describe PublicPages do
  subject(:public_pages) { described_class.new(work_publication:) }

  let(:work_publication) { instance_double(WorkPublication, published?: published) }

  describe "#paths" do
    context "with work published" do
      let(:published) { true }

      it "lists Home, Work and About" do
        expect(public_pages.paths).to eq(%w[/ /work /about])
      end
    end

    context "with work unpublished" do
      let(:published) { false }

      it "leaves Work out" do
        expect(public_pages.paths).to eq(%w[/ /about])
      end
    end
  end
end
