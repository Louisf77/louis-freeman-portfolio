module CanonicalUrlHelper
  def canonical_url_for(path:)
    "#{Rails.configuration.x.canonical_origin}#{path}"
  end
end
