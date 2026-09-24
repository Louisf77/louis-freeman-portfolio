require "rails_helper"

RSpec.describe CapabilitiesSection do
  it_behaves_like "a singleton section"
  it_behaves_like "a record requiring", :title, :intro
end
