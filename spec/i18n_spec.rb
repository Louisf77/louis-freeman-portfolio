RSpec.describe I18n do
  describe "ui strings" do
    context "with the case-study diagram components" do
      subject(:diagram_sources) do
        Rails.root.glob("app/javascript/components/diagrams/*Diagram.tsx").map(&:read)
      end

      let(:used_keys) { diagram_sources.flat_map { |source| source.scan(/"(diagram_\w+)"/).flatten }.uniq }
      let(:ui_keys) { described_class.t("ui").keys.map(&:to_s) }

      it "reads the diagram components" do
        expect(used_keys).not_to be_empty
      end

      it "defines every diagram key the components use" do
        expect(used_keys - ui_keys).to be_empty
      end

      it "only uses literal keys so none can escape this check" do
        expect(diagram_sources.join).not_to include("`diagram_")
      end
    end
  end
end
