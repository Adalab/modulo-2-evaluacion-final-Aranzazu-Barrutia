'use strict';

//variables globales
const inputSearch = document.querySelector('.js-textSearch');
const btnSearch = document.querySelector('.js-buttonSearch');
const formList = document.querySelector('.js-listcontainer');
const favList = document.querySelector('.js-favs-list');
const btnReset = document.querySelector('.js-button-reset');
//const icon = document.querySelector('.js-delete-icon');

//Array series
let searchSeries = [];
let favSeries = new Array();
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
      renderSerieList(dataAPI);
      renderFavSerieList(favSeries);
    });
  //.catch((e) => console.log('Error -> ', e));
}

//Datos de una serie, generamos el HTML para  luego ver la serie en una lista con su nombre e imagen.
function renderSerie(oneSerie) {
  const id = oneSerie.show.id;
  const name = oneSerie.show.name;
  const alternativeImageUrl =
    'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  const imageUrl =
    oneSerie.show.image === null
      ? alternativeImageUrl
      : oneSerie.show.image.medium;
  return `<li  id=${id} class="div_list_section_ul_card js-serie"><img class="div_list_section_ul_img" src="${imageUrl}" alt=""><h2>${name}</h2><button class="btnX js-button-delete" onclick="">X</button></li>`;
}
//muestro el listado de series,genero el HTML y
//cada serie se genera usando la función renderSerie
function renderSerieList(listSeries) {
  let html = '<ul>';
  for (const oneSerie of listSeries) {
    html += renderSerie(oneSerie);
  }
  html += '</ul>';
  formList.innerHTML = html;
  addEventToSerie();
}
//muestro lalista de favoritos en el HTML, recorro el array de series y omito las series que aparcen como undefined.
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
//funcion manejadora xa el ev click de una serie, encunetro la serie en la lista de search series,
//la pongo en favoritas y se muestra a la usuaria la lista de fav actualizada.
function handleClick(event) {
  event.preventDefault();
  const idSerieClick = parseInt(event.currentTarget.id);
  const favSerie = searchSeries.find(
    (oneSerie) => oneSerie.show.id === idSerieClick
  );
  if (favSeries.indexOf(favSerie) === -1) {
    favSeries.push(favSerie);
  }
  event.currentTarget.classList.add('oneSerie');
  event.currentTarget.classList.add('favSerie');
  renderFavSerieList(favSeries);
  localStorage.setItem('favorites', JSON.stringify(favSerie));
}

//aagrego  el click a cada elemento serie para que la usuaria pueda agregarla a la lista favoritas.
function addEventToSerie() {
  const allSeries = document.querySelectorAll('.js-serie');
  for (const oneSerie of allSeries) {
    oneSerie.addEventListener('click', handleClick);
  }
}

//function handleDelete() {}
function handleReset() {
  const fav = document.querySelector('.js-section-fav');
  favSeries = [];
  fav.innerHTML = '';
  location.reload();
  localStorage.setItem('myShows', JSON.stringify(favList));
}
btnReset.addEventListener('click', handleReset);

function updateFavList() {
  renderFavSerieList(favSeries);
}
updateFavList();
getApiData();
//evento click sobre boton -> ejecuta handle
btnSearch.addEventListener('click', handleClick);

//btnX.addEventListener('click', handleDelete);
