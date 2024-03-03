$(document).ready(function () {
  const selectedAmenities = {};
  const selectedStates = {};
  const selectedCities = {};

  // Function to update selected amenities display
  function updateSelectedAmenitiesDisplay() {
    $('div.amenities h4').html(Object.values(selectedAmenities).join(', ') || ' ');
  }

  // Function to update selected states display
  function updateSelectedLocationDisplay() {
    $('div.locations h4').html([...Object.values(selectedStates), ...Object.values(selectedCities)].join(', ') || ' ');
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

  // Event listener for state checkboxes
  $('div.locations li h2 input').change(function () {
    const stateId = $(this).attr('data-id');
    const stateName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      selectedStates[stateId] = stateName;
    } else {
      delete selectedStates[stateId];
    }

    updateSelectedLocationDisplay();
  });

    // Event listener for city checkboxes
    $('div.locations li input').change(function () {
      const cityId = $(this).attr('data-id');
      const cityName = $(this).attr('data-name');
  
      if ($(this).is(':checked')) {
        selectedCities[cityId] = cityName;
      } else {
        delete selectedCities[cityId];
      }
  
      updateSelectedLocationDisplay();
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

  // Getting place amenities
  function getAmenities() {
    const cities = Object.keys(selectedCities);
    cities.forEach(cityId => {
      const placeUrl = `http://127.0.0.1:5001/api/v1/cities/${cityId}/places`;
      $.getJSON(placeUrl, (places) => {
        places.forEach(function (place) {
          const amenitiesUrl = `http://127.0.0.1:5001/api/v1/places/${place.id}/amenities`;
          // Fetch amenities for each place
          $.getJSON(amenitiesUrl, (amenities) => {
            amenities.forEach(function(amenity) {
              const html = '<li>' + amenity.name + '</li>';
              $('.amenities-list').append(html);
            });
          });
        });
      });
    });
  }

  $('section.filters button').click( () => {
    const data = {
      amenities: Object.keys(selectedAmenities),
      states: Object.keys(selectedStates),
      cities: Object.keys(selectedCities)
    };
    $('section.places').empty()

    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data)
    }).done((response) => {
      displayPlaces(response);
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.error('Error fetching places:', errorThrown);
    });

    getAmenities();
  });

  // getAmenities();

  // Event listener for toggling reviews visibility
  $('section.places').on('click', '.reviews h2 span', function () {
    const $reviews = $(this).parent().next('ul');
    const cities = Object.keys(selectedCities);

    if ($reviews.is(':visible')) {
      $reviews.hide();
      $(this).text('show');
    } else {
      $reviews.show();
      $(this).text('hide');
    }

    cities.forEach(cityId => {
      const placesUrl = `http://127.0.0.1:5001/api/v1/cities/${cityId}/places`;
      $.getJSON(placesUrl, (places) => {
        places.forEach(function (place) {
          const reviewUrl = `http://127.0.0.1:5001/api/v1/places/${place.id}/reviews`;
          $.getJSON(reviewUrl, (reviews) => {
            const html = '<li>' + reviews + '</li>';
            $('.review-list').append(html);
          });
        });
      });
    });
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
          <div class="amenities-two">
            <h2>Amenities</h2>
              <ul class="amenities-list">
      
              </ul>
          </div>
          <div class="reviews">
              <h2>Reviews <span>hide</span></h2>
              <ul class="review-list">
                
              </ul>
          </div>
        </article>
      `;
      $('section.places').append(html);
    }
  }

});