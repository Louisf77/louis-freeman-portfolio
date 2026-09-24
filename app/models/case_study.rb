class CaseStudy < ApplicationRecord
  include Positioned

  DIAGRAM_KEYS = %w[cards identity tax ai].freeze

  scope :featured, -> { where(featured: true) }

  validates :number, :title, :years_label, :role, :headline, :description, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :diagram_key, inclusion: { in: DIAGRAM_KEYS }
end
