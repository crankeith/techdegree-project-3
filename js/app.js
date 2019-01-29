const color = $('#color');
const tShirtColors = {
    'js puns': ["cornflowerblue", "darkslategrey", "gold"],
    'heart js': ["tomato", "steelblue", "dimgrey"]
};

//Set focus to the first field on page load
$( window ).on('load', function() {
    $('#name').focus();
});

//Hide "Other" text input for job role
$("#titleOther").hide();

// Insert text input when user selects "Other" Job Role option
$('#title').on('change', (e) => {
    if(e.target.value === 'other') {
        $("#titleOther").show();
    }
});

//Initially disable color selector until theme is chosen
color.attr('disabled', true);

//Change event handler for tshirt design
$('#design').on('change', (e) => {
    const theme = e.target.value;
    const colors = color.children();

    //Reset color dropdown selection
    color.val('');

    //Loop through colors and if theme matches object key, hide/show colors based on array
    for(let i = 0; i < colors.length; i++){
        if(tShirtColors[theme]){
            color.attr('disabled', false);
            if(tShirtColors[theme].indexOf(colors[i].value) === -1){
                $(colors[i]).hide();
            } else{
                $(colors[i]).show();
            }
        } else {
            color.attr('disabled', true);
        }
    }
});

