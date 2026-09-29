class SitemapsController < ApplicationController
  helper_method :page_paths

  def show; end

  private

  def page_paths
    PublicPages.new.paths
  end
end
