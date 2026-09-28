Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resource :profile, :home, :work, :about, only: :show
    end
  end

  root "pages#home"
  get "work" => "pages#work"
  get "about" => "pages#about"

  get "sitemap.xml" => "sitemaps#show", as: :sitemap, format: false, defaults: { format: :xml }
  get "robots.txt" => "robots#show", as: :robots, format: false, defaults: { format: :text }
end
