module Positioned
  extend ActiveSupport::Concern

  included do
    scope :ordered, -> { order(:position) }

    validates :position, presence: true, uniqueness: true
  end
end
