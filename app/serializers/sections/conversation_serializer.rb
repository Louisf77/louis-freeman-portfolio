module Sections
  class ConversationSerializer
    ATTRIBUTES = %i[id question answer highlights position].freeze

    def initialize(chat_messages: ChatMessage.ordered)
      @chat_messages = chat_messages
    end

    def as_json(*)
      chat_messages.map { |chat_message| chat_message.slice(*ATTRIBUTES).symbolize_keys }
    end

    private

    attr_reader :chat_messages
  end
end
