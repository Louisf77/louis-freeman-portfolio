FactoryBot.define do
  factory :capability_group do
    title { "Front end" }
    sequence(:position)
  end
end
