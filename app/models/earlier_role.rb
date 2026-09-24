class EarlierRole < ApplicationRecord
  include Positioned

  validates :text, presence: true
end
