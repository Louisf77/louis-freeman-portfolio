require "rails_helper"

RSpec.describe Pages::StructuredDataSerializer do
  subject(:serializer) { described_class.new(page:, profile:, url:) }

  let(:profile) { build(:profile) }
  let(:url) { "https://louisfreeman.co.uk/" }

  describe "#as_json" do
    context "when on the home page" do
      let(:page) { :home }

      it "describes the person and the website" do
        expect(serializer.as_json[:@graph].pluck(:@type)).to eq(%w[Person WebSite])
      end
    end

    context "when on another page" do
      let(:page) { :about }

      it "describes only the person" do
        expect(serializer.as_json[:@graph].pluck(:@type)).to eq(%w[Person])
      end
    end

    context "with any page" do
      let(:page) { :work }

      it "uses the schema.org vocabulary" do
        expect(serializer.as_json[:@context]).to eq("https://schema.org")
      end
    end
  end
end
