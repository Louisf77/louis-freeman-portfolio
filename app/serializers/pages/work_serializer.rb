module Pages
  class WorkSerializer
    def initialize(work_publication: WorkPublication.new)
      @work_publication = work_publication
    end

    def as_json(*)
      work_publication.ensure_published!

      {
        work: {
          header: Sections::WorkHeaderSerializer.new.as_json,
          case_studies: Sections::CaseStudiesSerializer.new.as_json,
        },
      }
    end

    private

    attr_reader :work_publication
  end
end
