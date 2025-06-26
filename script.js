const addEventBtn = document.querySelector('.add-event-btn');
const modalOverlay = document.getElementById('addEventModal');
const modalCloseBtn = document.querySelector('.modal-close');
const addEventForm = document.getElementById('addEventForm');
const eventsListToday = document.getElementById('events-list-today');
const eventsListFuture = document.getElementById('events-list-future');

// Utility: Check if a string is a Google Maps URL
function isGoogleMapsUrl(url) {
  return /^https?:\/\/(www\.)?google\.[^/]+\/maps/.test(url);
}

// Utility: Check if a date string is today
function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

// Default events (one for today, rest for future)
let today = new Date();
let yyyy = today.getFullYear();
let mm = String(today.getMonth() + 1).padStart(2, '0');
let dd = String(today.getDate()).padStart(2, '0');
let todayStr = `${yyyy}-${mm}-${dd}T18:00`;

let events = [
  {
    name: 'Wedding',
    location: 'https://www.google.com/maps/place/Sri+Lakshmi+Hall',
    displayLocation: 'Sri Lakshmi Hall',
    time: todayStr,
    type: 'live'
  },
  {
    name: 'Event Tomorrow',
    location: 'https://www.google.com/maps/place/Community+Hall',
    displayLocation: 'Community Hall',
    time: '2025-06-27T13:00',
    type: 'future'
  },
  {
    name: 'Birthday',
    location: 'https://www.google.com/maps/place/Green+Park',
    displayLocation: 'Green Park',
    time: '2025-06-28T12:00',
    type: 'live'
  },
  {
    name: 'Event This Weekend',
    location: 'https://www.google.com/maps/place/Sunset+Banquet+Hall',
    displayLocation: 'Sunset Banquet Hall',
    time: '2025-06-29T19:00',
    type: 'future'
  },
  {
    name: 'Charity Lunch',
    location: 'https://www.google.com/maps/place/City+Central+Park',
    displayLocation: 'City Central Park',
    time: '2025-06-30T12:30',
    type: 'future'
  }
];

function getRelativeDayLabel(eventDate) {
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((eventDate - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / oneDay);
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === 2) return 'Day After Tomorrow';
  if (diffDays > 2) return eventDate.toLocaleDateString(undefined, { weekday: 'long' });
  return null;
}

function renderEvents() {
  eventsListToday.innerHTML = '';
  eventsListFuture.innerHTML = '';
  const now = new Date();
  events.forEach(event => {
    const eventDate = new Date(event.time);
    // Only show events today or in the future
    if (eventDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      return;
    }
    const yyyy = eventDate.getFullYear();
    const mm = String(eventDate.getMonth() + 1).padStart(2, '0');
    const dd = String(eventDate.getDate()).padStart(2, '0');
    const fullDate = `${dd}-${mm}-${yyyy}`;
    const day = eventDate.toLocaleDateString(undefined, { weekday: 'short' });
    const time = eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit'});
    const icon = event.type === 'live' ? 'fa-circle-exclamation' : 'fa-calendar';
    let dateLabel = `${fullDate} ${day}`;
    if (!isToday(event.time)) {
      const rel = getRelativeDayLabel(eventDate);
      if (rel) dateLabel = rel;
    }
    const eventCard = `
      <div class="event-card ${event.type}">
        <div class="event-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="event-details">
          <div class="event-title ${event.type}">${event.name}</div>
          <div class="event-desc"><a class="event-location" href="${event.location}" target="_blank" rel="noopener">${event.displayLocation}</a> &middot; ${dateLabel} ${time}</div>
        </div>
      </div>
    `;
    if (isToday(event.time)) {
      eventsListToday.insertAdjacentHTML('beforeend', eventCard);
    } else {
      eventsListFuture.insertAdjacentHTML('beforeend', eventCard);
    }
  });
}

function toggleModal(show) {
  modalOverlay.classList.toggle('hidden', !show);
}

addEventBtn.addEventListener('click', () => toggleModal(true));
modalCloseBtn.addEventListener('click', () => toggleModal(false));
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    toggleModal(false);
  }
});

addEventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const eventName = e.target.eventName.value;
  const eventLocationInput = e.target.eventLocation.value.trim();
  const eventTime = e.target.eventTime.value;
  const eventType = e.target.eventType.value;

  if (!isGoogleMapsUrl(eventLocationInput)) {
    alert('Please enter a valid Google Maps link for the location.');
    return;
  }

  let locationHref = eventLocationInput;
  let displayLocation = eventLocationInput;
  const match = eventLocationInput.match(/place\/([^/]+)/);
  displayLocation = match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : eventLocationInput;

  events.push({
    name: eventName,
    location: locationHref,
    displayLocation: displayLocation,
    time: eventTime,
    type: eventType
  });

  renderEvents();
  addEventForm.reset();
  toggleModal(false);
});

// Initial render
renderEvents(); 