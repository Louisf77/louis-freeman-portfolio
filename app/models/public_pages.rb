class PublicPages
  include Rails.application.routes.url_helpers

  def initialize(work_publication: WorkPublication.new)
    @work_publication = work_publication
  end

  def paths
    all_paths = [root_path, work_path, about_path]
    return all_paths if work_publication.published?

    all_paths - [work_path]
  end

  private

  attr_reader :work_publication
end
