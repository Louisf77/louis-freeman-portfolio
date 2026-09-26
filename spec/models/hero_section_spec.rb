RSpec.describe HeroSection do
  it_behaves_like "a singleton section"
  it_behaves_like "a record requiring", :greeting_prefix, :tagline
end
