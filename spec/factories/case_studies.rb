FactoryBot.define do
  factory :case_study do
    sequence(:slug) { |n| "example-project-#{n}" }
    number { "01" }
    title { "Example project" }
    years_label { "2025" }
    role { "Lead engineer" }
    diagram_key { "cards" }
    headline { "Placeholder headline for an example project." }
    description { "Placeholder description for an example project." }
    sequence(:position)

    trait :featured do
      featured { true }
    end
  end
end
