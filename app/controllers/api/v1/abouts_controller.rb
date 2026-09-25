module Api
  module V1
    class AboutsController < BaseController
      def show
        render_content(body: Pages::AboutSerializer.new.as_json)
      end
    end
  end
end
