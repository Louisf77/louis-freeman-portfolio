require "json"
require "json_schemer"

module ContractSchemas
  BASE_URI = "https://louisfreeman.co.uk/contracts/".freeze
  FIXTURES_ROOT = Pathname.new(__dir__).join("../fixtures/contracts").expand_path
  ROOT = Pathname.new(__dir__).join("../contracts").expand_path

  def self.schema(contract_name:)
    JSONSchemer.schema(read(path: ROOT.join("#{contract_name}.json")), ref_resolver: method(:resolve_ref))
  end

  def self.fixture(contract_name:)
    read(path: FIXTURES_ROOT.join("#{contract_name}.json"))
  end

  def self.resolve_ref(uri)
    location = uri.to_s
    raise ArgumentError, "Contract ref #{location} is outside #{BASE_URI}" unless location.start_with?(BASE_URI)

    read(path: ROOT.join(location.delete_prefix(BASE_URI)))
  end

  def self.describe_violation(error:)
    pointer = error.fetch("data_pointer")
    "#{pointer.empty? ? "/" : pointer}: #{error.fetch("error")}"
  end

  def self.read(path:)
    JSON.parse(path.read)
  end
end

module ContractFixtures
  def contract_fixture(contract_name:)
    ContractSchemas.fixture(contract_name:)
  end
end

RSpec.configure do |config|
  config.include ContractFixtures
end

RSpec::Matchers.define :match_contract do |contract_name|
  match do |body|
    parsed_body = body.is_a?(String) ? JSON.parse(body) : body
    @errors = ContractSchemas.schema(contract_name:).validate(parsed_body).to_a
    @errors.empty?
  end

  failure_message do
    details = @errors.map { |error| ContractSchemas.describe_violation(error:) }
    "expected the body to match contract #{contract_name}:\n  #{details.join("\n  ")}"
  end

  failure_message_when_negated do
    "expected the body not to match contract #{contract_name}, but it did"
  end
end
