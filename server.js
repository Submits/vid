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

var response = await fetch(ret.data.video)
const data = await response.headers
        const html = `<!DOCTYPE html>
  <head>
  <meta name="twitter:card" content="player">
<meta name="twitter:player" content="` + ret.data.video + `">
<meta property="og:title" content="` + ret.data.title + `">
<meta property="og:site_name" content="` + data.get('content-disposition').split("filename=")[1] + " [" + (( Math.round(((data.get('content-length') / 1024) / 1024) * 100)) / 100 + " MB]") + `">
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
          <h2>` + data.get('content-disposition').split("filename=")[1] + " [" + (( Math.round(((data.get('content-length') / 1024) / 1024) * 100)) / 100 + " MB]") + `</h2>
        <video width="50%" controls>
            <source src="https://cdn.discordapp.com/attachments/971018418931236887/976933891371839558/video2.mp4" type="video/mp4">
          </video>
</body>`


res.send(html)

 
})
 .catch(function(err){

res.send("The resource you have requested is not available.")
   
 })

  }
}
)





app.listen(3000, () => {
  console.log("Ready")
})


module.exports = app;
