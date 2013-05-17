#!/usr/bin/env ruby

if RUBY_VERSION =~ /1.9/
  Encoding.default_external = Encoding::UTF_8
  Encoding.default_internal = Encoding::UTF_8
end

require 'csv'
require 'json'
require 'pp'
require 'zlib'

legs = []
short_legs = []
short_legs_fields = ['id', 'year', 'leg', 'title', 'start', 'finish']


idx = 0
CSV.foreach("csv/Etapes_Tour_Total_Geoloc - Feuille1.csv") do |row|

	if idx > 0

		leg = {}

		leg[:id] = row[0]
		leg[:year] = row[1]
		leg[:leg] = row[2]
		leg[:title] = row[3]

		leg[:start] = {}
		leg[:start][:city] = row[4]
		leg[:start][:country] = row[5]
#		leg[:start][:coords] = row[6]
		leg[:start][:lat] = row[7]
		leg[:start][:lng] = row[8]

		leg[:finish] = {}
		leg[:finish][:city] = row[9]
		leg[:finish][:country] = row[10]
#		leg[:finish][:coords] = row[11]
		leg[:finish][:lat] = row[12]
		leg[:finish][:lng] = row[13]

		leg[:length] = row[14]
		leg[:type] = row[15]

		leg[:winner] = {}
		leg[:winner][:name] = row[16]
		leg[:winner][:nationality] = row[17]

		leg[:leader] = {}
		leg[:leader][:name] = row[18]
		leg[:leader][:nationality] = row[19]

		legs << leg

		short_legs << leg.clone.keep_if {|k,v| short_legs_fields.include? k }

	end

	idx = idx + 1

end

puts "#{legs.length} etapes"

File.open('json/legs.json', 'w') { |file| file.write legs.to_json }
Zlib::GzipWriter.open('json/legs.json.gz') { |file| file.write legs.to_json }

File.open('json/legs-short.json', 'w') { |file| file.write short_legs.to_json }
Zlib::GzipWriter.open('json/legs-short.json.gz') { |file| file.write short_legs.to_json }
