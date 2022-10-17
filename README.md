# EMH Project: repositorio público

El repositorio ofrece el código frontend (React) y backend (Node.js) del prototipo EMH Project presentado en el [IV Desafío Aporta](https://datos.gob.es/es/desafios-aporta/desafio-aporta-2021).

El proyecto busca implementar un cuadro de mando web del tipo Business Intelligence para analizar los datos de la [Encuesta de Mobilidad Hospitalaria del INE](https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176778&menu=ultiDatos&idp=1254735573175).

La aplicación combina todo lo que ofrece JavaScript a nivel de tecnología web y de servidor con todo el potencial analítico de python. Uno de los objetivos era conseguir una herramienta BI que, por un lado, fuera capaz de ofrecer los cálculos descriptivos clásicos de cualquier herramienta de BI y, por el otro, pueda integrar análisis estadístico más avanzado propio de la bioestadística.

Para el proyecto, se han utilizado los datos de EMH del 2016 en adelante y se ha utilizado Heroku para desplegar la aplicación y Amazon RDS (PostgreSQL) para la base de datos.

La parte servidor de Node.js se encuentra el carpeta raiz del proyecto; la parte de React se encuentra en la carpeta client.

Todos los datos utilizados son abiertos y están referenciados en la aplicación. La Encuesta de Morbilidad Hospitalaria, si bien era abierta en el momento del desarrollo, ahora requiere de petición previa para su obtención. A continuación, se listan los datos utilizados:

  (1) [Encuesta de Morbilidad Hospitalaria, INE](https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176778&menu=ultiDatos&idp=1254735573175)
  
  (2) [Población anual, INE](https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177011&menu=resultados&idp=1254734710990)
  
  (3) [Catálogo de diagnósticos CIE-10, Ministerio de Sanidad](https://eciemaps.mscbs.gob.es/ecieMaps/browser/index_10_mc.html)
  
  (4) [Agrupadores CCSR, AHRQ](https://www.ahrq.gov/)
  
  (5) [Índice de Queralt](https://ics.gencat.cat/ca/assistencia/coneixement-assistencial/Projecte-de-Queralt/) (en curso)

Puede encontrarse una live demo del proyecto en el siguiente [enlace](https://emh-demo.herokuapp.com/). La aplicación se ha desplegado mediante las versiones gratuitas de Heroku y Amazon, por lo cual el rendimiento puede ser bajo. Debe considerarse que, a fecha de hoy (18/10/2022), se han utilizado los microdatos de la EMH del 2016 hasta 2020, lo cual representan unos 22 millones de registros.

El código es una propuesta inicial y desarrollada de forma rápida para el concurso, por lo que muchas mejoras pueden implementarse: refactorización, optimización, estandarización de tipos y nomenclaturas, etc. También, el hecho que se haya desarrollado sin recursos y a coste 0 ha influido en la forma del código: la mayor parte de la carga de trabajo se centra en la base de datos, mientras que el servidor, que dispone de muchos menos recursos (unos 500 MB de memoria), se ha limitado a la transferencia y análisis de datos ya agregados.

El framework, no obstante, puede modificarse con facilidad dependiendo de los recursos disponibles y, óbviamente, utilizarse para el análisis de otra clase de datos.
