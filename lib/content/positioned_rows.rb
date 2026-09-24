module Content
  module PositionedRows
    FIRST_POSITION = 1

    def self.replace(scope:, rows:)
      kept_ids = rows.each.with_index(FIRST_POSITION).map do |attributes, position|
        record = scope.find_or_initialize_by(position:)
        record.update!(attributes)
        record.id
      end
      scope.where.not(id: kept_ids).delete_all
      kept_ids
    end
  end
end
