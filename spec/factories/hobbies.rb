FactoryBot.define do
  factory :hobby do
    name { "Rugby" }
    image_path { "/images/hobbies/rugby.png" }
    sequence(:position)

    trait :photo do
      photo { true }
    end
  end
end
