module Sections
  class SelectedWorkSerializer
    def initialize(selected_work_section: SelectedWorkSection.current, case_studies: CaseStudy.featured.ordered)
      @selected_work_section = selected_work_section
      @case_studies = case_studies
    end

    def as_json(*)
      {
        intro: selected_work_section.intro,
        case_studies: CaseStudiesSerializer.new(case_studies:).as_json,
      }
    end

    private

    attr_reader :selected_work_section, :case_studies
  end
end
