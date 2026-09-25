RSpec.describe Capability do
  it_behaves_like "a record requiring", :name

  describe ".ordered" do
    let(:capability_group) { create(:capability_group) }
    let(:second_capability) { create(:capability, capability_group:, position: 2) }
    let(:first_capability) { create(:capability, capability_group:, position: 1) }

    it "returns capabilities by position" do
      second_capability
      first_capability
      expect(described_class.ordered).to eq([first_capability, second_capability])
    end
  end

  describe ".in_ticker" do
    let(:second_in_ticker) { create(:capability, in_ticker: true, ticker_position: 2) }
    let(:first_in_ticker) { create(:capability, in_ticker: true, ticker_position: 1) }
    let(:outside_ticker) { create(:capability) }

    it "returns ticker capabilities by ticker position" do
      outside_ticker
      second_in_ticker
      first_in_ticker
      expect(described_class.in_ticker).to eq([first_in_ticker, second_in_ticker])
    end
  end

  describe "validations" do
    subject(:capability) { build(:capability, capability_group:, in_ticker:, position:, ticker_position:) }

    let(:capability_group) { build(:capability_group) }
    let(:in_ticker) { false }
    let(:position) { 1 }
    let(:ticker_position) { nil }

    context "with a group and a position" do
      it { is_expected.to be_valid }
    end

    context "with a group but without a position" do
      let(:position) { nil }

      it { is_expected.not_to be_valid }
    end

    context "with a position already taken in the same group" do
      let(:capability_group) { create(:capability_group) }

      before { create(:capability, capability_group:, position:) }

      it { is_expected.not_to be_valid }
    end

    context "with a position taken in another group" do
      before { create(:capability, position:) }

      it { is_expected.to be_valid }
    end

    context "when in the ticker with a ticker position" do
      let(:in_ticker) { true }
      let(:ticker_position) { 1 }

      it { is_expected.to be_valid }
    end

    context "when in the ticker without a ticker position" do
      let(:in_ticker) { true }

      it { is_expected.not_to be_valid }
    end

    context "when outside the ticker with a ticker position" do
      let(:ticker_position) { 1 }

      it { is_expected.not_to be_valid }
    end

    context "with a ticker position already taken" do
      let(:in_ticker) { true }
      let(:ticker_position) { 1 }

      before { create(:capability, :in_ticker, ticker_position:) }

      it { is_expected.not_to be_valid }
    end

    context "without a group but in the ticker" do
      let(:capability_group) { nil }
      let(:position) { nil }
      let(:in_ticker) { true }
      let(:ticker_position) { 1 }

      it { is_expected.to be_valid }
    end

    context "without a group and outside the ticker" do
      let(:capability_group) { nil }
      let(:position) { nil }

      it { is_expected.not_to be_valid }
    end
  end
end
