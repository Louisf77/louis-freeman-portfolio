RSpec.describe I18n do
  describe "ui strings" do
    context "with the case-study figure components" do
      subject(:figure_sources) do
        Rails.root.glob("app/javascript/components/diagrams/*.tsx").map(&:read)
      end

      let(:used_keys) { figure_sources.flat_map { |source| source.scan(/\bt\("(\w+)"/).flatten }.uniq }
      let(:ui_keys) { described_class.t("ui").keys.map(&:to_s) }

      it "reads the figure components" do
        expect(used_keys).not_to be_empty
      end

      it "defines every key the components use" do
        expect(used_keys - ui_keys).to be_empty
      end

      it "only uses literal keys so none can escape this check" do
        expect(figure_sources.join).not_to include("t(`")
      end
    end
  end
end
