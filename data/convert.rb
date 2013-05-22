#!/usr/bin/env ruby
# encoding: utf-8

if RUBY_VERSION =~ /1.9/
  Encoding.default_external = Encoding::UTF_8
  Encoding.default_internal = Encoding::UTF_8
end


require 'csv'
require 'json'
require 'pp'
require 'zlib'
require 'fileutils'

production = false


FileUtils.rm_rf("json/winners/.", secure: true)
FileUtils.rm_rf("json/tours/.", secure: true)
FileUtils.rm Dir.glob('json/*.json')
FileUtils.rm Dir.glob('json/*.gz')


legs = []
short_legs = []
short_legs_fields = ['id', 'year', 'leg', 'title', 'start', 'finish']
tours = {}
winners = {}
fighters = {}



idx = 0
CSV.foreach("csv/Données - Fight - Feuille1.csv") do |row|

	if idx > 0
#		p row

		id = row[0]
		year = row[5].to_i

		fighters[id] = {}
		fighters[id][:id] = id
		fighters[id][:first_name] = row[1]
		fighters[id][:last_name] = row[2]
		fighters[id][:nb_leg_wins] = row[3].to_i

		fighters[id][:pct_leading] = row[4].to_i
		fighters[id][:pct_leading_year] = row[5].to_i

		fighters[id][:ahead_of_2nd] = row[6].to_i
		fighters[id][:ahead_of_2nd_year] = row[7].to_i

		fighters[id][:average_speed] = row[8].gsub(/^(\d+),(\d+)/, '\1.\2').to_f
		fighters[id][:average_speed_year] = row[9].to_i

		fighters[id][:nb_wins] = row[10].to_i

		fighters[id][:is_doped] = ( row[11] == 'oui' )

	end

	idx = idx + 1

end

puts "#{fighters.length} fighters"

idx = 0
CSV.foreach("csv/Données - Tours - Feuille1.csv") do |row|

	if idx > 0
#		p row

		tour = {}
		tour[:year] = row[0].to_i

		tour[:edition] = row[1].to_i

		tour[:total_length] = row[2].to_i
		tour[:nb_legs] = row[3].to_i
		tour[:has_prologue] = (row[4] == 'o')

		tour[:nb_concurrents] = row[5].to_i
		tour[:nb_finishers] = row[6].to_i
		tour[:pct_finishers] = row[7].to_i

		tour[:winner_name] = row[8]
		tour[:winner_time] = row[9]

		tour[:ahead_of_2nd] = row[10]
		tour[:second_name] = row[11]
		tour[:second_country] = row[12]

		tour[:ahead_of_3rd] = row[13]
		tour[:third_name] = row[14]
		tour[:third_country] = row[14]

		tour[:legs] = []

		tours[tour[:year]] = tour

	end

	idx = idx + 1

end

#puts tours
puts "#{tours.length} tours"



idx = 0
CSV.foreach("csv/Données - Vainqueurs - Feuille1.csv") do |row|

	if idx > 0
#		p row

		id = row[0]
		year = row[5].to_i

		if winners[id].nil?
			winners[id] = {}
			winners[id][:id] = id
			winners[id][:first_name] = row[1]
			winners[id][:last_name] = row[2]
			winners[id][:birthyear] = row[5].to_i - row[3].to_i
			winners[id][:country] = row[4]
			winners[id][:years] = {}
		end

		winners[id][:years][year] = {}
		winners[id][:years][year][:nb_days_in_yellow] = row[6].to_i
		winners[id][:years][year][:nb_tour_legs] = row[7].to_i
		winners[id][:years][year][:pct_leading] = row[8].to_i
		winners[id][:years][year][:nb_leg_wins] = row[9].to_i
		winners[id][:years][year][:average_speed] = row[10].gsub(/^(\d+),(\d+)/, '\1.\2').to_f
		winners[id][:years][year][:total_time] = row[11]
		winners[id][:years][year][:ahead_of_2nd] = row[12]
		winners[id][:is_doped] = ( row[14] == 'oui' )

		winners[id][:nb_wins] = row[15]

	end

	idx = idx + 1

end

puts "#{winners.length} winners"





idx = 0
CSV.foreach("csv/Fichier étapes geolocalisées - Feuille1.csv") do |row|

	if idx > 0

		leg = {}

		leg[:id] = row[0].gsub(/\-(\d)$/, '-0\1')

		leg[:year] = row[1].to_i
		leg[:leg] = row[2].to_i
		leg[:title] = row[3]

		leg[:start] = {}
		leg[:start][:city] = row[4]
		leg[:start][:country] = row[5]
#		leg[:start][:coords] = row[6]
		coords = row[6].split(/,/) unless row[6].nil?
		leg[:start][:lat] = coords[0]
		leg[:start][:lng] = coords[1]
#		leg[:start][:coords_inv] = row[9]

		leg[:finish] = {}
		leg[:finish][:city] = row[7]
		leg[:finish][:country] = row[8]
#		leg[:finish][:coords] = row[12]
		coords = row[9].split(/,/) unless row[9].nil?
		leg[:finish][:lat] = coords[0]
		leg[:finish][:lng] = coords[1]

		leg[:length] = row[10].to_i

#		leg[:finish][:coords_inv] = row[16]

		leg[:type] = row[11]

		leg[:winner] = {}
		leg[:winner][:name] = row[12]
		leg[:winner][:nationality] = row[13]

		leg[:leader] = {}
		leg[:leader][:name] = row[14]
		leg[:leader][:nationality] = row[15]

		unless tours[leg[:year]].nil?

			tours[leg[:year]][:legs] << leg

		end

		legs << leg

		short_legs << leg.clone.keep_if {|k,v| short_legs_fields.include? k }

		# break	if idx > 30

	end

	idx = idx + 1

end
puts "#{legs.length} etapes"

# puts tours.first
# puts tours.first[1][:legs]


tours.each do |year, tour|
	tour[:legs].sort_by! {|o| o[:leg] }
end

# Fighters

filename = "json/fighters.json"
content = production ? fighters.to_json : JSON.pretty_generate(fighters)
File.open(filename, 'w') { |file| file.write content }
Zlib::GzipWriter.open("#{filename}.gz") { |file| file.write content }

tours.each do |year, tour|
	filename = "json/tours/#{year}.json"
	content = production ? tour.to_json : JSON.pretty_generate(tour)
	File.open(filename, 'w') { |file| file.write content }
	Zlib::GzipWriter.open("#{filename}.gz") { |file| file.write content }
end

# Loops

filename = "json/tours.json"
content = production ? tours.to_json : JSON.pretty_generate(tours)
File.open(filename, 'w') { |file| file.write content }
Zlib::GzipWriter.open("#{filename}.gz") { |file| file.write content }

tours.each do |year, tour|
	filename = "json/tours/#{year}.json"
	content = production ? tour.to_json : JSON.pretty_generate(tour)
	File.open(filename, 'w') { |file| file.write content }
	Zlib::GzipWriter.open("#{filename}.gz") { |file| file.write content }
end

# Winners
# one file by tour

filename = "json/winners.json"
content = production ? winners.to_json : JSON.pretty_generate(winners)
File.open(filename, 'w') { |file| file.write content }
Zlib::GzipWriter.open("#{filename}.gz") { |file| file.write content }

winners.each do |id, winner|
	filename = "json/winners/#{id}.json"
	content = production ? winner.to_json : JSON.pretty_generate(winner)
	File.open(filename, 'w') { |file| file.write content }
	Zlib::GzipWriter.open("#{filename}.gz") { |file| file.write content }
end


# Test all legs

filename = 'json/legs.json'

p filename

content = production ? legs.to_json : JSON.pretty_generate(legs)
File.open(filename, 'w') { |file| file.write content }
Zlib::GzipWriter.open("#{filename}.gz") { |file| file.write content }

filename = 'json/legs-short.json'
content = production ? short_legs.to_json : JSON.pretty_generate(short_legs)
File.open(filename, 'w') { |file| file.write content }
Zlib::GzipWriter.open("#{filename}.gz") { |file| file.write content }

