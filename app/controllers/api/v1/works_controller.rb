module Api
  module V1
    class WorksController < BaseController
      def show
        render_content(body: Pages::WorkSerializer.new.as_json)
      end
    end
  end
end
