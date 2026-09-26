module StructuredData
  class PersonSerializer
    def initialize(url:, profile: Profile.current)
      @profile = profile
      @url = url
    end

    def as_json(*)
      {
        "@type": "Person",
        address: { "@type": "PostalAddress", addressLocality: profile.location },
        email: profile.email,
        jobTitle: profile.role,
        name: profile.name,
        sameAs: [profile.linkedin_url, profile.github_url],
        url:,
      }
    end

    private

    attr_reader :profile, :url
  end
end
