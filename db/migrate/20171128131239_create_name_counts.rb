class CreateNameCounts < ActiveRecord::Migration[5.1]
  def change
    create_table :name_counts do |t|
      t.integer :year
      t.string :name
      t.integer :count

      t.timestamps
    end
  end
end
