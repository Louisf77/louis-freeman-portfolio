if Rails.env.test?
  Rails.logger.info("db/seeds.rb: skipping content seeds in test, specs create their own records")
else
  Content::Seeder.from_file(path: Content::Seeder::SOURCE_PATH).call
end
