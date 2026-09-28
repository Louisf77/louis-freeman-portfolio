xml.instruct!
xml.urlset(xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9") do
  page_paths.each do |path|
    xml.url do
      xml.loc(canonical_url_for(path:))
    end
  end
end
