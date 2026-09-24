RSpec.shared_examples "a record requiring" do |*attributes|
  let(:factory_name) { described_class.model_name.singular.to_sym }

  attributes.each do |attribute|
    context "without #{attribute}" do
      subject(:record) { build(factory_name, attribute => nil) }

      it { is_expected.not_to be_valid }
    end
  end
end

RSpec.shared_examples "a singleton section" do
  let(:factory_name) { described_class.model_name.singular.to_sym }
  let(:stored_section) { create(factory_name) }

  describe ".current" do
    it "returns the stored row" do
      stored_section
      expect(described_class.current).to eq(stored_section)
    end

    context "without a stored row" do
      it "raises naming the missing section" do
        expect { described_class.current }.to raise_error(ActiveRecord::RecordNotFound, /#{described_class.name}/)
      end
    end
  end

  context "with a row already stored" do
    subject(:second_section) { build(factory_name) }

    before { stored_section }

    it { is_expected.not_to be_valid }

    it "names the duplicate in the error" do
      second_section.validate
      expect(second_section.errors[:base]).to include("#{described_class.model_name.human} already exists")
    end
  end

  context "when updating the stored row" do
    subject(:section) { stored_section }

    it { is_expected.to be_valid }
  end
end

RSpec.shared_examples "a positioned item" do
  let(:factory_name) { described_class.model_name.singular.to_sym }
  let(:second_item) { create(factory_name, position: 2) }
  let(:first_item) { create(factory_name, position: 1) }

  describe ".ordered" do
    it "returns items by position" do
      second_item
      first_item
      expect(described_class.ordered).to eq([first_item, second_item])
    end
  end

  context "without a position" do
    subject(:item) { build(factory_name, position: nil) }

    it { is_expected.not_to be_valid }
  end

  context "with a position already taken" do
    subject(:item) { build(factory_name, position: first_item.position) }

    it { is_expected.not_to be_valid }
  end
end
