module RequestHelpers
  JSON_HEADERS = { "Accept" => "application/json" }.freeze

  def json_response
    response.parsed_body
  end

  def html_response
    Nokogiri::HTML5(response.body)
  end
end

RSpec.configure do |config|
  config.include RequestHelpers, type: :request
end
