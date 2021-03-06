const express = require('express');
const app = express();
const fetch = require("cross-fetch")
var faunadb = require("faunadb"),
  q = faunadb.query

    var client = new faunadb.Client({
    secret: 'fnAEm5Q9keAAxrDn7lz3-9Mx5odNX8z6EmxLw2SV',
    domain: 'db.eu.fauna.com',
    scheme: 'https',
  })


 app.get('/admin/control', function(req, res) {

    res.sendFile('control.html', {root: __dirname })
        
});

app.get('/:id', async(req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

   let idd = req.params.id

  
  if(idd == "favicon.ico" || idd == "requestProvider.js.map")
  {
    res.send("NO")
  }
  else{
console.log(idd)
 client.query(
  q.Get(
    q.Match(q.Index('embed_by_id'), idd)
  )
)
.then(async function(ret){ 

var response = await fetch(ret.data.media)
const data = await response.headers
let media = ""
  let filename = ""
  let content = ""
if(ret.data.type == "image"){
  
 media = `<meta name="twitter:card" content="summary_large_image">
 <meta property="og:image" content="` + ret.data.media + `">
 ` 
  content = `<img style="width:50%; border-radius:5px" src="` + ret.data.media + `">`
}
else if(ret.data.type == "video"){
  
  media = `<meta name="twitter:card" content="player">
<meta name="twitter:player" content="` + ret.data.media + `">`
content = ` <video width="50%" controls>
            <source src="` + ret.data.media + `">
          </video>`  
}

  try{
    filename = data.get('content-disposition').split("filename=")[1]
  }
  catch{
    filename = "unknown"
  }
  
        const html = `<!DOCTYPE html>
  <head>
 ` + media + `
<meta property="og:title" content="` + ret.data.title + `">
<meta property="og:site_name" content="` + filename + " [" + (( Math.round(((data.get('content-length') / 1024) / 1024) * 100)) / 100 + " MB]") + `">
<meta property="theme-color" content="` + "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}) + `">
</head>
<style>
*{
    font-family: sans-serif;
    color: white;
}
body{
    background-color: #252525;
    text-align: center;
    margin: auto;
    width: 50%;
    padding-top: 100px;
    padding-bottom: 100px;
}
video{
    border-radius: 5px;
}
</style>
<body>
          <h2>` + filename + " [" + (( Math.round(((data.get('content-length') / 1024) / 1024) * 100)) / 100 + " MB]") + `</h2>
        ` + content + `
</body>`


res.send(html)

 
})
 .catch(function(err){
console.log(err)
res.send("The resource you have requested is not available. - " + err.toString())
   
 })

  }
}
)





app.listen(3000, () => {
  console.log("Ready")
})


module.exports = app;
