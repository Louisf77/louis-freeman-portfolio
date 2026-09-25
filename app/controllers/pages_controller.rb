class PagesController < ApplicationController
  helper_method :page

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
end
