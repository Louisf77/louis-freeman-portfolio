class WorkPublication
  class NotPublishedError < StandardError
    MESSAGE = "Work has not been published".freeze

    def initialize(message = MESSAGE)
      super
    end
  end

  def initialize(case_studies: CaseStudy.all)
    @case_studies = case_studies
  end

  def published?
    case_studies.exists?
  end

  def ensure_published!
    return if published?

    raise NotPublishedError
  end

  private

  attr_reader :case_studies
end
