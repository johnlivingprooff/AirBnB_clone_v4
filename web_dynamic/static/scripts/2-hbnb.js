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
});
