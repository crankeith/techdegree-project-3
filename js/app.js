//Selectors
const color = $('#color');
const activityList = $('.activities input');

//Regex
const dayTimeRegex = /— [\w\s\d-]+/;
const priceRegex = /\$\d+/;

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
//Pseudo coe to test regex
// const dayTime =  "JavaScript Frameworks Workshop — Tuesday 9am-12pm, $100".match(dayTimeRegex); //returns an array
// const price =  "JavaScript Frameworks Workshop — Tuesday 9am-12pm, $100".match(priceRegex);
// const dayTimeChosen = dayTime[0];
// const priceChosen = Number(price[0].replace(/\$/,''));

//Event listener for change on activity list that will disable checkboxes if datetime match and tally total cost
activityList.on('change', (e)=>{
    checkActivities(activityList, e.target);
});

//Function to loop through each activity and disable the ones that match datetime in activity name
const checkActivities = (activities, checkedActivity) => {
    const activityText = checkedActivity.nextSibling.textContent;
    const activityTextDayTimeArr = activityText.match(dayTimeRegex);
    const activityTextDayTime = activityTextDayTimeArr[0];

    for(let i = 0; i < activities.length; i++){
        const str = activities[i].nextSibling.textContent;
        const dayTime = str.match(dayTimeRegex);

        //Check to make sure there is a daytime value and it's not the same element
        if(dayTime && str !== activityText){
            //Check to see if daytime values match
            if(activityTextDayTime === dayTime[0]){
                //Check to see if it was checked or unchecked
                if(checkedActivity.checked){
                    $(activities[i]).attr('disabled', true)
                } else {
                    $(activities[i]).attr('disabled', false)
                }
            } else if (!activities[i].checked) {
                $(activities[i]) .attr('disabled', false)
            }
        }
    }
};
//Create total element in Javascript and append
//Create variable to store running total and a function to update total element value



