FactoryBot.define do
  factory :hero_greeting do
    text { "Louis." }
    sequence(:position)
  end
end
