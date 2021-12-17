import { IfcViewerAPI } from 'web-ifc-viewer';
import { Color } from 'three';



//AÑADIMOS ELEMENTOS DEL DOM COMO CONSTANTES
const input = document.getElementById("file-input");
const container = document.getElementById('viewer-container');
const BotonCargaIFC=document.getElementById("BotonCargaIFC");
const BotonDirectorio=document.getElementById("BotonCargaCarpeta");
const InputCarpeta= document.getElementById("input-folder");
const Tabla=document.getElementById("TablaDocumentos");
const ContenedorTabla=document.getElementById("viewer-tabla");
const BotonOcultarTabla=document.getElementById("BotonOcultarMostrar");
const BotonSubirTabla=document.getElementById("BotonSubirBajarTabla");
const VisorIFC=document.getElementById("viewer-container");
const BarraLateralDcha=document.getElementById("sidebar_right");
const BotonMostrarOcultarBarraLateralDerecha=document.getElementById("BotonEsconderMostrarBarraLateralDcha");
const PanelCentral=document.getElementById("PanelCentral");
const EncabezadoMod=document.getElementById("EncabezadoModelos");
const PanelMod=document.getElementById("PanelArbolModelos");
const EncabezadoProp=document.getElementById("EncabezadoPropiedades");
const PanelPropip=document.getElementById("PanelPropiedades");
const CajetinFamilia=document.getElementById("Familia");
const CajetinTipo=document.getElementById("Tipo");
const CajetinRepositorio=document.getElementById("ValorRepositorio");
const BotonPlanoCorte=document.getElementById("BotonPlanoCorte");


//AÑADIMOS VARIABLES PARA LA LÓGICA
let TablaVisible=true;
let VerVisor=true;
let VerLateral=true;
let EstadoPlegadoModelos=false;
let EstadoPlegadoProp=false;
let Repositorio;
let GUIDDelTipo;

let BotonPlanoCortePulsado=false;
let ifcCargado;

let ListaNombresIFCsCargados=[];
let ListaIfcsCargados=[];

//AÑADIMOS EL VISOR IFC

const viewer = new IfcViewerAPI({ container,backgroundColor:new Color(255,255,255) });
viewer.addAxes();
viewer.addGrid();
viewer.toggleClippingPlanes();//alterna entre ver o no ver planos de corte

input.addEventListener("change",

  async (changed) => {
   
    const file = changed.target.files[0];
    const ifcURL = URL.createObjectURL(file);
       
   
    const ifcCargado= await viewer.IFC.loadIfcUrl(ifcURL);
    console.log("Tipo)=",ifcCargado.type);
    ListaIfcsCargados.push(ifcCargado);

   
    PliegaDespliegaPanelModelos(PanelMod,EstadoPlegadoModelos);
    
     const Lista= await viewer.IFC.getAllItemsOfType(ListaIfcsCargados[0].type);
     alert(Lista.length);
  
    console.log(ListaIfcsCargados[0]);
  },

  false
);

//LEEMOS EL ULTIMO REPOSITORIO ALMACENADO SI EXISTE
LeerUltimoRepo();
function LeerUltimoRepo(){
  window.api.send("DameUltimoRepo","Hola");
}


//AÑADIMOS EL EVENTO AL BOTON DE CARGAR IFC
BotonCargaIFC.onclick=()=>input.click();

BotonDirectorio.onclick=()=>InputCarpeta.click();
input.onchange = (event) =>{
  
   const NombreIFCCargado = event.target.files[0].name;
  
   ListaNombresIFCsCargados.push(NombreIFCCargado);
   
   AñadirIFCAlPanel(NombreIFCCargado);
   
   

}

BotonPlanoCorte.onclick=()=>{
  viewer.toggleClippingPlanes();
 
 CambiarColorBoton(BotonPlanoCorte);
 
}




function CambiarColorBoton(Boton){
if(BotonPlanoCortePulsado==false)
{
  
  Boton.style.background="#da4f12";
  BotonPlanoCortePulsado=true;
}
else
{
  
  Boton.style.background="#da1239";
  BotonPlanoCortePulsado=false;
}

}
//PREVISUALIZAR ELEMENTOS AL PASAR POR ENCIMA
container.onmousemove= ()=>{
  
  viewer.IFC.prePickIfcItem();}

//SELECCIONAR ELEMENTO
container.ondblclick= async ()=>{
  const found=  await viewer.IFC.pickIfcItem(true);
  if(found===null|| found===undefined) return;

  
  
  const planes = viewer.context.getClippingPlanes();
  planes.forEach(planoCorte => {
    console.log("Plano",planoCorte);
         
  });
  
  const plano=viewer.addClippingPlane();
  // console.log("Planos",planes[0]);

  console.log("Este es el elemento seleccionado :",found);
   LimpiarTabla(Tabla);
   

  

//MOSTRAMOS PROPIEDADES


  // console.log("El elemento seleccionado es :",found);
  //PROPIEDADES DE EJEMPLAR
  const props= await viewer.IFC.getProperties(found.modelID,found.id,true);
   console.log("Propiedades del elemento:",props);
   console.log("Familia=",props.Name);
  //ID EJEMPLAR DE REVIT
  const IdRevit=props.Tag.value;
  // console.log("ID de Revit: ",IdRevit);
  document.getElementById("ValorIdEjemplar").innerHTML=IdRevit;
  //ID TIPO DE REVIT
  const IdTipoRevit=props.type[0].Tag.value;
  console.log("Propiedades de tipo= "+props.type);
  // console.log("ID tipo de Revit: ",IdTipoRevit);




 

  document.getElementById("ValorIdTipo").innerHTML=IdTipoRevit ;
  //Mostrar familia y tipo
  const CajetinFamilia= document.getElementById("Familia");
  const CajetinTipo= document.getElementById("Tipo");
  let FamiliaYTipo=props.Name;
  console.log("FamiliaYTipo",FamiliaYTipo);
  FamiliaYTipo=DecodeIFCString(FamiliaYTipo.value);
  const ListaSeparada= FamiliaYTipo.split(':');
  const Familia = ListaSeparada[0];
  const Tipo=ListaSeparada[1];
  CajetinFamilia.style.visibility="visible";
  CajetinTipo.style.visibility="visible";
  CajetinFamilia.innerHTML=Familia;
  CajetinTipo.innerHTML=Tipo;
  

  //Abrimos paneles de modelos y de propiedades
  
  PliegaDespliegaPanelModelos(PanelMod,EstadoPlegadoModelos);
  PliegaDespliegaPanelProp(PanelPropip,EstadoPlegadoProp);



  //PROPIEDADES DE TIPO

  updatePropertyMenu(props);
  //MOSTRAMOS ARRIBA LOS CAJETINES DE FAMILIA Y TIPO
  CajetinFamilia.visibility="visible";
  CajetinTipo.visibility="visible";
//AHORA VAMOS A MANDAR AL MAIN LOS DATOS
if(Repositorio==null)
{
  alert("Debes elegir la carpeta de repositorio de los archivos para poder visualizarlos, antes de seleccionar un elemento");
  return;
}


  var ES={
    Repo: Repositorio,
    IDTipo:IdTipoRevit,
    IDEjemplar:IdRevit
  }
  


 //  Mandamos el ID del elemento al proceso Main
 // window.api.send("toMain",IdTipoRevit);
 window.api.send("ElementoSeleccionado",ES);
 

     
}
// Called when message received from main process
window.api.receive("DocumentosEncontrados", (data) => {
      console.log(`Received ${data} from main process`);
      console.log("Recibido"+data);
      data.forEach(doc => {
     console.log(doc.Nombre[0]+"/"+doc.Archivo[0]);
     AñadirDocumentoATabla(doc,Repositorio);
     
  });
});

window.api.receive("GUIDDelTipo", (data) => {GUIDDelTipo=data;});
window.api.receive("UltimoRepositorioLeido", (data) => {
 
 
  CajetinRepositorio.innerHTML=data;
  Repositorio=data;

});


// const dato=300;
// // Send a message to the main process
// window.api.send("toMain", dato);


//EVENTOS OCULTAR/MOSTRAR
BotonOcultarTabla.addEventListener('click',()=>{
 
  if(TablaVisible===true)
  {
    PanelCentral.style.height='84vh';
    VisorIFC.style.height='84vh';
    BarraLateralDcha.style.height='84vh';
    TablaVisible=false;
  }
  else{
   
    PanelCentral.style.height='62vh';
    VisorIFC.style.height='62vh';
    BarraLateralDcha.style.height='62vh';
    TablaVisible=true;
  }
},true);
BotonSubirTabla.addEventListener('click',()=>{
  
  if(VerVisor===true)
  {
    BarraLateralDcha.style.visibility='hidden';
    BotonSubirTabla.className="lnr lnr-chevron-down";
    VisorIFC.style.height='0vh';
    PanelCentral.style.height='0vh';
   
    BarraLateralDcha.style.height='0vh';
    
    ContenedorTabla.style.height='100vh';
    VerVisor=false;
  }
  else{
    
    BotonSubirTabla.className="lnr lnr-chevron-up";
    PanelCentral.style.height='62vh';
    
    BarraLateralDcha.style.height='62vh';
    
    VisorIFC.style.height='62vh';
    ContenedorTabla.style.height='24vh';
    BarraLateralDcha.style.visibility='visible';
    VerVisor=true;
  }
  
},true);
BotonMostrarOcultarBarraLateralDerecha.addEventListener('click',()=>{
  
  if(VerLateral===true)
  {
    BotonMostrarOcultarBarraLateralDerecha.className="lnr lnr-chevron-left";
    VisorIFC.style.width='98vw';
    
    BarraLateralDcha.style.width='2vw';
    VerLateral=false;
  }
  else{
    BotonMostrarOcultarBarraLateralDerecha.className="lnr lnr-chevron-right";
    BarraLateralDcha.style.width='20vw';
    VisorIFC.style.width='80vw';
    
    VerLateral=true;
  }
  
},true);


//SELECCION DIRECTRORIO

let Ruta=null;
InputCarpeta.onchange = (event) =>{
    
     const ListaArchivos = event.target.files;
    
     DameDirectorioDeArchivo(ListaArchivos[0]);

      const RutaTexto=ListaArchivos[0].path;
    
      const Nombre=ListaArchivos[0].name;
      const SoloCarpeta= RutaTexto.replace(Nombre,"");
      

      CajetinRepositorio.innerHTML=SoloCarpeta;
      CajetinRepositorio.style.color="rgb(107,142,35)";
      
      
      const ArchivoXML=ListaArchivos[0];
      Ruta=ArchivoXML.path;
      LimpiarTabla(Tabla);
      Repositorio=SoloCarpeta;
      window.api.send("UltimoRepositorioAbierto",Repositorio);
      AñadirDocumentosATabla(SoloCarpeta);
     

    

  
    
}
//AÑADIR IFC CARGADO AL PANEL
function AñadirIFCAlPanel(NombreIFC, ModeloIFC){
  const root=document.createElement('div');
  root.classList.add('property-root');

  const labelCheck=document.createElement('label');



  const activacion=document.createElement('div');
  activacion.classList.add('switch');

  

  activacion.appendChild(labelCheck);

  const inputcheck=document.createElement('input');
  inputcheck.type="checkbox";
  inputcheck.checked="true";


  const spancheck=document.createElement('span');
  spancheck.classList.add('lever');

  
  
  
  labelCheck.appendChild(inputcheck);
  labelCheck.appendChild(spancheck);
  root.appendChild(activacion);
 






  //Nombre del modelo
  const DivModeloCargado=document.createElement('div');
  DivModeloCargado.classList.add('property-name');
  DivModeloCargado.textContent=NombreIFC;
  root.appendChild(DivModeloCargado);

  const PanelArbolModelos=document.getElementById("PanelArbolModelos");
  PanelArbolModelos.appendChild(root);
  let NumeroOrdenDelIFC=ListaIfcsCargados.length;
 
  //Añadimos el evento cuando cambie 
  inputcheck.addEventListener("change", function( event) {
    
    
      
    
    alert(NumeroOrdenDelIFC);
    ListaIfcsCargados[NumeroOrdenDelIFC].visible=!ListaIfcsCargados[NumeroOrdenDelIFC].visible;
    console.log(viewer.context.items.pickableIfcModels);
      

    // const Lista= await viewer.IFC.getAllItemsOfType(ListaIfcsCargados[0].type);
  
    
 
    
   
  }, true);

}

function DameDirectorioDeArchivo(file)
{
    const Ruta=file.path;
    const Nombre=file.name;
    const SoloDirectorio=Ruta.replace(Nombre,"");
    return SoloDirectorio;   
}
function LimpiarTabla(Tabla)
{
  
    Tabla.textContent = '';
}
function AñadirDocumentosATabla(Carpeta)
{
   
    const CarpetaDocumentos=Carpeta+"DOCUMENTOS_ELEMENTOS";
   
 
    var fs=require('fs');
    var files=fs.readdirSync(CarpetaDocumentos);
       
    files.forEach(file => {
        const Ruta=CarpetaDocumentos+'\\'+file;
        
        const RutaDatos=Ruta+'\\'+"DATOS.xml";
        
       DameDocumentosDelElemento(RutaDatos,"449665");
      



        

        
    });
  
   
 

}
function DameDocumentosDelElemento(Ruta,IDBuscada){

    console.log("la ruta es ",Ruta);
      var fs = require('fs'),
      xml2js = require('xml2js');
  
  var parser = new xml2js.Parser();
  fs.readFile(Ruta, function(err, data) {
      parser.parseString(data, function (err, result) {
          console.dir(result);
          //Parametros y Parametro son el nombre de la raiz y del primer nodo y nombre es el primer nodo de parametros
          // console.log("NombrePrimerParametro",result.Parametros.Parametro[0].$.nombre);
          
          console.log("ID",result.Datos.ID[0]);
          if(result.Datos.ID[0]===IDBuscada)
          {
           
              const ListaDocs=result.Datos.Documento;
              console.log("Documentos",ListaDocs);
              ListaDocs.forEach(Doc => {
                  console.log("Documento=",Doc);
                  Ruta=Ruta.replace("DATOS.xml","");
                  console.log("Ruta",Ruta);
                  //AHORA LO AÑADIMOS A LA TABLA
                  AñadirDocumentoATabla(Doc,Ruta);
              });
  
              
          }
         
          
          
      });
  });
   
  }
  function AñadirDocumentoATabla(Documento,Ruta){
    const Tabla=document.getElementById("TablaDocumentos");
    var NuevaFila = document.createElement('a');
    NuevaFila.className='collection-item';
    NuevaFila.href="#!";
   

    // <i class="material-icons">remove_red_eye</i>
   

   
//   NuevaFila.classList='collection-item';
    NuevaFila.innerHTML=Documento.Nombre+" ("+Documento.Archivo+")";
    NuevaFila.style.cursor="auto";
    NuevaFila.style.color="#dc143c";
    
   

    Tabla.appendChild(NuevaFila);


    const NuevoSpan=document.createElement('span');
    NuevoSpan.className='badge';
    NuevoSpan.style.textAlign='right';
    NuevaFila.appendChild(NuevoSpan);
    NuevaFila.addEventListener("mouseover", function( event ) {
        // highlight the mouseover target
        event.target.style.fontWeight="bolder";
        // event.target.style.backgroundColor="#ffdedb";
        // NuevoSpan.backgroundColor="#ffdedb";
        
       
      
      }, true);
      NuevaFila.addEventListener("mouseleave", function( event ) {
        // highlight the mouseover target
        event.target.style.fontWeight="normal";
        // event.target.style.backgroundColor="white";
        // NuevoSpan.backgroundColor="white";
        
       
      
      }, true);


      //CREAMOS ICONO CARPETA
    const NuevoIconoCarpeta= document.createElement('i');
    NuevoIconoCarpeta.className='material-icons';
    NuevoIconoCarpeta.innerHTML="folder_open";
    NuevoIconoCarpeta.style.color="#dc143c";
      //y su tooltip
    const CustomToolTip=document.createElement('span');
    CustomToolTip.className='tooltiptext';
    CustomToolTip.innerHTML="Open in folder";
    
    NuevoSpan.appendChild(CustomToolTip);
    NuevoSpan.append(NuevoIconoCarpeta);
     //y sus eventos
    NuevoIconoCarpeta.addEventListener("mouseover", function( event ) {
        // highlight the mouseover target
        event.target.style.color = "white";
        event.target.style.cursor='pointer';
        CustomToolTip.innerHTML="View in folder";
        CustomToolTip.style.visibility='visible';
        
     
      
      }, true);
      NuevoIconoCarpeta.addEventListener("mouseleave", function( event ) {
        // highlight the mouseover target
        event.target.style.color = "#dc143c";
        CustomToolTip.style.visibility='hidden';
      
      }, true);
     
      NuevoIconoCarpeta.onclick=function(){
        const CarpetaAAbrir=Ruta+"DOCUMENTOS_ELEMENTOS\\"+GUIDDelTipo+"\\"+Documento.Archivo;
                 
        window.api.send("CarpetaParaAbrir",CarpetaAAbrir);
        
    }

   //CREAMOS ICONO OJO
    const Nuevoi=document.createElement('span');
    NuevaFila.appendChild(Nuevoi);
    const NuevoIconoOjo= document.createElement('i');
    NuevoIconoOjo.className='material-icons';
    NuevoIconoOjo.innerHTML="remove_red_eye";
    NuevoIconoOjo.style.textAlign='right';
    NuevoIconoOjo.style.color="#dc143c";
   
    NuevoIconoOjo.addEventListener("mouseover", function( event ) {
        // highlight the mouseover target
        event.target.style.color = "white";
        event.target.style.cursor='pointer';
        CustomToolTip.innerHTML="Open document";
        CustomToolTip.style.visibility='visible';
      
      }, true);
      NuevoIconoOjo.addEventListener("mouseleave", function( event ) {
        // highlight the mouseover target
        event.target.style.color = "#dc143c";
        CustomToolTip.style.visibility='hidden';
      
      }, true);
    
    NuevoIconoOjo.onclick=function(){
      const DocAAbrir=Ruta+"DOCUMENTOS_ELEMENTOS\\"+GUIDDelTipo+"\\"+Documento.Archivo;
                 
      window.api.send("DocumentoParaAbrir",DocAAbrir);
      
    }
    NuevoSpan.append(NuevoIconoOjo);
        
    
    
    
    
}

//Abrimos paneles de modelos y de propiedades
EstadoPlegadoModelos=false;
EstadoPlegadoProp=false;
EncabezadoMod.onclick =()=>{PliegaDespliegaPanelModelos(PanelMod,EstadoPlegadoModelos);}
EncabezadoProp.onclick =()=>{PliegaDespliegaPanelProp(PanelPropip,EstadoPlegadoProp);}


function PliegaDespliegaPanelModelos(Panel,EstadoDesplegado){
 
  const Flecha=document.getElementById("FlechaModelos");
    if(EstadoDesplegado==true)
    {
      Panel.style.height=0;
      EstadoPlegadoModelos=false;
      Flecha.classList.add("lnr-chevron-down")
      return;
    }
    else
    {
      const NumeroIfcs=ListaIfcsCargados.length;
      const AlturaPanel=NumeroIfcs*5;
      const unir=AlturaPanel.toString()+"vh";
      
      Panel.style.height=unir;

      // Panel.style.height="30vh";
      EstadoPlegadoModelos=true;
      Flecha.classList.replace("lnr-chevron-down","lnr-chevron-up");
      return;
    }
}
function PliegaDespliegaPanelProp(Panel,EstadoDesplegado){
  const Flecha=document.getElementById("FlechaPropiedades");
  if(EstadoDesplegado==true)
    {
      Panel.style.height=0;
      EstadoPlegadoProp=false;
      Flecha.classList.add("lnr-chevron-down")
      return;
    }
    else
    {
      Panel.style.height="40vh";
      EstadoPlegadoProp=true;
      Flecha.classList.replace("lnr-chevron-down","lnr-chevron-up");
      return;
    }
}


function updatePropertyMenu(props) {

  const PanelProp=document.getElementById("PanelPropiedades");

 removeAllChildren( PanelProp);

  const mats=props.mats;
  const psets=props.psets;
  const type=props.type;
  
  delete props.mats;
  delete props.psets;
  delete props.type;

   for(let propertyName in props){
     
 let propValue= props[propertyName];
 
//  console.log("ValorEncontrado:",propValue.value)
if(propValue===null  || propValue===undefined)
{
  
}
else{
  propValue= DecodeIFCString(propValue.value)
}

   createPropertyEntry(propertyName+":", propValue);
    
  }
  

}


function createPropertyEntry(key, propertyValue)
{
  
  const root=document.createElement('div');
  root.classList.add('property-root');
  
  

  //Nombre de la propiedad
  const keyElement=document.createElement('div');
  keyElement.classList.add('property-name');
  keyElement.textContent=key;
  root.appendChild(keyElement);

  //Valor de la propiedad

  if(propertyValue===null|| propertyValue===undefined) {propertyValue="Nothing"}
  else if(propertyValue.value) propertyValue= propertyValue.value;

  const valueElement=document.createElement('div');
  valueElement.textContent=propertyValue;
  valueElement.classList.add('property-value');
  root.appendChild(valueElement);




  const PanelProp=document.getElementById("PanelPropiedades");
  PanelProp.appendChild(root);
//  GUI.props.appendChild(root);

}