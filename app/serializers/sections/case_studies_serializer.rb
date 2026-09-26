module Sections
  class CaseStudiesSerializer
    def initialize(case_studies: CaseStudy.ordered)
      @case_studies = case_studies
    end

    def as_json(*)
      case_studies.map { |case_study| Items::CaseStudySerializer.new(case_study:).as_json }
    end

    private

    attr_reader :case_studies
  end
end
