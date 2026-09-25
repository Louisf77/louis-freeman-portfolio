module Sections
  class CapabilitiesSerializer
    def initialize(
      capabilities_section: CapabilitiesSection.current,
      groups: CapabilityGroup.ordered.eager_load(:capabilities).merge(Capability.ordered),
      domains: Domain.ordered,
      ticker_capabilities: Capability.in_ticker
    )
      @capabilities_section = capabilities_section
      @groups = groups
      @domains = domains
      @ticker_capabilities = ticker_capabilities
    end

    def as_json(*)
      {
        title: capabilities_section.title,
        intro: capabilities_section.intro,
        groups: groups.map { |group| group_json(group:) },
        domains: domains.map { |domain| domain.slice(:id, :label, :position).symbolize_keys },
        ticker: ticker_capabilities.map { |capability| ticker_item_json(capability:) },
      }
    end

    private

    attr_reader :capabilities_section, :groups, :domains, :ticker_capabilities

    def group_json(group:)
      {
        id: group.id,
        title: group.title,
        position: group.position,
        capabilities: group.capabilities.map { |capability| capability.slice(:id, :name, :position).symbolize_keys },
      }
    end

    def ticker_item_json(capability:)
      {
        id: capability.id,
        label: capability.ticker_label.presence || capability.name,
        position: capability.ticker_position,
      }
    end
  end
end
