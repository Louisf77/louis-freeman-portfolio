require "rails_helper"

RSpec.describe Experience do
  it_behaves_like "a positioned item"
  it_behaves_like "a record requiring", :company, :role, :dates_label, :year_label, :summary
end
