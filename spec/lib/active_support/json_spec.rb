require "active_support"
require "active_support/json"

RSpec.describe ActiveSupport::JSON do
  describe ".decode" do
    subject(:decoded) { described_class.decode(described_class.encode(payload)) }

    context "with an array" do
      let(:payload) { [1, "two", nil] }

      it "round-trips the array" do
        expect(decoded).to eq(payload)
      end
    end

    context "with an object" do
      let(:payload) { { "name" => "Louis", "tags" => %w[rails react] } }

      it "round-trips the object" do
        expect(decoded).to eq(payload)
      end
    end
  end
end
