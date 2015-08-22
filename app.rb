require 'sinatra'
require 'json'
require './tree_map'

get "/" do
 send_file './public/index.html'
end

post "/deep_sort" do
 data = request.body.read
 JSON.parse(data, {:object_class => TreeMap}).to_json
end
