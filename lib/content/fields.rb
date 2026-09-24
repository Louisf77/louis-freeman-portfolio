module Content
  module Fields
    def self.map(source:, required: {}, optional: {})
      required.transform_values { |key| source.fetch(key) }
              .merge(optional.to_h { |attribute, (key, default)| [attribute, source.fetch(key) { default.dup }] })
    end
  end
end
