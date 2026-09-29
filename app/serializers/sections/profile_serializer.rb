module Sections
  class ProfileSerializer
    ATTRIBUTES = %i[name role location email linkedin_url github_url footer_blurb].freeze

    def initialize(profile: Profile.current, work_publication: WorkPublication.new)
      @profile = profile
      @work_publication = work_publication
    end

    def as_json(*)
      profile.slice(*ATTRIBUTES).symbolize_keys.merge(work_published: work_publication.published?)
    end

    private

    attr_reader :profile, :work_publication
  end
end
