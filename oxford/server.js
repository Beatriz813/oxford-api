const https = require("https")
const app = require('express')()
const cors = require('cors')

const app_id = "1164be52" // insert your APP Id
const app_key = "2098d3171e9755cde1e03c6a4a30d0b5" // insert your APP Key
let wordId = ''
const fields = "pronunciations"
const strictMatch = "false"
let body = ''
// Header para a requisição Oxford

app.use(cors())

app.get('/:palavra', (req, res) => {
  wordId = req.params.palavra
  const options = {
    host: 'od-api.oxforddictionaries.com',
    port: '443',
    path: '/api/v2/entries/en-gb/' + wordId + '?fields=' + fields + '&strictMatch=' + strictMatch,
    method: 'GET',
    headers: {
      'app_id': app_id,
      'app_key': app_key
    }
  }
  // Fazendo a requisição para a API Oxford
  https.get(options, (resp) => {
      resp.on('data', (d) => {
          body += d
      })
      resp.on('end', () => {
          res.end(body)
          body = ''
      })
      resp.on('error', (e) => {
        console.log(e)
      })
  })
})

app.listen(3000)