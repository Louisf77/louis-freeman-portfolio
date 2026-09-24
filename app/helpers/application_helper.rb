module ApplicationHelper
  def page_bootstrap_json
    json_escape({ queries: {}, ui: t("ui") }.to_json).html_safe
  end
end
