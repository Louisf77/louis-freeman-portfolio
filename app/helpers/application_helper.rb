module ApplicationHelper
  def json_script_tag(data:, **attributes)
    tag.script(json_escape(data.to_json).html_safe, **attributes)
  end
end
