FactoryBot.define do
  factory :case_study do
    sequence(:slug) { |n| "case-study-#{n}" }
    number { "01" }
    title { "[redacted]" }
    years_label { "2024–25" }
    role { "Lead engineer" }
    diagram_key { "cards" }
    headline { "Replacing an [redacted]." }
    description { "[redacted] in the payments gem." }
    sequence(:position)

    trait :featured do
      featured { true }
    end
  end
end
