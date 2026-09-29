# == Schema Information
#
# Table name: hero_sections
#
#  id              :bigint           not null, primary key
#  greeting_prefix :string           not null
#  tagline         :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class HeroSection < ApplicationRecord
  include SingletonSection

  validates :greeting_prefix, :tagline, presence: true
end
