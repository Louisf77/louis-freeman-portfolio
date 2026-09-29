# == Schema Information
#
# Table name: case_studies
#
#  id          :bigint           not null, primary key
#  description :text             not null
#  diagram_key :string           not null
#  featured    :boolean          default(FALSE), not null
#  headline    :text             not null
#  metric      :string
#  number      :string           not null
#  position    :integer          not null
#  role        :string           not null
#  slug        :string           not null
#  tags        :jsonb            not null
#  title       :string           not null
#  years_label :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_case_studies_on_featured  (featured)
#  index_case_studies_on_position  (position) UNIQUE
#  index_case_studies_on_slug      (slug) UNIQUE
#
class CaseStudy < ApplicationRecord
  include Positioned

  DIAGRAM_KEYS = %w[cards identity tax ai].freeze

  scope :featured, -> { where(featured: true) }
  scope :without_slugs, ->(slugs) { where.not(slug: slugs) }

  validates :number, :title, :years_label, :role, :headline, :description, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :diagram_key, inclusion: { in: DIAGRAM_KEYS }
end
