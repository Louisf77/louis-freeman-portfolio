require "json_schemer"

CONTRACTS_ROOT = Rails.root.join("spec/contracts")

RSpec::Matchers.define :match_contract do |contract_name|
  match do |body|
    schema = JSONSchemer.schema(CONTRACTS_ROOT.join("#{contract_name}.json"))
    @errors = schema.validate(body.is_a?(String) ? JSON.parse(body) : body).to_a
    @errors.empty?
  end

  failure_message do
    details = @errors.map { |error| "#{error.fetch("data_pointer").presence || "/"}: #{error.fetch("error")}" }
    "expected the body to match contract #{contract_name}:\n  #{details.join("\n  ")}"
  end
end
