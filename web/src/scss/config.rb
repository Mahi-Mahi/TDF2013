
# template_path = Dir.pwd.match(/(\/wp-content\/.*$)/)[1]

http_path = "/"
css_dir = "css"
sass_dir = "scss"
images_dir = "images"

environment = :development
preferred_syntax = :scss

output_style = :expanded # by Compass.app

# require 'fileutils'
# on_stylesheet_saved do |file|
#   if File.exists?(file) && File.basename(file) == "style.css"
#     puts "Moving: #{file}"
#     FileUtils.mv(file, File.dirname(file) + "/../" + File.basename(file))
#   end
# end
