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

    def initialize(groups:, ticker:, logger:)
      @groups = groups
      @ticker = ticker
      @logger = logger
    end

    def call
      Capability.update_all(in_ticker: false, ticker_label: nil, ticker_position: nil)
      seed_groups
      seed_ticker
      StaleRows.remove(relation: Capability.ungrouped.outside_ticker, natural_key: [:name], logger:)
    end

    private

    attr_reader :groups, :ticker, :logger

    def seed_groups
      remove_stale_group_capabilities
      capability_groups = PositionedRows.replace(
        scope: CapabilityGroup.all,
        rows: groups.map { |group| { title: group.fetch("title") } },
        logger:,
      )
      groups.zip(capability_groups).each do |group, capability_group|
        seed_items(capability_group:, names: group.fetch("items"))
      end
    end

    def remove_stale_group_capabilities
      StaleRows.remove(
        relation: Capability.belonging_to_groups(CapabilityGroup.positioned_after(groups.size)),
        natural_key: %i[capability_group_id position],
        logger:,
      )
    end

    def seed_items(capability_group:, names:)
      PositionedRows.replace(
        scope: capability_group.capabilities,
        rows: names.map { |name| { name: } },
        logger:,
        natural_key: %i[capability_group_id position],
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
      grouped = Capability.grouped.find_by(name:)
      return grouped if grouped
      return Capability.ungrouped.find_or_initialize_by(name:) if UNGROUPED_TICKER_NAMES.include?(name)

      raise UnknownContentError, "Stack ticker entry #{name} matches no capability"
    end
  end
end
