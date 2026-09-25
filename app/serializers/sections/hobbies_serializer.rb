module Sections
  class HobbiesSerializer
    HOBBY_ATTRIBUTES = %i[id name image_path photo position].freeze

    def initialize(hobbies: Hobby.ordered, earlier_roles: EarlierRole.ordered)
      @hobbies = hobbies
      @earlier_roles = earlier_roles
    end

    def as_json(*)
      {
        items: hobbies.map { |hobby| hobby.slice(*HOBBY_ATTRIBUTES).symbolize_keys },
        earlier_roles: earlier_roles.map { |item| Items::ListItemSerializer.new(item:).as_json },
      }
    end

    private

    attr_reader :hobbies, :earlier_roles
  end
end
