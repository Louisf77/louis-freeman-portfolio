class Experience < ApplicationRecord
  include Positioned

  validates :company, :role, :dates_label, :year_label, :summary, presence: true
end
