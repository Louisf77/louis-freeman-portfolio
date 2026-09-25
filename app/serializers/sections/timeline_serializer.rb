module Sections
  class TimelineSerializer
    def initialize(experiences: Experience.ordered)
      @experiences = experiences
    end

    def as_json(*)
      experiences.map { |experience| Items::ExperienceSerializer.new(experience:).as_json }
    end

    private

    attr_reader :experiences
  end
end
