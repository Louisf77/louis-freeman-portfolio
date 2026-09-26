RSpec.describe ChatMessage do
  it_behaves_like "a positioned item"
  it_behaves_like "a record requiring", :question, :answer
end
