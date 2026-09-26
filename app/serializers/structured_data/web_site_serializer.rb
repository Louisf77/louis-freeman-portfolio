module StructuredData
  class WebSiteSerializer
    def initialize(url:, profile: Profile.current)
      @profile = profile
      @url = url
    end

    def as_json(*)
      { "@type": "WebSite", name: profile.name, url: }
    end

    private

    attr_reader :profile, :url
  end
end
