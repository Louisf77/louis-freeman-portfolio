Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resource :profile, :home, :work, :about, only: :show
    end
  end

  root "pages#home"
end
