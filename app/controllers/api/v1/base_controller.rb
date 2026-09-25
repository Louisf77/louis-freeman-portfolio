module Api
  module V1
    class BaseController < ActionController::API
      CACHE_LIFETIME = 5.minutes
      INTERNAL_ERROR_MESSAGE = "Something went wrong loading this content".freeze

      rescue_from StandardError, with: :render_internal_error
      rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

      private

      def render_content(body:)
        expires_in CACHE_LIFETIME, public: true
        render json: body
      end

      def render_not_found(error)
        Rails.logger.warn("#{error.class}: #{error.message}")
        render_error(code: "not_found", message: not_found_message(error:), status: :not_found)
      end

      def render_internal_error(error)
        Rails.logger.error("#{error.class}: #{error.message}")
        render_error(code: "internal_error", message: INTERNAL_ERROR_MESSAGE, status: :internal_server_error)
      end

      def render_error(code:, message:, status:)
        render json: { errors: [{ code:, field: nil, message: }] }, status:
      end

      def not_found_message(error:)
        "#{error.model.constantize.model_name.human} has not been seeded"
      end
    end
  end
end
