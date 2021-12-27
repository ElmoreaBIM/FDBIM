function removeAllChildren(element){
    while(element.firstChild){
  element.removeChild(element.firstChild);
   }
  }
  function DecodeIFCString (ifcString)
{

    const ifcUnicodeRegEx = /\\X2\\(.*?)\\X0\\/uig;
    let resultString = ifcString;
    let match = ifcUnicodeRegEx.exec (ifcString);
    
    
    while (match) {
    
        const unicodeChar = String.fromCharCode (parseInt (match[1], 16));
        resultString = resultString.replace (match[0], unicodeChar);
        match = ifcUnicodeRegEx.exec (ifcString);
    }
    return resultString;
}
function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }
function mostrarTooltip(elemento,mensaje){

    // Si no existe aun el tooltip se crea
    if (!document.getElementById("ElementoToolTip") ){
        // Dimensiones del elemento al que se quiere añadir el tooltip
        // anchoElemento = $('#'+elemento.id).width();
        
        anchoElemento = elemento.offsetWidth;
        altoElemento = elemento.offsetHeight;
     
        
        // Coordenadas del elemento al que se quiere añadir el tooltip
        // coordenadaXElemento = $('#'+elemento.id).position().left;
        // coordenadaYElemento = $('#'+elemento.id).position().top;
       coordenadaXElemento=getOffset(elemento).left;
       coordenadaYElemento=getOffset(elemento).top;



        // Coordenadas en las que se colocara el tooltip
        x = coordenadaXElemento+10;
        y = coordenadaYElemento;
  
        // Crea el tooltip con sus atributos
        var tooltip = document.createElement('div');
        tooltip.id = "ElementoToolTip";
        tooltip.className = 'toolTip';
        tooltip.innerHTML = mensaje;
        tooltip.style.left = x + "px";
        tooltip.style.top = y + "px";
  
        // Añade el tooltip
        document.body.appendChild(tooltip); 
    }
  }
  function borrarTooltip(elemento){
  
        const ElementoABorrar=document.getElementById("ElementoToolTip");
    
        
        ElementoABorrar.remove();
  
}

function ActivaBoton(Elemento,TipoDocumento) {
    const BotonDoc=document.getElementById("BotonDocumentos");
    const BotonEnsayo=document.getElementById("BotonEnsayos");
    const BotonControles=document.getElementById("BotonRevisiones");
    const ListaBotones=[BotonDoc,BotonEnsayo,BotonControles];



    

ListaBotones.forEach(Boton => {
    
    
    if(Boton.isEqualNode(Elemento))
    {
       
        Elemento.style.background = "rgb(109, 2, 34)";
        TipoDocumentoActivo=TipoDocumento;
      
    }
    else
    {
        Elemento.style.background = "#da1239";
        
    }
});
}

   
  

  
