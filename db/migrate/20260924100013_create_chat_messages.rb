class CreateChatMessages < ActiveRecord::Migration[8.1]
  def up
    create_table :chat_messages do |t|
      t.string :question, null: false
      t.text :answer, null: false
      t.jsonb :highlights, null: false, default: []
      t.integer :position, null: false

      t.timestamps
    end

    add_index :chat_messages, :position, unique: true
  end

  def down
    drop_table :chat_messages
  end
end
