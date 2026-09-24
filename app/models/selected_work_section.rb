class SelectedWorkSection < ApplicationRecord
  include SingletonSection

  validates :intro, presence: true
end
