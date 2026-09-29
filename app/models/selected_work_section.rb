# == Schema Information
#
# Table name: selected_work_sections
#
#  id         :bigint           not null, primary key
#  intro      :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class SelectedWorkSection < ApplicationRecord
  include SingletonSection

  validates :intro, presence: true
end
