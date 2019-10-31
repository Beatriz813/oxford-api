const https = require('https')
const app = require('express')()
const cors = require('cors')

const appId = 'c2e7b1fe' // insert your APP Id
const appKey = 'c36dcd311d964bfd7041f090522ec733' // insert your APP Key
const strictMatch = 'false'
let dados = ''
app.use(cors())

app.get('/sentences/:palavra', (req, res) => {
  const options = {
    host: 'od-api.oxforddictionaries.com',
    port: '443',
    path: '/api/v2/sentences/en/' + req.params.palavra + '?strictMatch=' + strictMatch,
    method: 'GET',
    headers: {
      'app_id': appId,
      'app_key': appKey
    }
  }
  https.get(options, (respostaApi) => {
    respostaApi.on('data', (data) => {
      dados += data
    })

    respostaApi.on('end', () => {
      dados = JSON.parse(dados)
      console.log(dados)
      dados.results.forEach(resultado => {
        resultado.lexicalEntries.forEach(entrada => {
          entrada.sentences.forEach((sentenca, posicao) => {
            if (posicao === 0) console.log('-'.repeat(100))
            console.log(`${posicao} -  ${sentenca.text} \n`)
          })
        })
      })
      dados = ''
      // let resposta = []
    })
  })
})

app.listen(3000, () => console.log('servidor rodando'))
