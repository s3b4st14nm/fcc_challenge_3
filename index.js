require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

//para los parametros
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Guarda en un ARRAY los links, en ninguna parte indica que debe ser BD!!!
let myURL = [];

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {

  let o =  req.body.url;
  let rs = {error: 'invalid url'};
    if (validateURL(o)) {
      
      if (myURL[o] == undefined) {
        myURL.push(o);
      }
      let s = myURL.indexOf(o);
      rs={
        original_url: o,
        short_url:    s
      };
      //console.log("original: "+o+", short: "+s);
      
    }
  console.log(rs);
  res.json(rs);
});

app.get('/api/shorturl/:short', function(req, res) {
  let s = Number(req.params.short);
  console.log("short: "+s+" url: "+myURL[s]);
  res.redirect(myURL[s]);
});

//http:a.co
function validateURL(url) {
  let rs=false;
  if (url.startsWith("http")>-1 && url.indexOf(":")>3 && url.indexOf(".")>4 && url.length>8) {
    rs=true;
  }
  return rs;
}

//--------------------------------------
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
