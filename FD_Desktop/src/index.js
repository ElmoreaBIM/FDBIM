import { IfcViewerAPI } from 'web-ifc-viewer';
import { Color } from 'three';
import { IfcViewer } from 'web-ifc-viewer';
import {init} from 'jquery';






//AÑADIMOS ELEMENTOS DEL DOM COMO CONSTANTES

const input = document.getElementById("file-input");
const container = document.getElementById('viewer-container');
const BotonCargaIFC=document.getElementById("BotonCargaIFC");
const BotonDirectorio=document.getElementById("BotonCargaCarpeta");
const InputCarpeta= document.getElementById("input-folder");
const ViewerTabla=document.getElementById("viewer-tabla");
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
const CajetinFamilia= document.getElementById("Familia");
const CajetinTipo= document.getElementById("Tipo");
const CajetinRepositorio=document.getElementById("ValorRepositorio");
const BotonSeleccionar=document.getElementById("BotonSelect");
const BotonAñadirPlanoCorte=document.getElementById("BotonAñadirPlanoCorte");
const BotonBorrarPlanosDeCorte=document.getElementById("BotonBorrarPlanosDeCorte");
const BotonPlanoCorte=document.getElementById("BotonPlanoCorte");
const BotonVerElementosRevisados=document.getElementById("BotonVerRevisiones");

const BotonDocumentos=document.getElementById("BotonDocumentos");
const BotonRevisiones=document.getElementById("BotonRevisiones");
const BotonEnsayos=document.getElementById("BotonEnsayos");

const ElementoNumeroDocumentos=document.getElementById("NumeroDocs");
const ElementoNumeroEnsayos=document.getElementById("NumeroEnsayos");
const ElementoNumeroRevisiones=document.getElementById("NumeroRevisiones");

let CanvasDelIfc = undefined;


//AÑADIMOS VARIABLES PARA LA LÓGICA
let TablaVisible=true;
let VerVisor=true;
let VerLateral=true;
let EstadoPlegadoModelos=false;
let EstadoPlegadoProp=false;
let Repositorio;
let GUIDDelTipo;
let GUIDDelEjemplar;

let BotonPlanoCortePulsado=false;
let BotonSeleccionarPulsado=false;
let ifcCargado;
let TipoDocumentoActivo;

let ListaNombresIFCsCargados=[];
let ListaIfcsCargados=[];

let ListaRevisionesDelElementoSeleccionado=[];
let ListaLineasRevision=[];




const viewer = AÑADIR_EL_VISOR_IFC();

LeerUltimoRepo();
AÑADE_EVENTO_AL_BOTON_SELECCIONAR_CARPETA_REPOSITORIO();
SELECCION_REPOSITORIO_CARPETAS();
AÑADIR_EVENTO_AL_BOTON_CARGAR_ARCHIVO();
IGUALAR_EVENTO_AL_BOTON_AÑADIR_IFC_AL_VISOR();
AÑADE_IFC_SELECCIONADO_AL_PANEL_DE_MODELOS();
AÑADIR_EVENTO_AL_BOTON_AÑADIR_PLANO_DE_CORTE();
AÑADIR_EVENTO_AL_BOTON_BORRAR_PLANOS_DE_CORTE();
AÑADIR_EVENTO_AL_BOTON_VER_ELEMENTOS_REVISADOS();
AÑADIR_EVENTO_AL_BOTON_SELECCIONAR();


AÑADE_EVENTO_ACTIVA_DESACTIVA_PLANOS_DE_CORTE();
AÑADE_EVENTO_AL_PASAR_POR_ENCIMA_DE_UN_ELEMENTO();

AÑADE_EVENTO_AL_BOTON_VISUALIZAR_DOCUMENTOS();
AÑADE_EVENTO_AL_BOTON_VISUALIZAR_ENSAYOS();
AÑADE_EVENTO_AL_BOTON_VER_LISTADO_REVISIONES();

AÑADE_EVENTO_AL_SELECCIONAR_ELEMENTO();
AÑADIR_EVENTOS_ANIMACION_MOSTRAR_OCULTAR_SECCIONES_DE_PAGINA();
AÑADIR_EVENTO_ANIMACION_PANELES_MODELOSIFC_Y_PANEL_PROPIEDADES();
ACTIVA_BOTON(BotonSeleccionar);
DameElCanvas();
CanvasDelIfc.style.width='98vw';







function AÑADE_EVENTO_AL_BOTON_VISUALIZAR_DOCUMENTOS(){
  BotonDocumentos.onclick=()=>{
    VaciarDocumentosEnPantalla();
  }

}

function AÑADE_EVENTO_AL_BOTON_VISUALIZAR_ENSAYOS(){
  BotonEnsayos.onclick=()=>{
    VaciarDocumentosEnPantalla();
  }

}
function AÑADE_EVENTO_AL_BOTON_VER_LISTADO_REVISIONES()
{
  BotonRevisiones.onclick=()=>{
    Tabla.remove();
    VaciarDocumentosEnPantalla();
    
        
    
    const Linearevision= document.createElement("ul");
    
    Linearevision.classList.add("collapsible");
    ListaLineasRevision.push(Linearevision);
    ListaRevisionesDelElementoSeleccionado.forEach(Revision => {

      console.log(Revision);
      const Validez=DameResultadoDeRevisionEnObra(Revision);

      const Linea=document.createElement("li");
      Linearevision.appendChild(Linea);
      
      
    
      
  
      const DivLinea=document.createElement("div");
      DivLinea.classList.add("LineaRev");
      DivLinea.style.color="red";
      DivLinea.style.background="rgb(255, 199, 199)";

      if(Validez===true)
      {
        
        DivLinea.style.color="green";
        DivLinea.style.backgroundColor="rgb(250, 255, 208)";
      }
      DivLinea.classList.add("collapsible-header");
      Linearevision.appendChild(DivLinea);
      const Imagen=document.createElement("i");
      Imagen.style.fontWeight="bold";
      Imagen.classList.add("material-icons");
      if(Validez===true)
      {
        Imagen.innerHTML="check";
      }
      else
      {
        Imagen.innerHTML="close";
      }
      const Fecha=document.createElement("i");
      Fecha.style.fontSize="0,2rem";
      const FechaSinEspacios=Revision._.replace(" ", "_");
      Fecha.innerHTML="Check:"+FechaSinEspacios;
      DivLinea.appendChild(Imagen);
      DivLinea.appendChild(Fecha);

      const MedallaDerecha=document.createElement("span");
      MedallaDerecha.classList.add("badge");
      MedallaDerecha.classList.add("new");
      MedallaDerecha.innerHTML=Revision.ConceptoRevisado.length;
      DivLinea.appendChild(MedallaDerecha);

      ViewerTabla.appendChild(Linearevision)



      //Añadimos contenedor de conceptos
      const ContenedorConceptos=document.createElement("div");
      ContenedorConceptos.classList.add("ContenedorConceptosRevisados");

      

     const ListaConceptosRevisados=Revision.ConceptoRevisado;


     ListaConceptosRevisados.forEach(Concepto => {
       const ConceptoRev=Concepto._;
       const ConceptoValido=Concepto.Valido;

       
      const LineaColapsada=document.createElement("div");
      // LineaColapsada.classList.add("collapsible-body");
      LineaColapsada.classList.add("ConceptoRevis");
      const LineaInterna=document.createElement("p");
      LineaInterna.innerText=ConceptoRev+" Ok: "+ConceptoValido;
      LineaColapsada.appendChild(LineaInterna);
      ContenedorConceptos.appendChild(LineaColapsada);

      ViewerTabla.appendChild(ContenedorConceptos);

     });


     
      
    });
   
    

    
    
  }

}
function VaciarDocumentosEnPantalla()
{
  Tabla.remove();
  ListaLineasRevision.forEach(element => {
  element.remove();
  });
  ListaLineasRevision=[];
}

function AÑADIR_EVENTO_AL_BOTON_VER_ELEMENTOS_REVISADOS(){
  
  BotonVerElementosRevisados.onclick=()=>{
  
  const VentanaRevisiones=window.open('PaginaRevisiones.html');
  
  
  
  }
  
}
function AÑADIR_EVENTO_AL_BOTON_AÑADIR_PLANO_DE_CORTE(){
 

    BotonAñadirPlanoCorte.onclick = () =>{
      
      AÑADIR_PLANO_DE_CORTE();

    } 
  
 
}
function AÑADIR_EVENTO_AL_BOTON_BORRAR_PLANOS_DE_CORTE(){
 
  BotonBorrarPlanosDeCorte.onclick=()=>{
    
    if(BotonPlanoCorte.Tag===true)
    {viewer.toggleClippingPlanes();
      DESACTIVA_BOTON(BotonAñadirPlanoCorte);
      DESACTIVA_BOTON(BotonPlanoCorte);
    }
    viewer.clipper.deleteAllPlanes();
    
  };
  }
  

function AÑADIR_EVENTO_AL_BOTON_SELECCIONAR(){
 

  BotonSeleccionar.onclick = () =>  {
    if(BotonAñadirPlanoCorte.Tag===true)
    {
      DESACTIVA_BOTON(BotonAñadirPlanoCorte);
      
    }
   
    ACTIVA_BOTON(BotonSeleccionar);
  }


}
//FUNCIONES DEL MODULO
function AÑADIR_EVENTO_AL_BOTON_CARGAR_ARCHIVO() {
  input.addEventListener("change",

    async (changed) => {

      const file = changed.target.files[0];
      //SI NO ES UN IFC, AVISAMOS
      if (file.name.split('.')[1] != "ifc") {
        MensajeAlerta();
        return;
      }

      const ifcURL = URL.createObjectURL(file);
      const ifcCargado = await viewer.IFC.loadIfcUrl(ifcURL);
      ifcCargado.name = file.name; //Le ponemos nombre
      ListaIfcsCargados.push(ifcCargado);
      PliegaDespliegaPanelModelos(PanelMod, EstadoPlegadoModelos);
      // const Lista = await viewer.IFC.getAllItemsOfType(ListaIfcsCargados[0].type);
      
      //const Lista = await viewer.IFC.getAllItemsOfType(ListaIfcsCargados[0].id,ListaIfcsCargados[0].type,false);

    },

    false
  );
}
function AÑADIR_EL_VISOR_IFC() {
  
 const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(255, 255, 255) });
  viewer.addAxes();
  viewer.addGrid(50,50);
  
  
  return viewer;
}
function LeerUltimoRepo(){
  window.api.send("DameUltimoRepo","Hola");
}
function AÑADE_IFC_SELECCIONADO_AL_PANEL_DE_MODELOS() {
  input.onchange = (event) => {

    const NombreIFCCargado = event.target.files[0].name;

    ListaNombresIFCsCargados.push(NombreIFCCargado);

    AñadirIFCAlPanel(NombreIFCCargado);
  


  };
}
function AÑADE_EVENTO_AL_BOTON_SELECCIONAR_CARPETA_REPOSITORIO() {
  BotonDirectorio.onclick = () => InputCarpeta.click();
}
function IGUALAR_EVENTO_AL_BOTON_AÑADIR_IFC_AL_VISOR() {
  BotonCargaIFC.onclick = () => input.click();
}
function AÑADE_EVENTO_ACTIVA_DESACTIVA_PLANOS_DE_CORTE() {
  BotonPlanoCorte.onclick = () => {
    viewer.toggleClippingPlanes();
 
    if(BotonPlanoCorte.Tag===false || BotonPlanoCorte.Tag ===undefined)
    {
           ACTIVA_BOTON(BotonPlanoCorte);
    }
    else

    {
           DESACTIVA_BOTON(BotonPlanoCorte)

    }
  };
}
function ACTIVA_BOTON(Boton){
  
  if(Boton.Tag===undefined)
  {
    Boton.Tag=false;
  }
if(Boton.Tag===false)
{

  Boton.style.background="#920c26";
  Boton.Tag=true;
  
}
}
function DESACTIVA_BOTON(Boton){
  
  if(Boton.Tag===undefined)
  {
    Boton.Tag=true;
  }
if(Boton.Tag===true)
{

  Boton.style.background="#da1239";
  Boton.Tag=false;
  
}
}
function AÑADE_EVENTO_AL_SELECCIONAR_ELEMENTO() {

  


  container.ondblclick = async () => {
    VaciarDocumentosEnPantalla();
    VaciarNumeroElementos();
    const found = await viewer.IFC.pickIfcItem(true);
    if (found === null || found === undefined)
      return;
      
  if(BotonAñadirPlanoCorte.Tag===true)
  {
       const plano = AÑADIR_PLANO_DE_CORTE();
       
  }
    
    LimpiarTabla(Tabla);
    //MOSTRAMOS PROPIEDADES
  
    //PROPIEDADES DE EJEMPLAR
    const props = await viewer.IFC.getProperties(found.modelID, found.id, true);
    console.log("Propiedades del elemento:", props);
    console.log("Familia=", props.Name);
    //ID EJEMPLAR DE REVIT
    const IdRevit = props.Tag.value;
    // console.log("ID de Revit: ",IdRevit);
    document.getElementById("ValorIdEjemplar").innerHTML = IdRevit;
    //ID TIPO DE REVIT
    const IdTipoRevit = props.type[0].Tag.value;
    console.log("Propiedades de tipo= " + props.type);
    // console.log("ID tipo de Revit: ",IdTipoRevit);
    document.getElementById("ValorIdTipo").innerHTML = IdTipoRevit;
    //Mostrar familia y tipo
    let FamiliaYTipo = props.Name;
    console.log("FamiliaYTipo", FamiliaYTipo);
    FamiliaYTipo = DecodeIFCString(FamiliaYTipo.value);
    const ListaSeparada = FamiliaYTipo.split(':');
    const Familia = ListaSeparada[0];
    const Tipo = ListaSeparada[1];
    CajetinFamilia.style.visibility = "visible";
    CajetinTipo.style.visibility = "visible";
    CajetinFamilia.innerHTML = Familia;
    CajetinTipo.innerHTML = Tipo;


    //Abrimos paneles de modelos y de propiedades
    PliegaDespliegaPanelModelos(PanelMod, EstadoPlegadoModelos);
    PliegaDespliegaPanelProp(PanelPropip, EstadoPlegadoProp);



    //PROPIEDADES DE TIPO
    updatePropertyMenu(props);
    //MOSTRAMOS ARRIBA LOS CAJETINES DE FAMILIA Y TIPO
    CajetinFamilia.visibility = "visible";
    CajetinTipo.visibility = "visible";
    //AHORA VAMOS A MANDAR AL MAIN LOS DATOS
    if (Repositorio == null) {
      alert("Debes elegir la carpeta de repositorio de los archivos para poder visualizarlos, antes de seleccionar un elemento");
      return;
    }


    var ES = {
      Repo: Repositorio,
      IDTipo: IdTipoRevit,
      IDEjemplar: IdRevit
    };

    //  Mandamos el ID del elemento al proceso Main
    window.api.send("ElementoSeleccionado", ES);

  };
}
function AÑADIR_PLANO_DE_CORTE() {
  let plano=undefined;
  if(BotonAñadirPlanoCorte.Tag===false || BotonAñadirPlanoCorte.Tag===undefined)
  {
    DESACTIVA_BOTON(BotonSeleccionar);
    ACTIVA_BOTON(BotonAñadirPlanoCorte);
  
  }
  else
  {
    DESACTIVA_BOTON(BotonAñadirPlanoCorte);
    ACTIVA_BOTON(BotonSeleccionar);

  }
  if(BotonPlanoCorte.Tag===true)
  {
     plano=viewer.addClippingPlane();
    
  }
  else{
    viewer.toggleClippingPlanes();
    ACTIVA_BOTON(BotonPlanoCorte);
  }
 
  return plano;
 
 
}
// Called when message received from main process
window.api.receive("DocumentosEncontrados", (data) => {


      EscribirNumeroDeDocumentos(ElementoNumeroDocumentos,data.length);
      data.forEach(doc => {
    //  console.log(doc.Nombre[0]+"/"+doc.Archivo[0]);
     AñadirDocumentoATabla(doc,Repositorio);
     
     const Numero=data.length;
 
    
     
     
  });
});
window.api.receive("EnsayosEncontrados", (data) => {
  

  EscribirNumeroDeDocumentos(ElementoNumeroEnsayos,data.length);
  data.forEach(doc => {
  AñadirEnsayoATabla(doc,Repositorio);
 
 
});
});
window.api.receive("GUIDDelTipo", (data) => {GUIDDelTipo=data;});
window.api.receive("GUIDDelEjemplar",(data) => {GUIDDelEjemplar=data;});
window.api.receive("UltimoRepositorioLeido", (data) => {
 
 
  CajetinRepositorio.innerHTML=data;
  Repositorio=data;

});
window.api.receive("RevisionesEncontradas", (data) => {
 
  EscribirNumeroDeDocumentos(ElementoNumeroRevisiones,data.length);
 const ListaRevisionesEncontradas=data;
 ListaRevisionesEncontradas.forEach(Revision => {
   ListaRevisionesDelElementoSeleccionado.push(Revision);
 });
 
});
function DameResultadoDeRevisionEnObra(Revision)
{
  let ListaConceptosRevisados=Revision.ConceptoRevisado;
  let Resultado=true;
  ListaConceptosRevisados.forEach(Concepto => {
    
    if(Concepto.Valido[0]==="NO")
    {
      Resultado=false;
    }

    
  });
  return Resultado;
}
function VaciarNumeroElementos(){
 ElementoNumeroDocumentos.innerHTML="("+0+")";
 ElementoNumeroEnsayos.innerHTML="("+0+")";
 ElementoNumeroRevisiones.innerHTML="("+0+")";

}

function EscribirNumeroDeDocumentos(Elemento,NumeroElementos)
{
  Elemento.innerHTML="("+NumeroElementos+")";
}
function AbrirDocumentoDeLaRevision(Revision) {
  const DireccionDocumento = CajetinRepositorio.innerHTML + "REVISIONES_REALIZADAS\\" + GUIDDelEjemplar + "\\" + Revision.Documento;


  console.log(DireccionDocumento);

  window.api.send("DocumentoParaAbrir", DireccionDocumento);
}

function SELECCION_REPOSITORIO_CARPETAS() {
  let Ruta = null;
  InputCarpeta.onchange = (event) => {

    const ListaArchivos = event.target.files;

    DameDirectorioDeArchivo(ListaArchivos[0]);

    const RutaTexto = ListaArchivos[0].path;

    const Nombre = ListaArchivos[0].name;
    const SoloCarpeta = RutaTexto.replace(Nombre, "");


    CajetinRepositorio.innerHTML = SoloCarpeta;
    CajetinRepositorio.style.color = "rgb(107,142,35)";


    const ArchivoXML = ListaArchivos[0];
    Ruta = ArchivoXML.path;
    LimpiarTabla(Tabla);
    Repositorio = SoloCarpeta;
    window.api.send("UltimoRepositorioAbierto", Repositorio);
    AñadirDocumentosATabla(SoloCarpeta);

  };
}
function AÑADIR_EVENTOS_ANIMACION_MOSTRAR_OCULTAR_SECCIONES_DE_PAGINA() {
  BotonOcultarTabla.addEventListener('click', () => {

    if (TablaVisible === true) {
      PanelCentral.style.height = '84vh';
      VisorIFC.style.height = '84vh';
      BarraLateralDcha.style.height = '84vh';
      CanvasDelIfc.style.height='84vh';
      TablaVisible = false;
    }
    else {

      PanelCentral.style.height = '62vh';
      VisorIFC.style.height = '62vh';
      BarraLateralDcha.style.height = '62vh';
      CanvasDelIfc.style.height='62vh';
      TablaVisible = true;
    }
  }, true);
  BotonSubirTabla.addEventListener('click', () => {

    if (VerVisor === true) {
      BarraLateralDcha.style.visibility = 'hidden';
      BotonSubirTabla.className = "lnr lnr-chevron-down";
      VisorIFC.style.height = '0vh';
      PanelCentral.style.height = '0vh';
      CanvasDelIfc.style.height='0vh';

      BarraLateralDcha.style.height = '0vh';

      ContenedorTabla.style.height = '100vh';
      VerVisor = false;
    }
    else {

      BotonSubirTabla.className = "lnr lnr-chevron-up";
      PanelCentral.style.height = '62vh';

      BarraLateralDcha.style.height = '62vh';

      VisorIFC.style.height = '62vh';
      CanvasDelIfc.style.height='62vh';
      ContenedorTabla.style.height = '24vh';
      BarraLateralDcha.style.visibility = 'visible';
      VerVisor = true;
    }

  }, true);
  BotonMostrarOcultarBarraLateralDerecha.addEventListener('click', () => {

    if (VerLateral === true) {
      BotonMostrarOcultarBarraLateralDerecha.className = "lnr lnr-chevron-left";
       VisorIFC.style.width = '98vw';
      //  CanvasDelIfc.style.width=VisorIFC.style.width;

      BarraLateralDcha.style.width = '2vw';
      VerLateral = false;
    }
    else {
      BotonMostrarOcultarBarraLateralDerecha.className = "lnr lnr-chevron-right";
      BarraLateralDcha.style.width = '20vw';
       VisorIFC.style.width = '80vw';
      //  CanvasDelIfc.style.width=VisorIFC.style.width;

      VerLateral = true;
    }

  }, true);
}
function AÑADE_EVENTO_AL_PASAR_POR_ENCIMA_DE_UN_ELEMENTO() {
  container.onmousemove = () => {

    viewer.IFC.prePickIfcItem();
  };
}
function AñadirIFCAlPanel(NombreIFC, ModeloIFC){
  const root=document.createElement('div');
  root.classList.add('property-root');

  const labelCheck=document.createElement('label');



  const activacion=document.createElement('div');
  activacion.classList.add('switch');
  activacion.classList.add('white');

  

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
    
    
      

    ListaIfcsCargados[NumeroOrdenDelIFC].visible=!ListaIfcsCargados[NumeroOrdenDelIFC].visible;
    if(ListaIfcsCargados[NumeroOrdenDelIFC].visible===false)
    {
     delete(viewer.context.items.pickableIfcModels[NumeroOrdenDelIFC]);
    }
    else
    {
      viewer.context.items.pickableIfcModels.splice(NumeroOrdenDelIFC, 0, ListaIfcsCargados[NumeroOrdenDelIFC]);
    }
   
      

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
{ const CarpetaDocumentos=Carpeta+"DOCUMENTOS_ELEMENTOS";
   
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
  CustomToolTip.style.visibility='hidden';
  CustomToolTip.style.marginRight="2rem";
  
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
function AñadirEnsayoATabla(Documento,Ruta){
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
  CustomToolTip.style.visibility='hidden';
  CustomToolTip.style.marginRight="2rem";
  

  
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
      const CarpetaAAbrir=Ruta+"ENSAYOS_ELEMENTOS\\"+GUIDDelTipo+"\\"+Documento.Archivo;
               
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
    const DocAAbrir=Ruta+"ENSAYOS_ELEMENTOS\\"+GUIDDelTipo+"\\"+Documento.Archivo;
               
    window.api.send("DocumentoParaAbrir",DocAAbrir);
    
  }
  NuevoSpan.append(NuevoIconoOjo);
      
  
    
    
}
function AÑADIR_EVENTO_ANIMACION_PANELES_MODELOSIFC_Y_PANEL_PROPIEDADES() {
  EncabezadoMod.onclick = () => { PliegaDespliegaPanelModelos(PanelMod, EstadoPlegadoModelos); };
  EncabezadoProp.onclick = () => { PliegaDespliegaPanelProp(PanelPropip, EstadoPlegadoProp); };
}
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
function MensajeAlerta() {
  var txt;
  if (confirm("There has been a problem, are you sure the uploaded file is an IFC?")) {
    return;
  }
}
function IniciaMaterializeCollapsible (){
  // Manually make all DOM with .collapsible collapsible 
  $('.collapsible').collapsible();
}




function DameElCanvas(){
  const ListaHijosDelViewer=container.childNodes;
  let Resultado=undefined;
  ListaHijosDelViewer.forEach(element => {
    if(element.nodeName==="CANVAS")
    {
      
      
      
      CanvasDelIfc= element;
      
      return;


    }
    
    
  });
  

}

