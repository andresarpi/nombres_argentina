class CreateYearAggregateInfos < ActiveRecord::Migration[5.1]
  def change
    create_table :year_aggregate_infos do |t|
      t.integer :year
      t.integer :top10_count
      t.integer :total_count
      t.integer :rest_count

      t.timestamps
    end
  end
end
