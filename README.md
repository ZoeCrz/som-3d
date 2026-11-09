# SOM 3D: mapa autoorganizado de animales

Autor de la versión interactiva: **Zoe Yeray Cruz Cruz**.

Abre **Mapa_Autoorganizado_IA.html** con doble clic y espera a que aparezca **Listo para explorar**. Si el sistema abre un editor de texto, haz clic derecho y elige **Abrir con → Google Chrome, Safari, Edge o Firefox**.

**Solo necesitas compartir ese HTML.** Contiene el código y los datos; los emojis se dibujan con la fuente del navegador. Funciona sin internet, sin instalar paquetes y sin servidor PHP.

## Resultado y alcance

El proyecto entrega un mapa 3D interactivo de **45 animales y 20 rasgos** en un HTML que se puede abrir sin servidor. Permite entrenar con parámetros y semilla configurables, explorar vecinos y agregar animales. Los rasgos son perfiles didácticos. El mapa muestra similitudes según esos datos y no clasifica especies con validez científica.

## Uso rápido

1. Arrastra el cubo para girarlo. Acerca o aleja con la rueda o los botones + y −. También puedes usar las flechas del teclado al enfocar el mapa.
2. Busca un animal o filtra su ecosistema. Selecciónalo en la lista o pulsa su emoji en el mapa.
3. Consulta su posición X, Y, Z, sus tres parecidos más cercanos y sus 20 características en el panel inferior.
4. En **Ajustar mapa**, cambia épocas, tamaño del cubo, tasa de aprendizaje inicial o radio de vecindad inicial y pulsa **Entrenar mapa**.
5. En **Agregar animal**, escribe un nombre y responde los 20 campos. Se identificará siempre con **⭐**. No hay selección de una especie predefinida ni de otro emoji.
6. Usa **Guardar HTML** para compartir una copia que incluya tus animales agregados y parámetros. **Guardar datos** descarga un JSON de respaldo; **Importar** recupera los datos de ese JSON y sustituye los animales agregados actuales.

Las descargas van a la carpeta elegida por tu navegador, normalmente Descargas. Puedes moverlas a esta carpeta. El guardado automático del navegador es una ayuda local: no acompaña al HTML original cuando lo envías. Para compartir los cambios, usa **Guardar HTML**.

## Qué incluye

- 45 animales distintos de la lista original, de ecosistemas terrestres, acuáticos, tropicales, polares y otros; aves e insectos voladores.
- 20 características observables: seis con opciones No/Sí y catorce con escalas de 3, 4 y 5 opciones.
- Un SOM con neuronas distribuidas en tres ejes, visualización 3D interactiva, búsqueda, filtros y detalle de animales.
- Cuatro hiperparámetros editables. Valores iniciales: 140 épocas, cubo de 6 × 6 × 6, tasa 0.35 y radio 1.3.
- Emojis nativos del navegador, cuyo aspecto varía entre sistemas. No se redistribuyen imágenes extraídas de fuentes Apple.
- Código comentado y explicación técnica en **IMPLEMENTACION.md**.

## Cómo interpretar el cubo

X, Y y Z son coordenadas de neuronas aprendidas; ningún eje representa por sí solo una característica. Los puntos ocupan centros de celdas, nunca se dispersan con ruido para simular una clasificación.

El mapa usa **vecindad periódica**: las caras opuestas del cubo son vecinas durante el aprendizaje. Esto reduce los efectos de borde y permite ocupar el interior. Por esa razón, animales próximos a caras opuestas también pueden ser vecinos. El número junto a un emoji indica cuántos animales comparten una neurona; pulsa varias veces para recorrerlos o selecciónalos en la lista. Girar el cubo permite ver puntos que se superponen en la proyección.

En **Ajustar mapa**, puedes indicar una semilla entera de 0 a 4294967295. Con la misma semilla, datos y parámetros, el entrenamiento reproduce el mapa. El JSON y el HTML compartido conservan la semilla si la indicaste. Si el campo está vacío, cada recarga elige una semilla aleatoria. Los datos de tus animales y los parámetros se conservan; los pesos y las posiciones se recalculan. La distribución depende de los rasgos, los parámetros y la inicialización aleatoria. No se obliga a todos los animales a ocupar celdas distintas o distancias iguales, porque eso alteraría el resultado del SOM.

Los perfiles son una **simplificación didáctica**, no una base zoológica de mediciones. La cercanía compara apariencia y movimiento; no implica parentesco taxonómico. Los parecidos del panel se calculan en los 20 rasgos originales.

Agregar un animal consulta el mapa entrenado sin modificar sus pesos. Para que participe en el aprendizaje, vuelve a entrenar. Eliminar un animal lo retira de la interfaz; vuelve a entrenar para retirar su influencia si había participado en el entrenamiento anterior.

## Archivos de desarrollo y verificación

No necesitas estos archivos para abrir ni entregar el HTML:

- `desarrollo/som.js`: dataset, escalas y algoritmo.
- `desarrollo/app.js`: formulario, visualización, guardado e importación.
- `desarrollo/interfaz.html`: diseño y estructura.
- `desarrollo/generar_html.py`: vuelve a construir el HTML. Desde esta carpeta, ejecuta `python3 desarrollo/generar_html.py` si modificas las fuentes; utiliza únicamente la biblioteca estándar de Python.
- `pruebas/verificar_som.cjs`: comprobaciones del algoritmo. Con Node.js disponible: `node pruebas/verificar_som.cjs`.

Se comprobó el algoritmo y la regeneración del HTML. La apertura, el entrenamiento y la selección de animales se probaron en Safari. Usa un navegador actualizado para disponer de canvas, diálogos y descarga de archivos.
