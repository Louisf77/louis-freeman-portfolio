module SingletonSection
  extend ActiveSupport::Concern

  included do
    validate :sole_row, on: :create
  end

  class_methods do
    def current
      take || raise(ActiveRecord::RecordNotFound.new("#{name} has not been seeded", name))
    end
  end

  private

  def sole_row
    return unless self.class.exists?

    errors.add(:base, "#{self.class.model_name.human} already exists")
  end
end
