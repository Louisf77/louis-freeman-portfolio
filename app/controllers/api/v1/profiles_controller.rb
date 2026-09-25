module Api
  module V1
    class ProfilesController < BaseController
      def show
        render_content(body: Pages::ProfileSerializer.new.as_json)
      end
    end
  end
end
