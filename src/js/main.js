'use strict';
/*pasos
1 - hacer HTML
2 - buscar/filtrar series y pelis de TV
    1- traer constantes
    2- evento click sobre boton --> ejecuta handle
    3- funcion handle:
        - ev.preventDefault()
        - recoger valor input ¿funcion o constante GLOBAL?
        - filtrar lo k hay en API con FETCH("https://api.tvmaze.com/search/shows?q=${name}"):
            Mirar en JSON el nombre de los datos que necesito!!!

        - PINTAR titulo y foto:
            - pintar solo name y image --> BUCLE
            - dar estilo con clase en CSS
            - CONDICIONAL: si no tiene img, poner la mia por defecto (https://www.pexels.com/es-es/foto/hombre-y-mujer-sentado-en-un-sofa-delante-de-un-television-4009402/)
3 - Favoritas
    1 - evento click sobre las peliculas --> ¿crear qsALL y currentTarget?
    2- Pintar el listado de fav:
        - El color de fondo y el de fuente se intercambian, indicando que es una serie favorita.
        - listado en la parte izquierda de la pantalla, debajo del formulario de búsqueda, con las series favoritas --> CREAR ARRAY VACIO PARA METER LAS FAVS, fuera, GLOBAL y LETs
        - Las series favoritas deben seguir apareciendo a la izquierda aunque la usuaria realice otra búsqueda. ¿LOCALSTORAGE? ¿+=?
4. Almacenamiento local en el localStorage.
creo cobst para almacenar, hago un JSON.stringify al ARRAY de FAVS, luego tendre que llamrlo para que salga por defecto al LEVANTAR la pagina.
(al recargar la página el listado de favoritos se debe mostrarse)
*/

//variables globales
const inputSearch = document.querySelector('.js-textSearch');
const btnSearch = document.querySelector('.js-buttonSearch');
const formList = document.querySelector('.js-listcontainer');
const favList = document.querySelector('.js-favs-list');

//Array series
let searchSeries = [];
const favSeries = new Array();
//funciones
function getApiData() {
  const value = inputSearch.value;
  const url = `//api.tvmaze.com/search/shows?q=${value}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((dataAPI) => {
      // eslint-disable-next-line no-console
      console.log('DataAPI -> ', dataAPI);
      searchSeries = dataAPI;
      renderSerieList(searchSeries);
    })
    .catch((e) => console.log('Error -> ', e));
}

//renderizo una serie y creo un html
function renderSerie(oneSerie) {
  const id = oneSerie.show.id;
  const name = oneSerie.show.name;
  const alternativeImageUrl =
    'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  const imageUrl =
    oneSerie.show.image === null
      ? alternativeImageUrl
      : oneSerie.show.image.medium;
  return `<li  id=${id} class="serie js-serie"><img src="${imageUrl}" alt=""><h2>${name}</h2></li>`;
}
//recorremos el listado
function renderSerieList(listSeries) {
  let html = '<ul>';
  for (const oneSerie of listSeries) {
    html += renderSerie(oneSerie);
  }
  html += '</ul>';
  formList.innerHTML = html;
  addEventToSerie();
}

function renderFavSerieList(listSeries) {
  let html = '<ul>';
  for (const oneSerie of listSeries) {
    if (oneSerie === undefined) {
      continue;
    }
    html += renderSerie(oneSerie);
  }
  html += '</ul>';
  favList.innerHTML = html;
}

function handleClick(event) {
  event.preventDefault();
  const idSerieClick = Number(event.currentTarget.id);
  const favSerie = searchSeries.find(
    (oneSerie) => oneSerie.show.id === idSerieClick
  );
  if (favSeries.indexOf(favSerie) === -1) {
    favSeries.push(favSerie);
  }

  renderFavSerieList(favSeries);
}
function addEventToSerie() {
  const allSeries = document.querySelectorAll('.js-serie');
  for (const oneSerie of allSeries) {
    oneSerie.addEventListener('click', handleClick);
  }
}
//evento click sobre boton -> ejecuta handle
btnSearch.addEventListener('click', handleClick);
