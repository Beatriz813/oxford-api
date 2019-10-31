const https = require('https')
const app = require('express')()
const cors = require('cors')

const appId = '1164be52' // insert your APP Id
const appKey = '2098d3171e9755cde1e03c6a4a30d0b5' // insert your APP Key
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
      'app_id': appId,
      'app_key': appKey
    }
  }
  // Fazendo a requisição para a API Oxford
  https.get(options, (resp) => {
    resp.on('data', (d) => {
      body += d
    })
    resp.on('end', () => {
      body = JSON.parse(body)
      let resposta = []
      let entradasLexicais = []
      if (req.params.campo === 'pronunciations') {
        // res.end(JSON.stringify(body))
        entradasLexicais = body.results.find((resultados) => {
          return resultados.lexicalEntries.find(elemento => elemento.pronunciations)
        })
        res.end(JSON.stringify(entradasLexicais))
      } else {
        entradasLexicais = body.results.filter(elemento => elemento.lexicalEntries.length > 0) // Só vai retornar os objetos com a propriedade lexicalEntries
        entradasLexicais.forEach(resultados => {
          resultados.lexicalEntries.forEach(entradas => {
            resposta = resposta.concat(entradas.entries)
          })
        })
      }
      res.end(JSON.stringify(resposta))
      body = ''
    })
  })
  res.on('error', (e) => {
    console.log(e)
    res.end('Deu ruim')
  }) // on error
})

app.listen(3000)
