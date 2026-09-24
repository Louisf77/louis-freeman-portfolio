class CapabilityGroup < ApplicationRecord
  include Positioned

  has_many :capabilities, dependent: :restrict_with_exception

  validates :title, presence: true
end
