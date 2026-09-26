module Items
  class ExperienceSerializer
    ATTRIBUTES = %i[
      id company role dates_label year_label duration_label summary highlights tags watermark education position
    ].freeze

    def initialize(experience:)
      @experience = experience
    end

    def as_json(*)
      experience.slice(*ATTRIBUTES).symbolize_keys.merge(subs:)
    end

    private

    attr_reader :experience

    def subs
      experience.subs.map { |sub| { date_label: sub.fetch("date_label"), label: sub.fetch("label") } }
    end
  end
end
