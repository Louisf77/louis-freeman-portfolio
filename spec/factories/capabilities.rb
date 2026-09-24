FactoryBot.define do
  factory :capability do
    capability_group
    name { "TypeScript" }
    sequence(:position)

    trait :in_ticker do
      in_ticker { true }
      sequence(:ticker_position)
    end

    trait :ungrouped do
      in_ticker
      capability_group { nil }
      position { nil }
    end
  end
end
