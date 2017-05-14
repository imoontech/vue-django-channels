// based on [vue-websocket](https://github.com/icebob/vue-websocket)

import { WebSocketBridge } from './WebSocketBridge.js';

let VueDjangoChannels = {

    install(Vue, url, protocols, options) {

        let webSocketBridge = new WebSocketBridge()

        webSocketBridge.connect(url, protocols, options);
        webSocketBridge.listen();

        Vue.prototype.$channels = webSocketBridge;

        let addListeners = function () {
            if (this.$options["channels"]) {
                let conf = this.$options.channels;

                if (conf.events) {
                    let prefix = conf.prefix || "";
                    Object.keys(conf.events).forEach((key) => {
                        let func = conf.events[key].bind(this);
                        this.$channels.socket.addEventListener(prefix + key, func);
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
                        this.$channels.socket.removeEventListener(prefix + key, conf.events[key].__binded);
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

        let removeStreamHandlers = function () {
            if (this.$options["channels"]) {
                let conf = this.$options.channels;

                if (conf.streams) {
                    Object.keys(conf.streams).forEach((stream) => {
                        this.$channels.removeStreamHandler(stream, conf.streams[stream].__binded);
                    });
                }
            }
        };

        let removeHandlers = function () {
            removeListeners();
            removeStreamHandlers();
        };

        Vue.mixin({
            // Vue v1.x
            beforeCompile: addListeners,
            // Vue v2.x
            beforeCreate: addListeners,

            created: addStreamHandlers,

            beforeDestroy: removeHandlers
        });
    }
};

export default VueDjangoChannels;
