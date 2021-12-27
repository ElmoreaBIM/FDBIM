// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const express = require ('express');
const fs = require("fs");
const { join } = require('path');
const { stringify } = require('querystring');

// Start local server to get WASM file. Maybe there is a better way to do this
const exApp = express();
exApp.use(express.static(__dirname + '/wasm'));
exApp.listen(3000);

let mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon:path.join(__dirname+'/src/LOGO_FINAL_DOCS.png'),
        autoHideMenuBar:true,
        
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false // turn off remote
        
        }
        
    })

    // and load the index.html of the app.
    mainWindow.maximize();
    mainWindow.loadFile('src/index.html')
    

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

   
    
   
    
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// ipcMain.on("toMain", (event, args) => {
//     fs.readFile("asdf.txt", (error, data) => {
//         // Do something with file contents
      
//         // Send result back to renderer process
//         mainWindow.webContents.send("fromMain", data);
//         AbrirArchivo("asdf.txt");
//     })
// });
ipcMain.on("Enviando", (event, args) => {
    fs.readFile("asdf.txt", (error, data) => {
        // Do something with file contents
      
        // Send result back to renderer process
       console.log("Hemos recibido con una segunda orden");
        
    })
});
ipcMain.on("ElementoSeleccionado", (event, args) => {
    
        console.log("Hemos seleccionado el elemento ",args);
    //    let Archivo=args.IDTipo+".txt";
       let IdEjemplarDelElementoSeleccionado=args.IDEjemplar;
       let IdTipoDelElementoSeleccionado=args.IDTipo;
       let CarpetaRepositorio=args.Repo;
       console.log("Has seleccionado en el renderer el elemento ",IdEjemplarDelElementoSeleccionado+" y el repositorio es "+CarpetaRepositorio);
       //AQUI RECIBIMOS EL OBJETO SELECCIONADO EN EL RENDERER O INDEX.JS
       //AHORA VAMOS A BUSCAR SI EXISTE EL DOCUMENTO EN LA CARPETA SELECCIONADA


       
       const listaDocumentosDelElemento= EnviaDocumentosDelElementoSeleccionadoAlRenderer(CarpetaRepositorio,IdTipoDelElementoSeleccionado)
       console.log("Resultado=", listaDocumentosDelElemento);

    
        //  fs.readFile(Archivo,(error,data)=>{
        //     console.log("Leido ",data);
        //     AbrirArchivo(Archivo);
        //     mainWindow.webContents.send("fromMain","hemos leido el archivo");
        //  })
    
        
   
});
ipcMain.on("CarpetaParaAbrir", (event, args) => {AbrirCarpetaContenedora(args);});
ipcMain.on("UltimoRepositorioAbierto", (event, args) => {GuardarConfiguracionUltimoRepositorio(args);});
ipcMain.on("DocumentoParaAbrir", (event, args) => {AbrirArchivo(args);});
ipcMain.on("DameUltimoRepo", (event, args) => {LeerUltimoRepositorio(args);});
    


function  EnviaDocumentosDelElementoSeleccionadoAlRenderer(Carpeta,IdDelTipo)
{
       
    const CarpetaDocumentos=Carpeta+"DOCUMENTOS_ELEMENTOS";
    var fs=require('fs');
    var files=fs.readdirSync(CarpetaDocumentos);
    files.forEach(file => {
        const Ruta=CarpetaDocumentos+'\\'+file;
        
        const RutaDatos=Ruta+'\\'+"DATOS.xml";
               
        var fs = require('fs'),
        xml2js = require('xml2js');
    
        var parser = new xml2js.Parser();
        fs.readFile(RutaDatos, function(err, data) {
           parser.parseString(data, function (err, result) {
            
            if(result.Datos.ID[0]===IdDelTipo)
            {
             
                 const ListaDocs=result.Datos.Documento;
                 console.log("encontrados ",ListaDocs);
                 mainWindow.webContents.send("DocumentosEncontrados",ListaDocs);
                 mainWindow.webContents.send("GUIDDelTipo",file);
               
                 }
            }
           
           )    
            
        });
    });


    // DameDocumentosDelElemento(RutaDatos,IdDelTipo);
}
function AbrirCarpetaContenedora(Ruta)
{
    console.log("Hemos llegao al metodo abrir carpeta de ",Ruta);
    const {shell} = require('electron') // deconstructing assignment
    shell.showItemInFolder(Ruta) // Show the given file in a file manager. If possible, select the file.
   
}
function AbrirArchivo(Ruta){
    const {shell} = require('electron') // deconstructing assignment
    shell.openPath(Ruta) // Open the given file in the desktop's default manner.

}
function GuardarConfiguracionUltimoRepositorio(Contenido)
{
  

    const fs = require('fs');
    const DirectorioDatosAplicacion=app.getPath('userData')+"\\";
    var dir = DirectorioDatosAplicacion+'FINAL_DOCS';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const Archivo= dir+"\\UltimoRepositorio.txt";
    try { fs.writeFileSync(Archivo, Contenido, 'utf-8'); }
    catch(e) { console.log('Failed to save the file !'); }
}
function LeerUltimoRepositorio()
{
   
    const fs = require('fs');
    const DirectorioDatosAplicacion=app.getPath('userData')+"\\";
    var dir = DirectorioDatosAplicacion+'FINAL_DOCS';
    const Archivo= dir+"\\UltimoRepositorio.txt";



    if(fs.existsSync(Archivo))
    {
      
        try{
            fs.readFile(Archivo, 'utf8', function (err,data) {
                if (err) {
                  return console.log(err);
                }
                mainWindow.webContents.send("UltimoRepositorioLeido",data);
                console.log("en el archivo hemos encontrado "+data);
             
                
              });
        }
        catch
        {

        }
      
    }

    
}





