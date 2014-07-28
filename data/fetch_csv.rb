#!/usr/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'google/api_client'
require 'launchy'
require 'pp'


# Get your credentials from the console
CLIENT_ID = '210255323896-8g9dubt91pvr0le5sc9skk3j3psonjsg.apps.googleusercontent.com'
CLIENT_SECRET = 'l18ued20woqfSWHs7UqczSEB'
OAUTH_SCOPE = 'https://www.googleapis.com/auth/drive'
REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'

# Create a new API client & load the Google Drive API
client = Google::APIClient.new
drive = client.discovered_api('drive', 'v2')

# Request authorization
client.authorization.client_id = CLIENT_ID
client.authorization.client_secret = CLIENT_SECRET
client.authorization.scope = OAUTH_SCOPE
client.authorization.redirect_uri = REDIRECT_URI

uri = client.authorization.authorization_uri
Launchy.open(uri)

# Exchange authorization code for access token
$stdout.write  "Enter authorization code: "
client.authorization.code = gets.chomp
client.authorization.fetch_access_token!


folder_id = "0B-mnANvdRfRjNW53Q0tRcTVNb1k"

page_token = nil
begin
	parameters = {'folderId' => folder_id, 'maxResults' => 60}
	if page_token.to_s != ''
		parameters['pageToken'] = page_token
	end
	folder_result = client.execute(:api_method => drive.children.list, :parameters => parameters)
	if folder_result.status == 200
		children = folder_result.data
		children.items.each do |child|

			puts "File Id: #{child.id}"

			result = client.execute( :api_method => drive.files.get, :parameters => { 'fileId' => child.id })
			if result.status == 200
				file = result.data
				puts "#{file.title}"
				download_link = file['exportLinks']['application/pdf'].gsub!(/exportFormat=\w+$/, 'exportFormat=csv&gid=0')

				dl_result = client.execute(:uri => download_link)
				if dl_result.status == 200
					content = dl_result.body

					filename = "csv/vainqueurs/#{file.title}.csv"
					File.open(filename, 'w') { |file| file.write content }

				else
					puts "An error occurred: #{result.data['error']['message']}"
				end

			else
				puts "An error occurred: #{result.data['error']['message']}"
			end

		end
		page_token = children.next_page_token
	else
		puts "An error occurred: #{folder_result.data['error']['message']}"
		page_token = nil
	end
end while page_token.to_s != ''


if false

	folder_id = "0B07BAjiTe6BhaUlIRVlBSlVvbkk"

	page_token = nil
	begin
		parameters = {'folderId' => folder_id, 'maxResults' => 60}
		if page_token.to_s != ''
			parameters['pageToken'] = page_token
		end
		folder_result = client.execute(:api_method => drive.children.list, :parameters => parameters)
		if folder_result.status == 200
			children = folder_result.data
			children.items.each do |child|

				puts "File Id: #{child.id}"

				result = client.execute( :api_method => drive.files.get, :parameters => { 'fileId' => child.id })
				if result.status == 200
					file = result.data
					puts "#{file.title}"
					download_link = file['exportLinks']['application/pdf'].gsub!(/exportFormat=\w+$/, 'exportFormat=csv&gid=0')

					dl_result = client.execute(:uri => download_link)
					if dl_result.status == 200
						content = dl_result.body

						filename = "csv/tours/#{file.title}.csv"
						File.open(filename, 'w') { |file| file.write content }

					else
						puts "An error occurred: #{result.data['error']['message']}"
					end

				else
					puts "An error occurred: #{result.data['error']['message']}"
				end

			end
			page_token = children.next_page_token
		else
			puts "An error occurred: #{folder_result.data['error']['message']}"
			page_token = nil
		end
	end while page_token.to_s != ''
end

