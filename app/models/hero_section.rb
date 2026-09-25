class HeroSection < ApplicationRecord
  include SingletonSection

  validates :greeting_prefix, :tagline, presence: true
end
