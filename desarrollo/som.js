/* SOM cúbico de Kohonen. Adaptación de un ejemplo académico de mapas autoorganizados.
   No necesita PHP: el original ya entrenaba en JavaScript; PHP generaba la interfaz. */
'use strict';
const SOM = (() => {
  const FEATURES = [
    ['Longitud del cuerpo','Sin contar cola ni alas. Usa el tamaño habitual de un adulto.',['Menos de 10 cm','10 a 40 cm','40 cm a 1 m','1 a 3 m','Más de 3 m']],
    ['Número de patas','Cuenta patas, no alas, aletas ni tentáculos.',['Ninguna','2 patas','4 patas','6 patas','8 o más']],
    ['Pelaje visible','¿El cuerpo tiene pelo visible?',['No','Sí']],
    ['Plumas','¿Tiene plumas en el cuerpo?',['No','Sí']],
    ['Escamas visibles','En la piel, como en peces y reptiles.',['No','Sí']],
    ['Alas','¿Tiene alas, aunque no pueda volar?',['No','Sí']],
    ['Capacidad de vuelo','Volar significa elevarse y mantenerse en el aire.',['No vuela','Vuela distancias cortas','Vuela de forma sostenida']],
    ['Uso del agua','¿Se desplaza habitualmente nadando?',['No suele nadar','Nada a veces','Vive o se mueve principalmente en el agua']],
    ['Movimiento en tierra','Cómo se desplaza cuando está fuera del agua.',['No se desplaza en tierra','Se arrastra o avanza muy despacio','Camina o corre']],
    ['Saltos','Saltos característicos del animal.',['No suele saltar','Saltos pequeños','Saltos grandes']],
    ['Trepar','Subir árboles, rocas o superficies.',['No suele trepar','Trepa a veces','Trepa habitualmente']],
    ['Longitud de la cola','En proporción al cuerpo. Aletas caudales cuentan como cola.',['Sin cola visible','Muy corta','Corta','Larga','Muy larga']],
    ['Longitud del cuello','En proporción al cuerpo.',['Corto o no visible','Mediano','Largo']],
    ['Hocico','Forma de la parte frontal de la cabeza; en aves observa el pico aparte.',['Plano o no sobresale','Corto','Alargado']],
    ['Orejas externas','Solo orejas que sobresalen de la cabeza.',['No visibles','Pequeñas','Grandes']],
    ['Pico','¿Tiene un pico visible?',['No','Sí']],
    ['Caparazón o coraza','Cubierta rígida del cuerpo, como tortugas o crustáceos.',['Sin cubierta rígida','Cubierta parcial','Cubierta amplia']],
    ['Antenas','Apéndices de la cabeza, como en insectos y crustáceos.',['Sin antenas','Antenas cortas','Antenas largas']],
    ['Tentáculos o brazos','¿Tiene brazos como un pulpo o un calamar? No cuentes patas ni aletas.',['No','Sí']],
    ['Patrón del cuerpo','Elige el patrón más evidente.',['Color bastante uniforme','Manchas','Rayas o bandas','Varios colores en zonas grandes']]
  ].map(([name,hint,options],i)=>({id:'f'+i,name,hint,options,scale:options.length===4?[0,.33,.66,1]:options.map((_,j)=>j/(options.length-1))}));
  // Cada registro usa índices de opción, no valores inventados entre las categorías.
  // Perfil adulto representativo y didáctico: hay variaciones por especie, edad y sexo.
  const RAW = [
    ['Lobo gris','🐺','Bosque templado',[3,2,1,0,0,0,0,1,2,1,0,3,0,2,1,0,0,0,0,0]],
    ['Zorro ártico','🦊','Ártico',[2,2,1,0,0,0,0,0,2,2,0,3,0,2,1,0,0,0,0,0]],
    ['Mapache','🦝','Bosque templado',[2,2,1,0,0,0,0,1,2,1,2,3,0,1,1,0,0,0,0,2]],
    ['Reno','🦌','Ártico',[3,2,1,0,0,0,0,1,2,1,0,1,1,2,2,0,0,0,0,0]],
    ['Bisonte americano','🦬','Pradera',[3,2,1,0,0,0,0,1,2,0,0,2,0,2,1,0,0,0,0,0]],
    ['Dromedario','🐪','Desierto',[3,2,1,0,0,0,0,0,2,0,0,2,2,2,1,0,0,0,0,0]],
    ['Llama','🦙','Montaña',[3,2,1,0,0,0,0,0,2,1,1,1,2,2,2,0,0,0,0,0]],
    ['Canguro rojo','🦘','Pradera',[3,2,1,0,0,0,0,0,2,2,0,4,0,2,2,0,0,0,0,0]],
    ['Perezoso de tres dedos','🦥','Selva tropical',[2,2,1,0,0,0,0,1,1,0,2,1,0,0,1,0,0,0,0,0]],
    ['Nutria europea','🦦','Agua dulce',[2,2,1,0,0,0,0,2,2,1,0,3,0,1,1,0,0,0,0,0]],
    ['Castor canadiense','🦫','Agua dulce',[2,2,1,0,0,0,0,2,2,0,0,2,0,1,1,0,0,0,0,0]],
    ['Tejón europeo','🦡','Bosque templado',[2,2,1,0,0,0,0,0,2,0,0,1,0,2,1,0,0,0,0,2]],
    ['Erizo europeo','🦔','Bosque templado',[1,2,1,0,0,0,0,0,2,0,0,1,0,2,1,0,0,0,0,0]],
    ['Ardilla roja','🐿️','Bosque templado',[1,2,1,0,0,0,0,0,2,2,2,4,0,1,1,0,0,0,0,0]],
    ['Murciélago frugívoro','🦇','Selva tropical',[1,1,1,0,0,1,2,0,1,0,2,1,0,1,2,0,0,0,0,0]],
    ['Panda gigante','🐼','Bosque de bambú',[3,2,1,0,0,0,0,0,2,0,2,1,0,1,1,0,0,0,0,3]],
    ['Koala','🐨','Bosque de eucalipto',[2,2,1,0,0,0,0,0,2,1,2,0,0,1,2,0,0,0,0,0]],
    ['Mofeta rayada','🦨','Bosque templado',[1,2,1,0,0,0,0,0,2,0,1,3,0,2,1,0,0,0,0,2]],
    ['Ratón de campo','🐁','Pradera',[0,2,1,0,0,0,0,0,2,1,1,3,0,1,2,0,0,0,0,0]],
    ['Rata parda','🐀','Entorno urbano',[1,2,1,0,0,0,0,1,2,1,2,4,0,2,1,0,0,0,0,0]],
    ['Hámster sirio','🐹','Pradera',[1,2,1,0,0,0,0,0,2,0,1,1,0,1,1,0,0,0,0,3]],
    ['Delfín nariz de botella','🐬','Océano',[3,0,0,0,0,0,0,2,0,0,0,2,0,2,0,0,0,0,0,0]],
    ['Ballena azul','🐋','Océano',[4,0,0,0,0,0,0,2,0,0,0,2,0,2,0,0,0,0,0,0]],
    ['Foca común','🦭','Océano frío',[3,0,1,0,0,0,0,2,1,0,0,1,0,1,0,0,0,0,0,1]],
    ['Tiburón blanco','🦈','Océano',[4,0,0,0,0,0,0,2,0,0,0,3,0,2,0,0,0,0,0,3]],
    ['Pulpo común','🐙','Océano',[2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,0]],
    ['Calamar de arrecife','🦑','Océano',[1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,3]],
    ['Cangrejo azul','🦀','Costa',[1,4,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2,1,0,3]],
    ['Langosta espinosa','🦞','Océano',[1,4,0,0,0,0,0,2,0,0,0,2,0,0,0,0,2,2,0,1]],
    ['Camarón blanco','🦐','Costa',[1,4,0,0,0,0,0,2,0,0,0,2,0,0,0,0,2,2,0,0]],
    ['Pez ángel tropical','🐠','Arrecife tropical',[1,0,0,0,1,0,0,2,0,0,0,2,0,1,0,0,0,0,0,2]],
    ['Pez globo','🐡','Arrecife tropical',[1,0,0,0,0,0,0,2,0,0,0,1,0,1,0,0,0,0,0,1]],
    ['Tortuga verde','🐢','Océano',[3,0,0,0,1,0,0,2,1,0,0,1,0,1,0,1,2,0,0,0]],
    ['Cocodrilo del Nilo','🐊','Agua dulce',[4,2,0,0,1,0,0,2,2,0,0,4,0,2,0,0,1,0,0,0]],
    ['Pitón reticulada','🐍','Selva tropical',[4,0,0,0,1,0,0,1,1,0,2,1,0,1,0,0,0,0,0,1]],
    ['Gecko leopardo','🦎','Desierto',[1,2,0,0,1,0,0,0,2,0,1,3,0,1,0,0,0,0,0,1]],
    ['Rana de ojos rojos','🐸','Selva tropical',[0,2,0,0,0,0,0,1,2,2,2,0,0,0,0,0,0,0,0,3]],
    ['Águila real','🦅','Montaña',[2,1,0,1,0,1,2,0,2,1,0,2,0,0,0,1,0,0,0,0]],
    ['Búho nival','🦉','Ártico',[2,1,0,1,0,1,2,0,2,1,0,1,0,0,0,1,0,0,0,1]],
    ['Guacamayo azul y amarillo','🦜','Selva tropical',[2,1,0,1,0,1,2,0,2,1,2,4,0,0,0,1,0,0,0,3]],
    ['Pavo real','🦚','Bosque tropical',[3,1,0,1,0,1,1,0,2,1,1,4,1,0,0,1,0,0,0,3]],
    ['Flamenco común','🦩','Humedal',[3,1,0,1,0,1,2,1,2,0,0,1,2,0,0,1,0,0,0,0]],
    ['Pingüino emperador','🐧','Antártida',[3,1,0,1,0,1,0,2,2,1,0,1,0,0,0,1,0,0,0,3]],
    ['Mariposa monarca','🦋','Pradera',[0,3,0,0,0,1,2,0,2,0,0,0,0,0,0,0,0,2,0,3]],
    ['Abeja melífera','🐝','Pradera',[0,3,1,0,0,1,2,0,2,0,0,0,0,0,0,0,0,1,0,2]]
  ];
  const DATA = RAW.map(([name,emoji,ecosystem,choices],id)=>({id:'a'+id,name,emoji,ecosystem,choices,vector:encode(choices)}));
  function encode(choices){if(!Array.isArray(choices)||choices.length!==20)throw Error('Se requieren 20 características.');return choices.map((v,i)=>{if(!Number.isInteger(v)||v<0||v>=FEATURES[i].options.length)throw Error('Característica inválida: '+FEATURES[i].name);return FEATURES[i].scale[v];});}
  function config(p){if(!p||!Number.isInteger(p.epochs)||p.epochs<10||p.epochs>500||!Number.isInteger(p.size)||p.size<3||p.size>9||!Number.isFinite(p.rate)||p.rate<.01||p.rate>1||!Number.isFinite(p.radius)||p.radius<.3||p.radius>6)throw Error('Parámetros fuera del intervalo permitido.');
    if(p.seed!==undefined&&(!Number.isInteger(p.seed)||p.seed<0||p.seed>4294967295))throw Error('La semilla debe ser un entero entre 0 y 4294967295.');
    return p;}
  function random(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
  function distance(a,b){let d=0;for(let i=0;i<a.length;i++)d+=(a[i]-b[i])**2;return d;}
  // Distancia euclidiana cuadrada: preserva el ganador y admite distancia cero.
  // Corrige el uso de distancia Manhattan y la exclusión D!=0, D!=1 del PHP.
  // Vecindad periódica en los tres ejes: las caras opuestas son vecinas.
  // Elimina el privilegio de bordes y esquinas sin falsear las posiciones BMU.
  function latticeDistance(a,b,size){return a.reduce((sum,v,i)=>{const delta=Math.abs(v-b[i]);return sum+Math.min(delta,size-delta)**2;},0);}
  function bmu(vector,model){let best=-1,second=-1,d1=Infinity,d2=Infinity;for(let j=0;j<model.nodes.length;j++){let d=0;for(let f=0;f<20;f++)d+=(vector[f]-model.weights[j*20+f])**2;if(d<d1){second=best;d2=d1;best=j;d1=d;}else if(d<d2){second=j;d2=d;}}return {index:best,second,error:Math.sqrt(d1/20)};}
  // Cada entrenamiento recibe una semilla nueva. El argumento opcional permite
  // reproducir una ejecución en las pruebas, sin añadir controles a la interfaz.
  function freshSeed(){if(globalThis.crypto?.getRandomValues){return globalThis.crypto.getRandomValues(new Uint32Array(1))[0];}return (Date.now()^Math.floor(Math.random()*4294967296))>>>0;}
  async function train(vectors,params,onProgress=()=>{},cancelled=()=>false,seed=params?.seed??freshSeed()){
    config(params);if(!vectors.length||vectors.some(v=>v.length!==20||v.some(x=>!Number.isFinite(x)||x<0||x>1)))throw Error('Dataset inválido.');
    const {size,epochs,rate,radius}=params,rng=random(seed),nodes=[],weights=new Float64Array(size**3*20);
    for(let x=0;x<size;x++)for(let y=0;y<size;y++)for(let z=0;z<size;z++)nodes.push([x,y,z]);
    // Inicialización aleatoria cerca de muestras reales, con perturbación pequeña.
    // Ninguna posición se asigna según el nombre, el emoji o el ecosistema.
    for(let j=0;j<nodes.length;j++){const v=vectors[Math.floor(rng()*vectors.length)];for(let f=0;f<20;f++)weights[j*20+f]=Math.max(0,Math.min(1,v[f]+(rng()-.5)*.15));}
    const model={nodes,weights,params:{...params},seed},order=vectors.map((_,i)=>i);
    for(let e=0;e<epochs;e++){
      if(cancelled())throw Error('Entrenamiento cancelado');
      const t=e/(epochs-1),alpha=rate*Math.exp(Math.log(.05)*t),sigma=radius*Math.exp(Math.log(.25/radius)*t);
      for(let i=order.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
      for(const index of order){const v=vectors[index],winner=nodes[bmu(v,model).index];
        for(let j=0;j<nodes.length;j++){const d=latticeDistance(nodes[j],winner,size),h=Math.exp(-d/(2*sigma*sigma)),step=alpha*h;if(step<1e-8)continue;
          // w(t+1)=w(t)+α(t)·h(t)·(v−w(t)), en las 20 características.
          for(let f=0;f<20;f++){const k=j*20+f;weights[k]+=step*(v[f]-weights[k]);}
        }
      }
      if(e%4===0||e===epochs-1){onProgress((e+1)/epochs);await new Promise(resolve=>setTimeout(resolve,0));}
    }
    return model;
  }
  function evaluate(vectors,model){const hits=vectors.map(v=>bmu(v,model));let topo=0,interior=0;for(const h of hits){if(latticeDistance(model.nodes[h.index],model.nodes[h.second],model.params.size)>1)topo++;if(model.nodes[h.index].every(x=>x>0&&x<model.params.size-1))interior++;}return {error:hits.reduce((s,h)=>s+h.error,0)/hits.length,topographic:topo/hits.length,occupied:new Set(hits.map(h=>h.index)).size,interior,hits};}
  return {FEATURES,DATA,encode,config,random,distance,latticeDistance,bmu,freshSeed,train,evaluate};
})();
if(typeof module!=='undefined')module.exports=SOM;
