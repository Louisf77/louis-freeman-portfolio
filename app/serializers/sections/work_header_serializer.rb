module Sections
  class WorkHeaderSerializer
    def initialize(work_header: WorkHeader.current)
      @work_header = work_header
    end

    def as_json(*)
      { intro: work_header.intro }
    end

    private

    attr_reader :work_header
  end
end
