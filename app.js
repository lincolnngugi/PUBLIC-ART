const API_KEY = 'd6de0698-b82c-449c-873b-e6bc1dd5ff2d';
const BASE_URL = 'https://api.harvardartmuseums.org/object';

const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const artList = document.getElementById('artList');

document.addEventListener('DOMContentLoaded', showRandomArtworks);
form.addEventListener('submit', searchArtworks);
artList.addEventListener('click', handleArtClick);

function fetchArtworks(query = '') {
  const url = `${BASE_URL}?apikey=${API_KEY}&hasimage=1${query}&size=10`;
  return fetch(url)
    .then(res => res.json())
    .then(data => data.records);
}

function showRandomArtworks() {
  fetchArtworks('&sort=random').then(displayArtworks);
}

function searchArtworks(e) {
  e.preventDefault();
  const keyword = input.value.trim();
  const query = keyword ? `&q=${encodeURIComponent(keyword)}` : '';
  fetchArtworks(query).then(displayArtworks);
}

function displayArtworks(artworks) {
  artList.innerHTML = '';
  artworks.forEach(art => {
    const isFavorited = getFavoriteStatus(art.id);
    const card = document.createElement('article');
    card.className = 'art-card';
    card.dataset.id = art.id;

    card.innerHTML = `
      <h2>${art.title || 'Untitled'}</h2>
      <p><strong>${art.people?.[0]?.name || 'Unknown Artist'}</strong></p>
      <img src="${art.primaryimageurl}" alt="${art.title}" />
      <div class="details">
        <p><em>${art.dated || 'No date'}</em></p>
        <p>${art.description || art.medium || 'No description available'}</p>
      </div>
      <span class="heart ${isFavorited ? 'favorited' : ''}" role="button" aria-label="Heart">&#10084;</span>
    `;
    artList.appendChild(card);
  });
}

function handleArtClick(e) {
  const card = e.target.closest('.art-card');
  if (!card) return;

  if (e.target.classList.contains('heart')) {
    toggleHeart(card.dataset.id, e.target);
  } else {
    const details = card.querySelector('.details');
    details.style.display = details.style.display === 'block' ? 'none' : 'block';
  }
}

function toggleHeart(id, heartIcon) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
  favorites[id] = !favorites[id];
  localStorage.setItem('favorites', JSON.stringify(favorites));
  heartIcon.classList.toggle('favorited', favorites[id]);
}

function getFavoriteStatus(id) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
  return favorites[id];
}