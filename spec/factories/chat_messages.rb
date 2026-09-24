FactoryBot.define do
  factory :chat_message do
    question { "So, what do you do?" }
    answer { "I'm a full-stack engineer." }
    highlights { ["full-stack engineer"] }
    sequence(:position)
  end
end
