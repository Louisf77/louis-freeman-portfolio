# == Schema Information
#
# Table name: capabilities_sections
#
#  id         :bigint           not null, primary key
#  intro      :text             not null
#  title      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class CapabilitiesSection < ApplicationRecord
  include SingletonSection

  validates :title, :intro, presence: true
end
