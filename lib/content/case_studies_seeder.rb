module Content
  class CaseStudiesSeeder
    FIELDS = {
      description: "description",
      diagram_key: "diagramKey",
      headline: "headline",
      number: "id",
      role: "role",
      slug: "slug",
      title: "title",
      years_label: "years",
    }.freeze
    OPTIONAL_FIELDS = { metric: ["metric", nil], tags: ["tags", []] }.freeze

    def initialize(case_studies:, logger:)
      @case_studies = case_studies
      @logger = logger
    end

    def call
      rows = case_studies.map { |case_study| attributes(case_study:) }
      StaleRows.remove(relation: CaseStudy.without_slugs(rows.pluck(:slug)), natural_key: [:slug], logger:)
      CaseStudy.update_all("position = -position")
      rows.each.with_index(PositionedRows::FIRST_POSITION) do |row, position|
        CaseStudy.find_or_initialize_by(slug: row.fetch(:slug)).update!(**row, position:)
      end
    end

    private

    attr_reader :case_studies, :logger

    def attributes(case_study:)
      Fields.map(source: case_study, required: FIELDS, optional: OPTIONAL_FIELDS).merge(featured: true)
    end
  end
end
