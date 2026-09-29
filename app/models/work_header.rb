# == Schema Information
#
# Table name: work_headers
#
#  id         :bigint           not null, primary key
#  intro      :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class WorkHeader < ApplicationRecord
  include SingletonSection

  validates :intro, presence: true
end
