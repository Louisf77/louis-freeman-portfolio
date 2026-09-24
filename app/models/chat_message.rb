class ChatMessage < ApplicationRecord
  include Positioned

  validates :question, :answer, presence: true
end
