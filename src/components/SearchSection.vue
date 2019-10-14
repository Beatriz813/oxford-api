<template>
  <div>
    <div class="row">
      <div class="col-10 q-pa-md">
        <q-select v-model="campo" :options="campos"/>
        <q-input type="search" @keyup.enter="pesquisa()" v-model="palavra" label="Pesquisar">
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" @click="pesquisa()"/>
          </template>
        </q-input>
      </div>
      <audio controls v-if="pronuncia" v-bind:src="pronuncia"></audio>
    </div>
    <div class="row">
      <div class="col-8 q-pl-md">
        <p :key="index" v-for="(elemento, index) in mostrar"> {{ elemento }} </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchSection',
  data () {
    return {
      palavra: '',
      pronuncia: '',
      campo: '',
      dados: '',
      mostrar: [],
      campos: [
        { label: 'Pronúncia', value: 'pronunciations' },
        { label: 'Definições', value: 'definitions' },
        { label: 'Domínios', value: 'domains' },
        { label: 'Etimologia', value: 'etymologies' },
        { label: 'Exemplos', value: 'examples' },
        { label: 'Regiões', value: 'regions' },
        { label: 'Registros', value: 'registers' },
        { label: 'Variações da Palavra', value: 'variantForms' }
      ]
    }
  },
  methods: {
    pesquisa () {
      this.$axios.get(`/${this.campo.value}/${this.palavra}`)
        .then(resposta => {
          this.dados = resposta.data.results[0].lexicalEntries
          console.log('resposta', resposta)
          switch (this.campo.value) {
            case 'definitions':
              this.dados.forEach(elemento => {
                elemento.entries.forEach(entry => {
                  this.mostrar = entry.senses.map((sense) => {
                    console.log(sense.definitions)
                    return sense.definitions
                  })
                })
              })
              console.log(this.mostrar)
              break
            case 'domains':
              this.dados.forEach((elemento) => {
                elemento.entries.forEach(entry => {
                  entry.senses.forEach(sense => {
                    this.mostrar = sense.subsenses.map(subsense => subsense.domains[0].text)
                  })
                })
              })
              break
            case 'pronunciations':
              this.pronuncia = this.dados[0].pronunciations[0].audioFile
              break
          }
          // this.pronuncia = resposta.data.results[0].lexicalEntries[0].pronunciations[0].audioFile
          // console.log(typeof this.pronuncia)
        })
    }
  }
}
</script>
