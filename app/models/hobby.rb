class Hobby < ApplicationRecord
  include Positioned

  validates :name, :image_path, presence: true
end
