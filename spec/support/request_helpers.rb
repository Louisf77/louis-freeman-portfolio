module RequestHelpers
  JSON_HEADERS = { "Accept" => "application/json" }.freeze

  def json_response
    response.parsed_body
  end
end

RSpec.configure do |config|
  config.include RequestHelpers, type: :request
end
