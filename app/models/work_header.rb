class WorkHeader < ApplicationRecord
  include SingletonSection

  validates :intro, presence: true
end
