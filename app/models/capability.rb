# == Schema Information
#
# Table name: capabilities
#
#  id                  :bigint           not null, primary key
#  in_ticker           :boolean          default(FALSE), not null
#  name                :string           not null
#  position            :integer
#  ticker_label        :string
#  ticker_position     :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  capability_group_id :bigint
#
# Indexes
#
#  index_capabilities_on_capability_group_id               (capability_group_id)
#  index_capabilities_on_capability_group_id_and_position  (capability_group_id,position) UNIQUE
#  index_capabilities_on_ticker_position                   (ticker_position) UNIQUE WHERE (ticker_position IS NOT NULL)
#
# Foreign Keys
#
#  fk_rails_...  (capability_group_id => capability_groups.id)
#
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
