class Capability < ApplicationRecord
  belongs_to :capability_group, optional: true

  scope :ordered, -> { order(:position) }
  scope :in_ticker, -> { where(in_ticker: true).order(:ticker_position) }
  scope :outside_ticker, -> { where(in_ticker: false) }
  scope :grouped, -> { where.not(capability_group: nil) }
  scope :ungrouped, -> { where(capability_group: nil) }
  scope :belonging_to_groups, ->(capability_groups) { where(capability_group: capability_groups) }

  validates :name, presence: true
  validates :position, presence: true, if: :capability_group
  validates :position, uniqueness: { scope: :capability_group_id }, allow_nil: true
  validates :ticker_position, presence: true, if: :in_ticker?
  validates :ticker_position, absence: true, unless: :in_ticker?
  validates :ticker_position, uniqueness: true, allow_nil: true
  validate :grouped_or_in_ticker

  private

  def grouped_or_in_ticker
    return if capability_group || in_ticker?

    errors.add(:base, "Capability #{name} needs a group or a place in the ticker")
  end
end
