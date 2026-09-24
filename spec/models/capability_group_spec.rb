require "rails_helper"

RSpec.describe CapabilityGroup do
  it_behaves_like "a positioned item"
  it_behaves_like "a record requiring", :title
end
