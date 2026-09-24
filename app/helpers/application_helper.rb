module ApplicationHelper
  def page_bootstrap_script_tag
    tag.script(json_escape({ queries: {}, ui: t("ui") }.to_json).html_safe, id: "bootstrap", type: "application/json")
  end
end
