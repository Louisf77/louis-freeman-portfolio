# == Schema Information
#
# Table name: domains
#
#  id         :bigint           not null, primary key
#  label      :string           not null
#  position   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_domains_on_position  (position) UNIQUE
#
class Domain < ApplicationRecord
  include Positioned

  validates :label, presence: true
end
