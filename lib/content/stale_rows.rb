module Content
  module StaleRows
    def self.remove(relation:, natural_key:, logger:)
      relation.pluck(*natural_key).each do |values|
        key_values = natural_key.size == 1 ? [values] : values
        described_key = natural_key.zip(key_values).map { |column, value| "#{column}=#{value.inspect}" }.join(" ")
        logger.info("Content::Seeder: removing #{relation.model.name} #{described_key}")
      end
      relation.delete_all
    end
  end
end
