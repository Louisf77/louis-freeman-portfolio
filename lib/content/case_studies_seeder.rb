module Content
  class CaseStudiesSeeder
    DIAGRAM_KEYS = {
      "VizAI.dc.html" => "ai",
      "VizCards.dc.html" => "cards",
      "VizIdentity.dc.html" => "identity",
      "VizTax.dc.html" => "tax",
    }.freeze
    SLUGS = {
      "01" => "card-issuing",
      "02" => "identity-verification",
      "03" => "self-assessment",
      "04" => "ai-tooling",
    }.freeze
    FIELDS = {
      description: "description",
      headline: "headline",
      number: "id",
      role: "role",
      title: "title",
      years_label: "years",
    }.freeze
    OPTIONAL_FIELDS = { metric: ["metric", nil], tags: ["tags", []] }.freeze

    def initialize(case_studies:)
      @case_studies = case_studies
    end

    def call
      rows = case_studies.map { |case_study| attributes(case_study:) }
      CaseStudy.where.not(slug: rows.pluck(:slug)).delete_all
      CaseStudy.update_all("position = -position")
      rows.each.with_index(PositionedRows::FIRST_POSITION) do |row, position|
        CaseStudy.find_or_initialize_by(slug: row.fetch(:slug)).update!(**row, position:)
      end
    end

    private

    attr_reader :case_studies

    def attributes(case_study:)
      number = case_study.fetch("id")
      Fields.map(source: case_study, required: FIELDS, optional: OPTIONAL_FIELDS).merge(
        diagram_key: diagram_key(diagram: case_study.fetch("diagram")),
        featured: true,
        slug: slug(number:),
      )
    end

    def diagram_key(diagram:)
      DIAGRAM_KEYS.fetch(diagram) { raise UnknownContentError, "Case study diagram #{diagram} has no diagram key" }
    end

    def slug(number:)
      SLUGS.fetch(number) { raise UnknownContentError, "Case study #{number} has no slug" }
    end
  end
end
