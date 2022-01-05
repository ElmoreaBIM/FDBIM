// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})

const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            //METODOS QUE ENVIAN DATOS DEL RENDERER O INDEX.JS AL MAIN.JS
            let validChannels = ["ElementoSeleccionado","Enviando","CarpetaParaAbrir",
            "DocumentoParaAbrir","UltimoRepositorioAbierto","DameUltimoRepo"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            //METODOS QUE ENVIAN DATOS DEL MAIN.JS AL  INDEX.JS O RENDERER
            let validChannels = ["DocumentosEncontrados","GUIDDelTipo","GUIDDelEjemplar","UltimoRepositorioLeido","EnsayosEncontrados","RevisionesEncontradas"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);
