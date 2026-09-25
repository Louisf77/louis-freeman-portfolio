module Pages
  class HomeSerializer
    def as_json(*)
      {
        home: {
          hero: Sections::HeroSerializer.new.as_json,
          experience: Sections::ExperienceSerializer.new.as_json,
          selected_work: Sections::SelectedWorkSerializer.new.as_json,
          capabilities: Sections::CapabilitiesSerializer.new.as_json,
        },
      }
    end
  end
end
