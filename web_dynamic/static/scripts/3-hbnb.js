$(document).ready(function () {
  const selectedAmenities = {};
  $('div.amenities li input').change(function () {
    if ($(this).is(':checked')) {
      selectedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete selectedAmenities[$(this).attr('data-id')];
    }
    $('div.amenities h4').html(Object.values(selectedAmenities).join(', ') || ' ');
  });

  $.getJSON('http://127.0.0.1:5001/api/v1/status/', (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

$.ajax({
  url: "http://0.0.0.0:5001/api/v1/places_search/",
  type: "POST",
  contentType: "application/json, charset=utf-8",
  dataType: "json",
  data: "{}",
  success: (response) => {
    for (let place of response) {
      $("section.place").append(
        `
            <article>
            <div class="title_box">
              <h2>` +
          place.name +
          `</h2>
            <div class="price_by_night">` +
          place.price_by_night +
          `</div>
            </div>
            <div class="information">
              <div class="max_guest">` +
          place.max_guest +
          (place.max_guest !== 1 ? " Guests" : " Guest") +
          `</div>
                <div class="number_rooms">` +
          place.number_rooms +
          (place.number_rooms !== 1 ? " Bedrooms" : " Bedroom") +
          `</div>
                <div class="number_bathrooms">` +
          place.number_bathrooms +
          (place.number_bathrooms !== 1 ? " Bathrooms" : " Bathroom") +
          `</div>
            </div>
            <div class="user">
              <b>Owner:</b> first name last name
            </div>
            <div class="description">` +
          place.description +
          `</div>
            </article>
            `
      );
    }
  },
});

});
