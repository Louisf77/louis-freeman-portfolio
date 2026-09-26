module PagesHelper
  BOOTSTRAP_ELEMENT_ID = "bootstrap".freeze
  JSON_CONTENT_TYPE = "application/json".freeze
  JSON_LD_CONTENT_TYPE = "application/ld+json".freeze
  SHARE_IMAGE_HEIGHT = 630
  SHARE_IMAGE_PATH = "/og/default.png".freeze
  SHARE_IMAGE_WIDTH = 1200

  def page_title
    t("meta.#{page}.title")
  end

  def page_description
    t("meta.#{page}.description")
  end

  def canonical_url
    canonical_url_for(path: request.path)
  end

  def share_image_url
    canonical_url_for(path: SHARE_IMAGE_PATH)
  end

  def page_bootstrap_script_tag
    json_script_tag(
      data: Pages::BootstrapSerializer.new(page:).as_json,
      id: BOOTSTRAP_ELEMENT_ID,
      type: JSON_CONTENT_TYPE,
    )
  end

  def structured_data_script_tag
    json_script_tag(
      data: Pages::StructuredDataSerializer.new(page:, url: canonical_url_for(path: root_path)).as_json,
      type: JSON_LD_CONTENT_TYPE,
    )
  end

  private

  def canonical_url_for(path:)
    "#{Rails.configuration.x.canonical_origin}#{path}"
  end
end
