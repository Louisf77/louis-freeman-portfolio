module Positioned
  extend ActiveSupport::Concern

  included do
    scope :ordered, -> { order(:position) }
    scope :positioned_after, ->(position) { where(position: (position + 1)..) }

    validates :position, presence: true, uniqueness: true
  end
end
