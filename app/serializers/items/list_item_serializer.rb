module Items
  class ListItemSerializer
    ATTRIBUTES = %i[id text position].freeze

    def initialize(item:)
      @item = item
    end

    def as_json(*)
      item.slice(*ATTRIBUTES).symbolize_keys
    end

    private

    attr_reader :item
  end
end
