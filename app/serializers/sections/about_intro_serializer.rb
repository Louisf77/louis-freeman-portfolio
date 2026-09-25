module Sections
  class AboutIntroSerializer
    def initialize(about_intro: AboutIntro.current)
      @about_intro = about_intro
    end

    def as_json(*)
      { heading: about_intro.heading, subline: about_intro.subline }
    end

    private

    attr_reader :about_intro
  end
end
