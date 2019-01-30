const color = $('#color');

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

//----------
// TSHIRT DESIGN
//----------

//Initially disable color selector until theme is chosen
color.attr('disabled', true);

//Change event handler for tshirt design
$('#design').on('change', (e) => {
    const selectedTheme = e.target.selectedOptions[0].textContent;
    const colors = color.children();
    //Create regex by removing beginning theme text
    const regex = new RegExp(selectedTheme.replace('Theme - ', ''));

    //Reset color dropdown selection
    color.val('');

    //Loop through colors and if the regex matches, hide/show colors based on array
    if(selectedTheme !== 'Select Theme'){
        color.attr('disabled', false);
        for(let i = 0; i < colors.length; i++){
                if(regex.test(colors[i].textContent)){
                    $(colors[i]).show();
                } else{
                    $(colors[i]).hide();
                }
            }
        }
    else {
        color.attr('disabled', true);
    }
});

//----------
// ACTIVITIES
//----------
//Some sample code/regex to retrieve the day/time for comparison
const dayTimeRegex = /— [\w\s\d-]+/;
const priceRegex = /\$\d+/;
const dayTime =  "JavaScript Frameworks Workshop — Tuesday 9am-12pm, $100".match(dayTimeRegex); //returns an array
const price =  "JavaScript Frameworks Workshop — Tuesday 9am-12pm, $100".match(priceRegex);
const dayTimeChosen = dayTime[0];
const priceChosen = Number(price[0].replace(/\$/,''));
console.log(dayTimeChosen);
console.log(priceChosen);
//Add event listener for change? that will disable checkboxes based on function
//Create function to use when looping through each item to hide ones that match "value"
//Create total element in Javascript and append
//Create variable to store running total and a function to update total element value



