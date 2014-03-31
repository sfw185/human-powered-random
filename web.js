var express = require('express');
var logfmt = require('logfmt');
var https = require('https');
var jade = require('jade');

var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(request, response) {
  response.send('Hello World! See <a href="/generate">/generate</a>').end();
});

app.get('/generate', function(request, response) {

  var options = {
    path: '/v1/media/popular?client_id=5d8fd13a49b949279f0ee9eb5b11f65b',
    host: 'api.instagram.com',
    headers: {'user-agent': 'Human-powered Randomness (https://github.com/FaridW/human-rng)'}
  };

  https.get(options, function(res) {
    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function(){
      var api_response = JSON.parse(body);
      var data = api_response.data;

      response.send(api_response);
      response.end();

      for (var i = 0; i < data.length; i++)
      {
        var media = data[i];
        var web_url = media.link;
        var image_url = media.images.standard_resolution.url;
        var caption = media.caption.text;

        console.log(caption + ' ' + web_url + ' ' + image_url);
      }
    });
  });
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function() {
  console.log("Listening on " + port);
});
