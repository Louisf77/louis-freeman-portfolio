# == Schema Information
#
# Table name: about_intros
#
#  id         :bigint           not null, primary key
#  heading    :string           not null
#  subline    :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class AboutIntro < ApplicationRecord
  include SingletonSection

  validates :heading, :subline, presence: true
end
