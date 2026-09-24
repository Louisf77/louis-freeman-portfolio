class CapabilitiesSection < ApplicationRecord
  include SingletonSection

  validates :title, :intro, presence: true
end
