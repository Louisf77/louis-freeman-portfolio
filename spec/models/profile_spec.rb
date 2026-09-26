RSpec.describe Profile do
  it_behaves_like "a singleton section"
  it_behaves_like "a record requiring", :name, :role, :location, :email, :linkedin_url, :github_url, :footer_blurb
end
