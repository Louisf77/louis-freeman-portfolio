module Content
  class CapabilitiesSeeder
    TICKER_NAMES = {
      "AWS" => "AWS (SQS, S3)",
      "Claude" => "Claude Code",
      "Rails" => "Ruby on Rails",
      "React" => "React 18",
      "Tailwind" => "Tailwind CSS",
    }.freeze
    UNGROUPED_TICKER_NAMES = %w[Ruby].freeze

    def initialize(groups:, ticker:)
      @groups = groups
      @ticker = ticker
    end

    def call
      Capability.update_all(in_ticker: false, ticker_label: nil, ticker_position: nil)
      seed_groups
      seed_ticker
      Capability.where(capability_group: nil, in_ticker: false).delete_all
    end

    private

    attr_reader :groups, :ticker

    def seed_groups
      remove_stale_group_capabilities
      group_ids = PositionedRows.replace(
        scope: CapabilityGroup.all,
        rows: groups.map { |group| { title: group.fetch("title") } },
      )
      groups.zip(group_ids).each do |group, group_id|
        seed_items(capability_group_id: group_id, names: group.fetch("items"))
      end
    end

    def remove_stale_group_capabilities
      stale_groups = CapabilityGroup.where(position: (groups.size + PositionedRows::FIRST_POSITION)..)
      Capability.where(capability_group: stale_groups).delete_all
    end

    def seed_items(capability_group_id:, names:)
      PositionedRows.replace(
        scope: Capability.where(capability_group_id:),
        rows: names.map { |name| { name: } },
      )
    end

    def seed_ticker
      ticker.each.with_index(PositionedRows::FIRST_POSITION) do |label, ticker_position|
        name = TICKER_NAMES.fetch(label, label)
        ticker_capability(name:).update!(
          in_ticker: true,
          ticker_label: (label unless label == name),
          ticker_position:,
        )
      end
    end

    def ticker_capability(name:)
      grouped = Capability.where.not(capability_group: nil).find_by(name:)
      return grouped if grouped
      return Capability.find_or_initialize_by(capability_group: nil, name:) if UNGROUPED_TICKER_NAMES.include?(name)

      raise UnknownContentError, "Stack ticker entry #{name} matches no capability"
    end
  end
end
