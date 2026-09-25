module Items
  class CaseStudySerializer
    ATTRIBUTES = %i[id slug number title years_label headline description role tags diagram_key metric position].freeze

    def initialize(case_study:)
      @case_study = case_study
    end

    def as_json(*)
      case_study.slice(*ATTRIBUTES).symbolize_keys
    end

    private

    attr_reader :case_study
  end
end
