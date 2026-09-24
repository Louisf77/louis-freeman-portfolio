class Profile < ApplicationRecord
  include SingletonSection

  validates :name, :role, :location, :email, :linkedin_url, :github_url, :footer_blurb, presence: true
end
