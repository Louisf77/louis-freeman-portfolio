# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_24_100015) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "about_intros", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "heading", null: false
    t.string "subline", null: false
    t.datetime "updated_at", null: false
  end

  create_table "capabilities", force: :cascade do |t|
    t.bigint "capability_group_id"
    t.datetime "created_at", null: false
    t.boolean "in_ticker", default: false, null: false
    t.string "name", null: false
    t.integer "position"
    t.string "ticker_label"
    t.integer "ticker_position"
    t.datetime "updated_at", null: false
    t.index ["capability_group_id", "position"], name: "index_capabilities_on_capability_group_id_and_position", unique: true
    t.index ["capability_group_id"], name: "index_capabilities_on_capability_group_id"
    t.index ["ticker_position"], name: "index_capabilities_on_ticker_position", unique: true, where: "(ticker_position IS NOT NULL)"
  end

  create_table "capabilities_sections", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "intro", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
  end

  create_table "capability_groups", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "position", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_capability_groups_on_position", unique: true
  end

  create_table "case_studies", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description", null: false
    t.string "diagram_key", null: false
    t.boolean "featured", default: false, null: false
    t.text "headline", null: false
    t.string "metric"
    t.string "number", null: false
    t.integer "position", null: false
    t.string "role", null: false
    t.string "slug", null: false
    t.jsonb "tags", default: [], null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.string "years_label", null: false
    t.index ["featured"], name: "index_case_studies_on_featured"
    t.index ["position"], name: "index_case_studies_on_position", unique: true
    t.index ["slug"], name: "index_case_studies_on_slug", unique: true
  end

  create_table "chat_messages", force: :cascade do |t|
    t.text "answer", null: false
    t.datetime "created_at", null: false
    t.jsonb "highlights", default: [], null: false
    t.integer "position", null: false
    t.string "question", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_chat_messages_on_position", unique: true
  end

  create_table "domains", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "label", null: false
    t.integer "position", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_domains_on_position", unique: true
  end

  create_table "earlier_roles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "position", null: false
    t.string "text", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_earlier_roles_on_position", unique: true
  end

  create_table "experiences", force: :cascade do |t|
    t.string "company", null: false
    t.datetime "created_at", null: false
    t.string "dates_label", null: false
    t.string "duration_label"
    t.boolean "education", default: false, null: false
    t.jsonb "highlights", default: [], null: false
    t.integer "position", null: false
    t.string "role", null: false
    t.jsonb "subs", default: [], null: false
    t.text "summary", null: false
    t.jsonb "tags", default: [], null: false
    t.datetime "updated_at", null: false
    t.string "watermark"
    t.string "year_label", null: false
    t.index ["position"], name: "index_experiences_on_position", unique: true
  end

  create_table "hero_greetings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "position", null: false
    t.string "text", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_hero_greetings_on_position", unique: true
  end

  create_table "hero_sections", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "greeting_prefix", null: false
    t.string "tagline", null: false
    t.datetime "updated_at", null: false
  end

  create_table "hobbies", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "image_path", null: false
    t.string "name", null: false
    t.boolean "photo", default: false, null: false
    t.integer "position", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_hobbies_on_position", unique: true
  end

  create_table "profiles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.text "footer_blurb", null: false
    t.string "github_url", null: false
    t.string "linkedin_url", null: false
    t.string "location", null: false
    t.string "name", null: false
    t.string "role", null: false
    t.datetime "updated_at", null: false
  end

  create_table "selected_work_sections", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "intro", null: false
    t.datetime "updated_at", null: false
  end

  create_table "work_headers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "intro", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "capabilities", "capability_groups"
end
