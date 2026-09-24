module Content
  module PositionedRows
    FIRST_POSITION = 1

    def self.replace(scope:, rows:, logger:, natural_key: [:position])
      kept_records = rows.each.with_index(FIRST_POSITION).map do |attributes, position|
        scope.find_or_initialize_by(position:).tap { |record| record.update!(attributes) }
      end
      StaleRows.remove(relation: scope.excluding(kept_records), natural_key:, logger:)
      kept_records
    end
  end
end
