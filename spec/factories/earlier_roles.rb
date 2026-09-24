FactoryBot.define do
  factory :earlier_role do
    text { "Spectator services at the Rio 2016 Olympics." }
    sequence(:position)
  end
end
