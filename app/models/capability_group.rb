# == Schema Information
#
# Table name: capability_groups
#
#  id         :bigint           not null, primary key
#  position   :integer          not null
#  title      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_capability_groups_on_position  (position) UNIQUE
#
class CapabilityGroup < ApplicationRecord
  include Positioned

  has_many :capabilities, dependent: :restrict_with_exception

  validates :title, presence: true
end
