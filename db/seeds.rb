# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'csv'  

i = 0
CSV.foreach("./nombres-2010-2014.csv") do |row|

   name = row[0]
   count = row[1]
   ano = row[2]
  n = NameCount.new(name: name, count: count, year: ano)
  n.save!

  if i % 10000 == 00 
      puts i
  end
  i += 1
end