module Pages
  class WorkSerializer
    def as_json(*)
      {
        work: {
          header: Sections::WorkHeaderSerializer.new.as_json,
          case_studies: Sections::CaseStudiesSerializer.new.as_json,
        },
      }
    end
  end
end
