FactoryBot.define do
  factory :case_study do
    sequence(:slug) { |n| "case-study-#{n}" }
    number { "01" }
    title { "Card Issuing, End to End" }
    years_label { "2024–25" }
    role { "Lead engineer" }
    diagram_key { "cards" }
    headline { "Replacing an incumbent banking and card provider." }
    description { "SOAP provisioning chain in the payments gem." }
    sequence(:position)

    trait :featured do
      featured { true }
    end
  end
end
