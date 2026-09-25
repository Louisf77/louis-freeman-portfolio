module Pages
  class ProfileSerializer
    def as_json(*)
      { profile: Sections::ProfileSerializer.new.as_json }
    end
  end
end
