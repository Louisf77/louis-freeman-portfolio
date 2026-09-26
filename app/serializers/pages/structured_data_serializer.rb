module Pages
  class StructuredDataSerializer
    SCHEMA_CONTEXT = "https://schema.org".freeze
    WEB_SITE_PAGE = :home

    def initialize(page:, url:, profile: Profile.current)
      @page = page
      @profile = profile
      @url = url
    end

    def as_json(*)
      { "@context": SCHEMA_CONTEXT, "@graph": graph }
    end

    private

    attr_reader :page, :profile, :url

    def graph
      nodes = [StructuredData::PersonSerializer.new(profile:, url:).as_json]
      return nodes unless page == WEB_SITE_PAGE

      nodes + [StructuredData::WebSiteSerializer.new(profile:, url:).as_json]
    end
  end
end
