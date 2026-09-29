# == Schema Information
#
# Table name: hobbies
#
#  id         :bigint           not null, primary key
#  image_path :string           not null
#  name       :string           not null
#  photo      :boolean          default(FALSE), not null
#  position   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_hobbies_on_position  (position) UNIQUE
#
class Hobby < ApplicationRecord
  include Positioned

  validates :name, :image_path, presence: true
end
