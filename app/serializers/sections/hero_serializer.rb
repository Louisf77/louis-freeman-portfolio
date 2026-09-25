module Sections
  class HeroSerializer
    def initialize(hero_section: HeroSection.current, greetings: HeroGreeting.ordered)
      @hero_section = hero_section
      @greetings = greetings
    end

    def as_json(*)
      {
        greeting_prefix: hero_section.greeting_prefix,
        tagline: hero_section.tagline,
        greetings: greetings.map { |item| Items::ListItemSerializer.new(item:).as_json },
      }
    end

    private

    attr_reader :hero_section, :greetings
  end
end
