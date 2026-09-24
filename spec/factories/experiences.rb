FactoryBot.define do
  factory :experience do
    company { "Hnry" }
    role { "Senior Software Engineer" }
    dates_label { "Jan 2024 — Present" }
    year_label { "Now" }
    summary { "Multi-region financial services platform." }
    sequence(:position)

    trait :education do
      education { true }
      watermark { "UON" }
    end
  end
end
