'use strict';

//variables globales
const inputSearch = document.querySelector('.js-textSearch');
const btnSearch = document.querySelector('.js-buttonSearch');
const formList = document.querySelector('.js-listcontainer');
const favList = document.querySelector('.js-favs-list');
const btnReset = document.querySelector('.js-button-reset');
//const icon = document.querySelector('.js-delete-icon');

//Array series
let listSeries = []; // array objeto serie
let favSeries = []; //lista de fav
//funciones
// esta funcion hace que se queden las series seleccionadas al refrescar la pagina
function getItem() {
  const storedFavorites = localStorage.getItem('favorites');

  if (storedFavorites) {
    favSeries = JSON.parse(storedFavorites);

    // Muestro los elementos favoritos en la lista de favoritos (favList)
    favList.innerHTML = '';

    for (const favorite of favSeries) {
      const id = favorite.show.id;
      const name = favorite.show.name;
      const alternativeImageUrl =
        'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
      const imageUrl =
        favorite.show.image === null
          ? alternativeImageUrl
          : favorite.show.image.medium;

      favList.innerHTML += `<li id=${id} class="div_list_section_ul_card js-serie">
        <img class="div_list_section_ul_img" src="${imageUrl}" alt="">
        <h2>${name}</h2>
        <button class="btnX js-button-delete" onclick="">X</button>
      </li>`;
    }
  }
}

// Llamo a la función getItem al cargar la página para cargar los favoritos almacenados.
getItem();

function getApiData(ev) {
  ev.preventDefault(); //prevengo q el formulario se evie al hacer clic

  formList.innerHTML = ''; // borro el contenido dentro de la lista
  const value = inputSearch.value; //obtengo el valor de la usuaria
  const url = `https://api.tvmaze.com/search/shows?q=${value}`; //concatenamos el valor de la API y el de la usuaria
  fetch(url) //solicito a la URL
    .then((response) => {
      return response.json(); //recogemos la solicitud y la pasamos a string
    })
    .then((dataAPI) => {
      //ejecuto el código y lo paso como argumento

      listSeries = dataAPI; //lista de series obtenida de la API
      for (const serie of dataAPI) {
        //recorremos la lista
        //console.log(serie);
        const id = serie.show.id; //extraigo las propiedades de los elementos
        const name = serie.show.name;
        const alternativeImageUrl =
          'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
        const imageUrl =
          serie.show.image === null
            ? alternativeImageUrl
            : serie.show.image.medium;
        formList.innerHTML += `<li  id=${id} class="div_list_section_ul_card js-serie">
        <img class="div_list_section_ul_img" src="${imageUrl}" alt="">
        <h2>${name}</h2>
        <button class="btnX js-button-delete">X</button>
        </li>`; //introduzco los elementos en el HTML
      }

      addEventToSerie(); //agrego evento clic a cada elemento de la serie
    });
}
function favorites(event) {
  //manejo el evento de hacer clic xa maracarla como favorita
  event.preventDefault(); //prevengo q el formulario se evie al hacer clic
  const idSerieClick = parseInt(event.currentTarget.id); //lo busco por nº y no x string y obtengo el ID de laa serie clicada
  const selectedSerie = listSeries.find(
    //busco la serie en ek array usando el ID
    (oneSerie) => oneSerie.show.id === idSerieClick
  );

  if (selectedSerie) {
    //verifico si se encuentro la serie con el ID
    favSeries.push(selectedSerie);
    event.currentTarget.classList.add('favSeries'); //serie marcada favorita
    event.currentTarget.classList.remove('oneSerie');

    const id = selectedSerie.show.id;
    const name = selectedSerie.show.name;
    const alternativeImageUrl =
      'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    const imageUrl =
      selectedSerie.show.image === null
        ? alternativeImageUrl
        : selectedSerie.show.image.medium;

    favList.innerHTML += `<li id=${id} class="div_list_section_ul_card js-serie">
        <img class="div_list_section_ul_img" src="${imageUrl}" alt="">
        <h2>${name}</h2>
        <button class="btnX js-button-delete" onclick="">X</button>
      </li>`; ////introduzco los elementos en el HTML

    localStorage.setItem('favorites', JSON.stringify(favSeries));
  }
}

// //muestro lalista de favoritos en el HTML, recorro el array de series y omito las series que aparcen
function addEventToSerie() {
  const allSeries = document.querySelectorAll('.js-serie');
  for (const serie of allSeries) {
    serie.addEventListener('click', favorites);
  }
}

function handleReset() {
  const fav = document.querySelector('.js-section-fav');
  favSeries = [];
  fav.innerHTML = '';
  location.reload();
  localStorage.setItem('myShows', JSON.stringify(favList));
}
btnReset.addEventListener('click', handleReset);
//evento click sobre boton -> ejecuta handle
btnSearch.addEventListener('click', getApiData);

//btnX.addEventListener('click', handleDelete);
