module Sections
  class ExperienceSerializer
    def initialize(experiences: Experience.ordered)
      @experiences = experiences
    end

    def as_json(*)
      { experiences: experiences.map { |experience| Items::ExperienceSerializer.new(experience:).as_json } }
    end

    private

    attr_reader :experiences
  end
end
