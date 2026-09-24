require "rails_helper"

RSpec.describe SelectedWorkSection do
  it_behaves_like "a singleton section"
  it_behaves_like "a record requiring", :intro
end
