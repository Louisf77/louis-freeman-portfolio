module Content
  class Seeder
    SOURCE_PATH = Rails.root.join("db/seeds/content.json")
    HOBBY_IMAGE_DIRECTORY = "/images/hobbies".freeze
    PHOTO_HOBBIES = %w[Cooking Football].freeze
    PHOTO_EXTENSION = "jpg".freeze
    ILLUSTRATION_EXTENSION = "png".freeze
    PROFILE_FIELDS = {
      email: "email",
      footer_blurb: "footerBlurb",
      github_url: "github",
      linkedin_url: "linkedin",
      location: "location",
      name: "name",
      role: "role",
    }.freeze
    HERO_FIELDS = { greeting_prefix: "greetingPrefix", tagline: "tagline" }.freeze
    SELECTED_WORK_FIELDS = { intro: "selectedWorkIntro" }.freeze
    CAPABILITIES_FIELDS = { intro: "capabilitiesIntro", title: "capabilitiesTitle" }.freeze
    WORK_HEADER_FIELDS = { intro: "intro" }.freeze
    ABOUT_INTRO_FIELDS = { heading: "heading", subline: "subline" }.freeze
    EXPERIENCE_FIELDS = {
      company: "company",
      dates_label: "dates",
      role: "role",
      summary: "summary",
      year_label: "year",
    }.freeze
    OPTIONAL_EXPERIENCE_FIELDS = {
      duration_label: ["len", nil],
      education: ["edu", false],
      highlights: ["highlights", []],
      tags: ["tags", []],
      watermark: ["mark", nil],
    }.freeze
    CHAT_FIELDS = { answer: "a", question: "q" }.freeze
    OPTIONAL_CHAT_FIELDS = { highlights: ["highlight", []] }.freeze

    def self.from_file(path:, logger: Rails.logger)
      new(content: JSON.parse(File.read(path)), logger:)
    end

    def initialize(content:, logger: Rails.logger)
      @content = content
      @logger = logger
    end

    def call
      ActiveRecord::Base.transaction do
        seed_site
        seed_home
        seed_experiences
        seed_work
        seed_about
      end
      logger.info("Content::Seeder: seeded site content")
    end

    private

    attr_reader :content, :logger

    def seed_site
      upsert_section(model: Profile, source: content.fetch("site"), fields: PROFILE_FIELDS)
    end

    def seed_home
      home = content.fetch("home")
      upsert_section(model: HeroSection, source: home, fields: HERO_FIELDS)
      replace_items(model: HeroGreeting, rows: home.fetch("greetingEndings").map { |text| { text: } })
      upsert_section(model: SelectedWorkSection, source: home, fields: SELECTED_WORK_FIELDS)
      upsert_section(model: CapabilitiesSection, source: home, fields: CAPABILITIES_FIELDS)
      CapabilitiesSeeder.new(groups: home.fetch("capabilities"), ticker: home.fetch("stackTicker"), logger:).call
      replace_items(model: Domain, rows: home.fetch("domain").map { |label| { label: } })
    end

    def seed_experiences
      rows = content.fetch("experience").map { |experience| experience_row(experience:) }
      replace_items(model: Experience, rows:)
    end

    def experience_row(experience:)
      subs = experience.fetch("subs", []).map { |sub| { date_label: sub.fetch("date"), label: sub.fetch("label") } }
      Fields.map(source: experience, required: EXPERIENCE_FIELDS, optional: OPTIONAL_EXPERIENCE_FIELDS).merge(subs:)
    end

    def seed_work
      work = content.fetch("work")
      upsert_section(model: WorkHeader, source: work, fields: WORK_HEADER_FIELDS)
      CaseStudiesSeeder.new(case_studies: work.fetch("caseStudies"), logger:).call
    end

    def seed_about
      about = content.fetch("about")
      upsert_section(model: AboutIntro, source: about, fields: ABOUT_INTRO_FIELDS)
      replace_items(model: ChatMessage, rows: about.fetch("conversation").map { |message| chat_row(message:) })
      replace_items(model: Hobby, rows: about.fetch("hobbies").map { |name| hobby_row(name:) })
      replace_items(model: EarlierRole, rows: about.fetch("earlier").map { |text| { text: } })
    end

    def chat_row(message:)
      Fields.map(source: message, required: CHAT_FIELDS, optional: OPTIONAL_CHAT_FIELDS)
    end

    def hobby_row(name:)
      photo = PHOTO_HOBBIES.include?(name)
      extension = photo ? PHOTO_EXTENSION : ILLUSTRATION_EXTENSION
      { image_path: "#{HOBBY_IMAGE_DIRECTORY}/#{name.downcase}.#{extension}", name:, photo: }
    end

    def upsert_section(model:, source:, fields:)
      model.first_or_initialize.update!(Fields.map(source:, required: fields))
    end

    def replace_items(model:, rows:)
      PositionedRows.replace(scope: model.all, rows:, logger:)
    end
  end
end
