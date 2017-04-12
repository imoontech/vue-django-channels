// based on [vue-websocket](https://github.com/icebob/vue-websocket)

import { WebSocketBridge } from 'django-channels';

let VueDjangoChannels = {

    install(Vue, url, protocols, options) {

        let webSocketBridge = new WebSocketBridge()

        webSocketBridge.connect(url, protocols, options);
        webSocketBridge.listen();

        Vue.prototype.$channels = webSocketBridge;
        Vue.prototype.$socket = webSocketBridge.socket;

        let addListeners = function () {
            if (this.$options["channels"]) {
                let conf = this.$options.channels;

                if (conf.events) {
                    let prefix = conf.prefix || "";
                    Object.keys(conf.events).forEach((key) => {
                        let func = conf.events[key].bind(this);
                        this.$socket.addEventListener(prefix + key, func);
                        conf.events[key].__binded = func;
                    });
                }
            }
        };

        let removeListeners = function () {
            if (this.$options["channels"]) {
                let conf = this.$options.channels;

                if (conf.events) {
                    let prefix = conf.prefix || "";
                    Object.keys(conf.events).forEach((key) => {
                        this.$socket.removeEventListener(prefix + key, conf.events[key].__binded);
                    });
                }
            }
        };

        let addStreamHandlers = function () {
            if (this.$options["channels"]) {
                let conf = this.$options.channels;

                if (conf.streams) {
                    Object.keys(conf.streams).forEach((stream) => {
                        let func = conf.streams[stream].bind(this);
                        this.$channels.demultiplex(stream, func);
                    });
                }
            }
        };

        Vue.mixin({
            // Vue v1.x
            beforeCompile: addListeners,
            // Vue v2.x
            beforeCreate: addListeners,

            created: addStreamHandlers,

            beforeDestroy: removeListeners
        });
    }
};

export default VueDjangoChannels;
