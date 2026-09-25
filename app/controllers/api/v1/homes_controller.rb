module Api
  module V1
    class HomesController < BaseController
      def show
        render_content(body: Pages::HomeSerializer.new.as_json)
      end
    end
  end
end
