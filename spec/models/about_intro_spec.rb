RSpec.describe AboutIntro do
  it_behaves_like "a singleton section"
  it_behaves_like "a record requiring", :heading, :subline
end
