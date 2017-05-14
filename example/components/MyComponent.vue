<template>
  <div class="border">
    <div class="monospace">MyComponent wsConnected = <span :text-content.prop="wsConnected"></span></div>
    <button @click="sendEcho">Send Component Echo</button>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'my-component',
  channels: {
    streams: {
      echo (action, stream) {
        if(action.src === 'component') {
          console.log('This is the echo callback in MyComponent: received action: ' + JSON.stringify(action) + ' stream:' + stream)
        }
      },
      tallydata (action, stream) {
        console.log('This is my component tallydata: received action: ' + JSON.stringify(action) + ' stream: ' + stream);
      }
    },
    events: {
      open () {
        console.log('MyComponent can see that we are connected to WebSocket')
        this.wsConnected = true
      },
      close () {
        console.log('MyComponent can see that we are disconnected from WebSocket')
        this.wsConnected = false
      }
    }
  },
  methods: {
    sendEcho: function () {
      let data = {
        time: Date.now(),
        msg: 'This is my component echo...',
        src: 'component'
      }

      this.$channels.stream('echo').send(data);
    }
  },
  data () {
    return {
      wsConnected: false
    }
  }
}
</script>

<style lang="scss">
.monospace {
  font-family: 'Consolas', 'Courier New', 'Lucida Console', sans-serif;
}

.border {
  border: gray solid 1px;
  border-radius: 5px;
  padding: 1em;
}
</style>
