class HeroGreeting < ApplicationRecord
  include Positioned

  validates :text, presence: true
end
