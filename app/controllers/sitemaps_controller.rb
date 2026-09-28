class SitemapsController < ApplicationController
  helper_method :page_paths

  def show; end

  private

  def page_paths
    [root_path, work_path, about_path]
  end
end
