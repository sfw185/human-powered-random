var express = require('express');
var logfmt = require('logfmt');

var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(request, response) {

  var options = {
    path: '/v1/media/popular?client_id=5d8fd13a49b949279f0ee9eb5b11f65b',
    host: 'api.instagram.com',
    headers: {'user-agent': 'Human-powered Randomness (https://github.com/FaridW/human-rng)'}
  };

  var https = require('https');
  https.get(options, function(res) {
    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function(){
      var api_response = JSON.parse(body);
      var data = api_response.data;
      var media = data[0]; // Get first image

      var web_url = media.link;
      var image_url = media.images.low_resolution.url; // Also available are 'thumbnail' and 'standard_resolution'

      var jade = require('jade');
      var html = jade.renderFile('template.jade',{web: web_url, image: image_url});

      response.send(html);
      response.end();
    });
  });
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function() {
  console.log("Listening on " + port);
});
