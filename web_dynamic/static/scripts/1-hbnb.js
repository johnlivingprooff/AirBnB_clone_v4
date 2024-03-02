$(document).ready(function () {
    const selected_amenities = {};
    $('div.amenities li input').change(function () {
        if ($(this).is(':checked')) {
            selected_amenities[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete selected_amenities[$(this).attr('data-id')];
        }
        $('div.amenities h4').html(Object.values(selected_amenities).join(', ') || ' ');
    });
});
