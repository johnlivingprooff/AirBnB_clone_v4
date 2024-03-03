$(document).ready(function () {
  const selectedAmenities = {};

  // Function to update selected amenities display
  function updateSelectedAmenitiesDisplay() {
    $('div.amenities h4').html(Object.values(selectedAmenities).join(', ') || ' ');
  }

  // Event listener for amenity checkboxes
  $('div.amenities li input').change(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }
    
    updateSelectedAmenitiesDisplay();
  });

  // Check API status and fetch places
  $.getJSON('http://127.0.0.1:5001/api/v1/status/', (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');

      // Fetch places
      $.ajax({
        url: 'http://127.0.0.1:5001/api/v1/places_search/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({})
      }).done((response) => {
        displayPlaces(response);
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error('Error fetching places:', errorThrown);
      });
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  // Function to display places
  function displayPlaces(places) {
    for (const place of places) {
      const html = `
        <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest}${place.max_guest !== 1 ? ' Guests' : ' Guest'}</div>
            <div class="number_rooms">${place.number_rooms}${place.number_rooms !== 1 ? ' Bedrooms' : ' Bedroom'}</div>
            <div class="number_bathrooms">${place.number_bathrooms}${place.number_bathrooms !== 1 ? ' Bathrooms' : ' Bathroom'}</div>
          </div>
          <div class="user">
            <b>Owner:</b> first name last name
          </div>
          <div class="description">${place.description}</div>
        </article>
      `;
      $('section.places').append(html);
    }
  }
});
