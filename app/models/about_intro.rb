class AboutIntro < ApplicationRecord
  include SingletonSection

  validates :heading, :subline, presence: true
end
