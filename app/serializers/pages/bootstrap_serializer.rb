module Pages
  class BootstrapSerializer
    PAGE_SERIALIZERS = {
      about: AboutSerializer,
      home: HomeSerializer,
      work: WorkSerializer,
    }.freeze

    def initialize(page:, ui_strings: I18n.t("ui"))
      unless PAGE_SERIALIZERS.key?(page)
        raise ArgumentError, "Unknown page #{page.inspect}; expected one of #{PAGE_SERIALIZERS.keys.inspect}"
      end

      @page = page
      @ui_strings = ui_strings
    end

    def as_json(*)
      { ui: ui_strings, queries: }
    end

    private

    attr_reader :page, :ui_strings

    def queries
      {
        profile: ProfileSerializer.new.as_json,
        page => PAGE_SERIALIZERS.fetch(page).new.as_json,
      }
    end
  end
end
