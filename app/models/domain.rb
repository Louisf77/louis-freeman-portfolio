class Domain < ApplicationRecord
  include Positioned

  validates :label, presence: true
end
