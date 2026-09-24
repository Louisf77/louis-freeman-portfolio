FactoryBot.define do
  factory :profile do
    name { "Louis Freeman" }
    role { "Senior Full Stack Engineer" }
    location { "London" }
    email { "hello@louisfreeman.co.uk" }
    linkedin_url { "https://www.linkedin.com/in/louis-freeman7/" }
    github_url { "https://github.com/Louisf77" }
    footer_blurb { "Based in London." }
  end
end
