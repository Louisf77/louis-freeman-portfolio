module Pages
  class AboutSerializer
    def as_json(*)
      {
        about: {
          intro: Sections::AboutIntroSerializer.new.as_json,
          conversation: Sections::ConversationSerializer.new.as_json,
          hobbies: Sections::HobbiesSerializer.new.as_json,
          timeline: Sections::TimelineSerializer.new.as_json,
        },
      }
    end
  end
end
