# == Schema Information
#
# Table name: chat_messages
#
#  id         :bigint           not null, primary key
#  answer     :text             not null
#  highlights :jsonb            not null
#  position   :integer          not null
#  question   :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_chat_messages_on_position  (position) UNIQUE
#
class ChatMessage < ApplicationRecord
  include Positioned

  validates :question, :answer, presence: true
end
