require "rails_helper"

RSpec.describe HeroGreeting do
  it_behaves_like "a positioned item"
  it_behaves_like "a record requiring", :text
end
