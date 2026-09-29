# == Schema Information
#
# Table name: earlier_roles
#
#  id         :bigint           not null, primary key
#  position   :integer          not null
#  text       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_earlier_roles_on_position  (position) UNIQUE
#
class EarlierRole < ApplicationRecord
  include Positioned

  validates :text, presence: true
end
