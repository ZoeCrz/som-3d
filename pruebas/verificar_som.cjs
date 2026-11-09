// Pruebas de datos, actualización de pesos, clasificación, aleatoriedad y límites.
const assert=require('node:assert/strict');
const SOM=require('../desarrollo/som.js');
(async()=>{
 assert.equal(SOM.DATA.length,45);assert.equal(SOM.FEATURES.length,20);
 assert.equal(new Set(SOM.DATA.map(a=>a.name)).size,45);assert.equal(new Set(SOM.DATA.map(a=>a.emoji)).size,45);
 const original=['León','Puma','Tigre','Mono','Oso','Caballo','Jirafa','Elefante','Hipopótamo','Rinoceronte','Perro','Cerdo','Vaca','Pato','Ganzo','Ganso','Conejo','Cabra','Gato','Cebra','Gallina'];
 assert(SOM.DATA.every(a=>!original.includes(a.name)));
 for(const a of SOM.DATA){assert.equal(a.vector.length,20);assert(a.vector.every(v=>v>=0&&v<=1));assert.deepEqual(SOM.encode(a.choices),a.vector);}
 assert.equal(SOM.FEATURES.filter(f=>f.options.length===2).length,6);
 for(const n of [2,3,4,5])assert(SOM.FEATURES.some(f=>f.options.length===n));
 // Verifica que las categorías multiclase realmente aparecen en el dataset.
 for(const n of [3,4,5])assert(SOM.FEATURES.some((f,i)=>f.options.length===n&&new Set(SOM.DATA.map(a=>a.choices[i])).size===n));
 assert.equal(SOM.latticeDistance([0,0,0],[5,0,0],6),1);
 assert.equal(SOM.latticeDistance([0,0,0],[5,5,5],6),3);
 assert.throws(()=>SOM.encode([0]));assert.throws(()=>SOM.config({epochs:5,size:6,rate:.3,radius:1}));
 const exact={nodes:[[0,0,0],[1,0,0]],weights:Float64Array.from([...Array(20).fill(0),...Array(20).fill(1)]),params:{size:2}};
 assert.equal(SOM.bmu(Array(20).fill(0),exact).index,0);assert.equal(SOM.bmu(Array(20).fill(0),exact).error,0);
 const p={epochs:140,size:6,rate:.35,radius:1.3},vectors=SOM.DATA.map(a=>a.vector),progress=[];
 const model=await SOM.train(vectors,p,v=>progress.push(v),()=>false,20261001);const metrics=SOM.evaluate(vectors,model);
 assert.equal(progress.at(-1),1);assert(progress.every((v,i)=>i===0||v>=progress[i-1]));
 assert(model.weights.every(v=>Number.isFinite(v)&&v>=0&&v<=1));assert.equal(model.nodes.length,216);
 assert(metrics.occupied>=25);assert(metrics.interior>0);assert(metrics.error<.15);
 for(const h of metrics.hits)assert(model.nodes[h.index].map(x=>x+.5).every(x=>x>0&&x<p.size));
 const frozen=Float64Array.from(model.weights);SOM.bmu(Array(20).fill(.5),model);assert.deepEqual(model.weights,frozen);
 const repeat=await SOM.train(vectors,JSON.parse(JSON.stringify({...p,seed:20261001})));assert.deepEqual(repeat.weights,model.weights);
 const other=await SOM.train(vectors,{...p,seed:20261002});
 assert.notDeepEqual(model.weights,other.weights);
 assert.throws(()=>SOM.config({...p,seed:-1}),/semilla/);
 const same=await SOM.train([Array(20).fill(.4)],{epochs:10,size:3,rate:.5,radius:1});assert(SOM.bmu(Array(20).fill(.4),same).error<.03);
 await assert.rejects(()=>SOM.train(vectors,p,()=>{},()=>true),/cancelado/);
 console.log(JSON.stringify({resultado:'Todas las pruebas pasaron',dataset:45,rasgos:20,neuronas:216,semillaDePrueba:20261001,caracteristicasBinarias:6,error:metrics.error,errorTopografico:metrics.topographic,neuronasOcupadas:metrics.occupied,animalesEnCeldasInteriores:metrics.interior,coordenadas:metrics.hits.map(h=>model.nodes[h.index])},null,2));
})().catch(e=>{console.error(e);process.exit(1);});
