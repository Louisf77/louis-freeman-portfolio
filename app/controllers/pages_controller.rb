class PagesController < ApplicationController
  NOT_FOUND_PAGE_PATH = Rails.public_path.join("404.html")
  UNAVAILABLE_PAGE_PATH = Rails.public_path.join("503.html")

  helper_method :page

  rescue_from ActiveRecord::RecordNotFound, with: :render_unavailable
  rescue_from WorkPublication::NotPublishedError, with: :render_not_found

  def home
    render_page
  end

  def work
    render_page
  end

  def about
    render_page
  end

  private

  def page
    action_name.to_sym
  end

  def render_page
    render html: "", layout: true
  end

  def render_not_found(error)
    Rails.logger.warn("#{error.class}: #{error.message}")
    render file: NOT_FOUND_PAGE_PATH, layout: false, content_type: "text/html", status: :not_found
  end

  def render_unavailable(error)
    Rails.logger.error("#{error.class}: #{error.message}")
    render file: UNAVAILABLE_PAGE_PATH, layout: false, content_type: "text/html", status: :service_unavailable
  end
end
