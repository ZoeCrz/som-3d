# Implementación y cumplimiento de requisitos

El entregable es `Mapa_Autoorganizado_IA.html`, un archivo autónomo para la actividad de Inteligencia de Negocios de Zoe Yeray Cruz Cruz. Adapta la lógica de un ejemplo académico previo a un mapa de Kohonen de tres dimensiones y mantiene la organización de la captura proporcionada: cubo a la izquierda, lista a la derecha y ficha del animal debajo.

## Correspondencia con el documento

| Requisito | Implementación |
| --- | --- |
| 45 animales totalmente nuevos | 45 nombres distintos de los 20 originales y 45 emojis de animales distintos. |
| 20 características nuevas o renombradas | 20 rasgos de apariencia y movimiento con etiquetas, explicaciones y categorías. |
| Ecosistemas variados | Bosques, selva, pradera, montaña, desierto, Ártico, Antártida, agua dulce, océano, costa, arrecifes y humedales. |
| Escalas multiclase | Binarias, ternarias, de cuatro clases y de cinco clases; las de 3, 4 y 5 clases se utilizan efectivamente en los datos. |
| Reducción a X, Y y Z | La BMU determina la posición de cada animal en una red cúbica de neuronas. |
| Visualización 3D | Proyección de coordenadas reales del cubo con rotación, zoom, selección y teclado. |
| Hiperparámetros editables | Solo épocas, tamaño del cubo, tasa inicial y radio inicial, como solicita la indicación final. |
| Nuevo animal definido manualmente | Nombre y 20 campos obligatorios, sin selector de especies y con estrella fija. |
Los emojis se dibujan con la fuente nativa del navegador, sin redistribuir archivos de fuentes Apple.
| Distribución dentro del cubo | SOM con vecindad periódica y neuronas en los centros de celdas, sin ruido en posiciones ni coordenadas elegidas manualmente. |
| Presentación para clase | Datos personales indicados, sin un título promocional ni datos del docente o integrantes del PHP anterior. |
| Entrega en un HTML | CSS, JavaScript, dataset y emojis incluidos; no depende de los archivos de desarrollo. |
| Código comentado y README | Comentarios en las fuentes y explicación de apertura, uso y guardado en README.md. |

La última indicación del documento, estrella automática para el animal nuevo, prevalece sobre la instrucción anterior de elegir un emoji. Los 45 animales base conservan un emoji animal propio. No se publicaron archivos ni se enviaron a servicios externos.

## Escalas y rasgos

Cada categoría se convierte en un valor entre 0 y 1. Las escalas son exactamente:

- Dos opciones: 0, 1.
- Tres opciones: 0, 0.5, 1.
- Cuatro opciones: 0, 0.33, 0.66, 1.
- Cinco opciones: 0, 0.25, 0.5, 0.75, 1.

| Rasgo | Clases | Descripción resumida |
| --- | ---: | --- |
| Longitud del cuerpo | 5 | Menos de 10 cm hasta más de 3 m. |
| Número de patas | 5 | Ninguna, 2, 4, 6, 8 o más. |
| Pelaje visible | 2 | No, sí. |
| Plumas | 2 | No, sí. |
| Escamas visibles | 2 | No, sí. |
| Alas | 2 | No, sí. |
| Capacidad de vuelo | 3 | No vuela, vuelo corto, sostenido. |
| Uso del agua | 3 | No suele nadar, a veces, principalmente acuático. |
| Movimiento en tierra | 3 | No se desplaza, se arrastra, camina o corre. |
| Saltos | 3 | No suele saltar, pequeños, grandes. |
| Trepar | 3 | No suele trepar, a veces, habitualmente. |
| Longitud de la cola | 5 | Ausente hasta muy larga, en proporción al cuerpo. |
| Longitud del cuello | 3 | Corto, mediano, largo. |
| Hocico | 3 | Plano, corto, alargado. |
| Orejas externas | 3 | No visibles, pequeñas, grandes. |
| Pico | 2 | No, sí. |
| Caparazón o coraza | 3 | Ausente, parcial, amplio. |
| Antenas | 3 | Ausentes, cortas, largas. |
| Tentáculos o brazos | 2 | No, sí. |
| Patrón del cuerpo | 4 | Uniforme, manchas, rayas, zonas de varios colores. |

Todos los rasgos tienen el mismo peso en la distancia. Las categorías ordinales siguen su escala de intensidad. En categorías nominales como el patrón, el orden numérico es una convención exigida por la actividad: no representa una ley biológica. Esta codificación favorece la claridad del ejercicio y tiene esa limitación al interpretar similitudes. No se utilizan el nombre, el ecosistema ni el emoji para entrenar.

Los registros fueron construidos como perfiles didácticos de adultos representativos. No provienen de una base de medidas científicas. Las características pueden variar entre individuos; el emoji representa la clase del animal y no necesariamente su color o anatomía exactos. Por ejemplo, el zorro ártico usa el emoji genérico de zorro.

## Relación con el código PHP original

En el original, PHP declara etiquetas, crea selectores e incluye `header.php` y `footer.php`. El entrenamiento y el dibujo están escritos en JavaScript. Por ello, mantener esa lógica en un HTML permite entregar un archivo único sin un servidor ni las inclusiones ausentes.

Se conservan los pasos principales:

1. Convertir los rasgos del animal en un vector normalizado.
2. Inicializar un vector de pesos por neurona.
3. Buscar la neurona más parecida o BMU.
4. Actualizar esa neurona y sus vecinas con una función gaussiana.
5. Repetir para todos los animales durante varias épocas.
6. Clasificar un nuevo vector mediante la BMU del modelo entrenado.

Se corrigen estos puntos del original:

- La distancia original suma valores absolutos, aunque el comentario la llama euclidiana. Ahora se usa distancia euclidiana cuadrada al buscar la BMU.
- Se aceptan distancias de cero y de uno; ambas son resultados válidos que el código original excluía.
- Se agrega una tasa de aprendizaje explícita y decreciente; el original actualiza como si la tasa fuera 1.
- El radio también disminuye de forma progresiva.
- Se baraja el orden de muestras por época. Cada entrenamiento obtiene una semilla aleatoria nueva, también al recargar. Las pruebas pueden indicar una semilla explícita para reproducir un caso.
- La búsqueda final se realiza después de terminar todas las actualizaciones, no con posiciones calculadas durante la última época.
- La posición se calcula con el tamaño del grid, no con el número de animales.
- Se eliminan los desplazamientos aleatorios de etiquetas que cambiaban la posición visual.
- El entrenamiento cede periódicamente el control al navegador para actualizar el progreso.
- Se valida la entrada y se usan nodos de texto para mostrar nombres; no se ejecuta HTML aportado en nombres o archivos importados.

## Modelo matemático

Para un vector de entrada v de 20 componentes y los pesos w_j de la neurona j, la BMU minimiza:

`sum_f (v_f - w_jf)^2`

Las neuronas tienen índices i, j, k en `0 .. tamaño−1`. Sus centros visibles son `(i+0.5, j+0.5, k+0.5)` dentro del cubo `0 .. tamaño`. Este cambio de origen representa centros de celdas y se aplica igual a todos los puntos.

La vecindad usa límites periódicos. En cada eje, si la diferencia absoluta entre dos índices es d, la distancia de vecindad usa `min(d, tamaño−d)`. La distancia cuadrada entre neuronas suma esos tres términos al cuadrado. Es una topología fija del modelo, no un quinto hiperparámetro del formulario.

Para la época normalizada t en `[0,1]`:

`alpha(t) = tasa_inicial * exp(log(0.05) * t)`

`sigma(t) = radio_inicial * exp(log(0.25 / radio_inicial) * t)`

`h_j(t) = exp(-distancia_cuadrada_neuronas / (2 * sigma(t)^2))`

`w_jf(t+1) = w_jf(t) + alpha(t) * h_j(t) * (v_f - w_jf(t))`

Así, el radio termina en 0.25 celdas y la tasa termina en el 5 % de su valor inicial. Los pesos permanecen en `[0,1]` porque cada actualización es una combinación convexa con el dato.

La periodicidad evita que los límites físicos del dibujo produzcan neuronas con menos vecinos. Una imagen de un cubo no muestra por sí sola las conexiones entre caras opuestas; por ello, la interfaz lo indica expresamente. La preservación de vecindad del SOM es aproximada, no una garantía de todas las relaciones posibles. No se exige una ocupación uniforme ni se reparten animales artificialmente entre neuronas.

## Métricas

El error de cuantización que calculan las pruebas es la media de `sqrt(distancia_cuadrada_a_BMU / 20)`. El error topográfico es la fracción de animales para los que las dos neuronas más parecidas no son vecinas directas en la topología periódica, con distancia de una celda por un solo eje. No es un porcentaje de exactitud supervisada: no existen etiquetas objetivo de clasificación.

En el caso de prueba con los valores iniciales, 45 animales y semilla explícita 20261001 se obtuvieron 39 neuronas ocupadas, 12 animales en celdas interiores, error de cuantización de aproximadamente 0.02603 y error topográfico de 2.22 %. Ninguna posición está sobre las caras geométricas del cubo. Estos valores son evidencia de las pruebas, no un resultado fijo de la aplicación: cada recarga utiliza una semilla nueva y puede producir otra organización. La interfaz conserva el estado de avance y elimina el bloque explicativo, las métricas y el pie inferior de la presentación.

## Guardado y portabilidad

Los archivos JSON usan la versión 2 del esquema. Al importar datos de la versión 1, las cuatro características que cambiaron a binarias se convierten de ausencia/presencia a No/Sí; también se recupera el almacenamiento local de la versión anterior del entregable.

El HTML usa `localStorage` cuando el navegador lo permite. Ese almacenamiento pertenece al navegador y a la ubicación del archivo. Para transportar los cambios hay dos opciones explícitas:

- Guardar datos produce JSON con versión, nombre, identificador, categorías de animales nuevos y los cuatro parámetros. Importar valida el formato, los límites y los duplicados y vuelve a entrenar.
- Guardar HTML incorpora ese estado en un bloque JSON dentro de una copia autónoma del documento. Se regeneran lista, formulario y ficha al abrirla para evitar controles duplicados. Se escapan los caracteres `<` del JSON para que un nombre no pueda cerrar el bloque de script.

La clasificación de un nuevo animal no ajusta el mapa. Es una consulta al modelo entrenado. Reentrenar sí incluye todos los animales nuevos actuales. La semilla se genera de nuevo con el generador aleatorio del navegador. No se guardan pesos ni posiciones en el estado portable; al recargar se entrenan de nuevo. Los datos y los cuatro parámetros sí se conservan.

## Fuentes del método

- Antecedente: ejemplo académico de un mapa autoorganizado. Esta entrega documenta la adaptación tridimensional.
- Requisitos: `REQUERIMIENTOS DEL PROYECTO.docx`, entregado en esta carpeta.
- SOM Toolbox de Aalto, implementación del algoritmo y estructura de mapas: https://www.cis.hut.fi/somtoolbox/documentation/somalg.shtml
- SOM con límites periódicos y preservación de topología: https://academic.oup.com/mnras/article/419/3/2633/1070317

La aplicación no consulta estas páginas al abrirse. Son referencias del método; no son fuentes de los perfiles zoológicos didácticos.
