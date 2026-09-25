module Sections
  class ProfileSerializer
    ATTRIBUTES = %i[name role location email linkedin_url github_url footer_blurb].freeze

    def initialize(profile: Profile.current)
      @profile = profile
    end

    def as_json(*)
      profile.slice(*ATTRIBUTES).symbolize_keys
    end

    private

    attr_reader :profile
  end
end
