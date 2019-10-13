<template>
  <div>
    <q-input type="search" v-model="palavra"/>
    <q-btn @click="pesquisa()" label="Pesquisar"/>
  </div>
</template>

<script>
export default {
  name: 'SearchSection',
  data () {
    return {
      palavra: ''
    }
  },
  methods: {
    pesquisa () {
      this.$axios.get(`/${this.palavra}`)
        .then(resposta => {
          console.log('resposta', resposta.data)
        })
    }
  }
}
</script>
