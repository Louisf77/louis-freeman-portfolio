# == Schema Information
#
# Table name: hero_greetings
#
#  id         :bigint           not null, primary key
#  position   :integer          not null
#  text       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_hero_greetings_on_position  (position) UNIQUE
#
class HeroGreeting < ApplicationRecord
  include Positioned

  validates :text, presence: true
end
