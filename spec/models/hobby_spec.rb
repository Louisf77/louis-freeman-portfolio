require "rails_helper"

RSpec.describe Hobby do
  it_behaves_like "a positioned item"
  it_behaves_like "a record requiring", :name, :image_path
end
