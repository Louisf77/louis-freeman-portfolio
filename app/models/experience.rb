# == Schema Information
#
# Table name: experiences
#
#  id             :bigint           not null, primary key
#  company        :string           not null
#  dates_label    :string           not null
#  duration_label :string
#  education      :boolean          default(FALSE), not null
#  highlights     :jsonb            not null
#  position       :integer          not null
#  role           :string           not null
#  subs           :jsonb            not null
#  summary        :text             not null
#  tags           :jsonb            not null
#  watermark      :string
#  year_label     :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_experiences_on_position  (position) UNIQUE
#
class Experience < ApplicationRecord
  include Positioned

  validates :company, :role, :dates_label, :year_label, :summary, presence: true
end
