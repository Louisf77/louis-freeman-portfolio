require "rails_helper"

RSpec.describe Domain do
  it_behaves_like "a positioned item"
  it_behaves_like "a record requiring", :label
end
