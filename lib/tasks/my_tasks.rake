namespace :my_tasks do
  desc "TODO"
  task materializeYearCounts: :environment do
    YearAggregateInfo.delete_all
    
    years = NameCount
                  .select("name_counts.year, SUM(name_counts.count) as total_count")
                  .group("name_counts.year")
                  
    years.each do |year|
      sql_string = 'SELECT SUM(inner_table.count)
                FROM (
                        SELECT  name_counts.count 
                        FROM "name_counts" WHERE (name_counts.year = ' + year["year"].to_s + ') 
                        ORDER BY "name_counts"."count" 
                        DESC LIMIT 10) as inner_table'
      results = ActiveRecord::Base.connection.execute(sql_string)
      top10_count = results[0]["sum"]
      rest = year["total_count"] - top10_count
      YearAggregateInfo.new(year: year["year"],
                            total_count: year["total_count"],  
                            top10_count: top10_count, 
                            rest_count: rest)
                            .save!
    end
    
  end

end
