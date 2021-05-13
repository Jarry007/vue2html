<template>
  <div id="app">
  
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <Drag></Drag>
  </div>
</template>

<script>

import Drag from './views/drag.vue' 
export default {
  name: 'App',
  components: {
    Drag
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
