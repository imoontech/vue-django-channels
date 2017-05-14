<template>
  <div id="app">
    <img src="example/assets/logo.png">
    <h1></h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <div v-if="wsConnected">Connected to Websocket {{ $channels.socket.url }}</div>
    <div v-else="wsConnected">NOT Connected to Websocket {{ $channels.socket.url }}!</div>
    <button @click="sendEcho">Send App Echo</button>
    <br />
    <br />
    <my-component></my-component>
  </div>
</template>

<script>
import Vue from 'vue'
import VueDjangoChannels from '../src/index'
import MyComponent from './components/MyComponent.vue'

Vue.use(VueDjangoChannels, 'ws://localhost:8000/ws')

export default {
  name: 'app',
  components: {
      MyComponent
  },
  channels: {
    streams: {
      echo (action, stream) {
        if(action.src === 'app') {
          console.log('This is my App echo: received action: ' + JSON.stringify(action) + ' stream:' + stream)
        }
      }
    },
    events: {
      open () {
        console.log('Connected to WebSocket')
        this.wsConnected = true
      },
      close () {
        console.log('Disconnected from WebSocket')
        this.wsConnected = false
      }
    }
  },
  methods: {
    sendEcho: function () {
      let data = {
        time: Date.now(),
        msg: 'This is my App echo...',
        src: 'app'
      }

      this.$channels.stream('echo').send(data)
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      wsConnected: false
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
