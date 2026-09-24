require "rails_helper"

RSpec.describe CookieConsent do
  subject(:cookie_consent) { described_class.from_cookie(logger:, value:) }

  let(:logger) { instance_double(Logger, warn: nil) }

  let(:value) { { analytics: true, updated_at: "2026-09-24T08:00:00.000Z", version: described_class::VERSION }.to_json }

  describe ".from_cookie" do
    context "with a current choice that grants analytics" do
      it { is_expected.to be_analytics }
    end

    context "with a current choice that denies analytics" do
      let(:value) { { analytics: false, version: described_class::VERSION }.to_json }

      it { is_expected.not_to be_analytics }
    end

    context "with a choice from an older version" do
      let(:value) { { analytics: true, version: described_class::VERSION - 1 }.to_json }

      it { is_expected.not_to be_analytics }
    end

    context "without a cookie" do
      let(:value) { nil }

      it { is_expected.not_to be_analytics }
    end

    context "with a malformed cookie" do
      let(:value) { "not json" }
      let(:expected_log) { /CookieConsent: ignoring malformed cookie \(JSON::ParserError: .+\)/ }

      it { is_expected.not_to be_analytics }

      it "logs the parse error with its class and message" do
        cookie_consent
        expect(logger).to have_received(:warn).with(expected_log)
      end
    end

    context "with a cookie that is not an object" do
      let(:value) { "[true]" }

      it { is_expected.not_to be_analytics }
    end
  end

  describe "#decided?" do
    context "with a current choice" do
      it { is_expected.to be_decided }
    end

    context "without a cookie" do
      let(:value) { nil }

      it { is_expected.not_to be_decided }
    end
  end
end
