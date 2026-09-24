FactoryBot.define do
  factory :domain do
    label { "OAuth" }
    sequence(:position)
  end
end
