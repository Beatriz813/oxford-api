const https = require('https')
const app = require('express')()
const cors = require('cors')

const app_id = '1164be52' // insert your APP Id
const app_key = '2098d3171e9755cde1e03c6a4a30d0b5' // insert your APP Key
let wordId = ''
const fields = 'pronunciations'
const strictMatch = 'false'
let body = ''
// Header para a requisição Oxford

app.use(cors())

app.get('/:campo/:palavra', (req, res) => {
  const options = {
    host: 'od-api.oxforddictionaries.com',
    port: '443',
    path: '/api/v2/entries/en-gb/' + req.params.palavra + '?fields=' + req.params.campo + '&strictMatch=' + strictMatch,
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
          body = JSON.parse(body)
          let resposta = {}
          // res.end(Buffer.from(body))
          // console.log(body.results)
          body.results.forEach(resultados => {
            if (resultados.lexicalEntries) {
              console.log(resultados.lexicalEntries.map(conteudo => conteudo.entries))
            }
          })
          body = ''
      })
      resp.on('error', (e) => {
        console.log(e)
        res.end('Deu ruim')
      })
  })
})

app.listen(3000)