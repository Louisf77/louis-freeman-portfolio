# == Schema Information
#
# Table name: profiles
#
#  id           :bigint           not null, primary key
#  email        :string           not null
#  footer_blurb :text             not null
#  github_url   :string           not null
#  linkedin_url :string           not null
#  location     :string           not null
#  name         :string           not null
#  role         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Profile < ApplicationRecord
  include SingletonSection

  validates :name, :role, :location, :email, :linkedin_url, :github_url, :footer_blurb, presence: true
end
