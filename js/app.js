//Variables
let totalCost = 0;

//Selectors
const color = $('#color');
const activityList = $('.activities input');
const totalCostElement = $('<p id="totalCost">Total Cost: $<span> -</span></p>');
const creditCard = $('#credit-card');
const payPal = creditCard.next();
const bitCoin = creditCard.next().next();
const paymentOptions = $('#payment');

//Regex
const dayTimeRegex = /— [\w\s\d-]+/;
const priceRegex = /\$\d+/;
const emailRegex = /^[\w\d-]+@[\w\d-]+.[\w\d-]+$/;
const ccRegex = /^\d{13,16}$/;
const zipRegex = /^\d{5}$/;
const cvvRegex = /^\d{3}$/;



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

// Insert total cost element
$('.activities').after(totalCostElement);

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

//Event listener for change on activity list that will disable checkboxes if datetime match and tally total cost
activityList.on('change', (e)=>{
    checkActivities(activityList, e.target);
    totalCost = handleCost(totalCost, e.target);
    $('#totalCost span').text(totalCost);
});

//Function to loop through each activity and disable the ones that match datetime in activity name
const checkActivities = (activities, checkedActivity) => {
    const activityText = checkedActivity.nextSibling.textContent;
    const activityTextDayTimeArr = activityText.match(dayTimeRegex);
    const activityTextDayTime = activityTextDayTimeArr ? activityTextDayTimeArr[0] : undefined;

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
            } else if (!activities[i].checked && !activities[i].disabled) {
                $(activities[i]) .attr('disabled', false)
            }
        }
    }
};
//Function to extract cost from string and add to a provided total
const handleCost = (currentTotal, checkedActivity) => {
    const priceStr =  checkedActivity.nextSibling.textContent.match(priceRegex);
    const price = Number(priceStr[0].replace(/\$/,''));
    if(checkedActivity.checked){
        return currentTotal += price;
    } else {
        return currentTotal -= price;
    }
};

//----------
// PAYMENT INFO
//----------

paymentOptions.children()[0].disabled = true;
payPal.hide();
bitCoin.hide();

const hideAllPayments = () => {
    creditCard.hide();
    payPal.hide();
    bitCoin.hide();
};

paymentOptions.on('change', (e) => {
    const selectedPayment = e.target.value;
    hideAllPayments();
    if(selectedPayment === 'paypal'){
        payPal.show();
    } else if(selectedPayment === 'bitcoin'){
        bitCoin.show();
    } else {
        creditCard.show();
    }
});

//----------
// FORM SUBMIT
//----------

$('form').on('submit', (e) => {
    const userName = e.target["user_name"];
    const userEmail = e.target["user_email"];
    const userCC = e.target["user_cc-num"];
    const userZip = e.target["user_zip"];
    const userCvv = e.target["user_cvv"];

    const activities = $(".activities", e.target);
    const numActivitiesChecked = $('label input:checked', activities).length;
    const activitiesErrorMessage = $("<p class=\"errorMessage\" >Select at least 1 activity.</p>");
    $(activities).append(activitiesErrorMessage);
    activitiesErrorMessage.hide();

    if(!userName.value){
        e.preventDefault();
        $(userName).addClass("validationError")
    } else {
        $(userName).removeClass("validationError")
    }

    if(numActivitiesChecked < 1) {
        e.preventDefault();
        activitiesErrorMessage.show();
    } else {
        $('.errorMessage').hide();
    }

    validateInput(e, emailRegex, userEmail);
    validateInput(e, ccRegex, userCC);
    validateInput(e, zipRegex, userZip);
    validateInput(e, cvvRegex, userCvv);
});

const validateInput = (event, regex, input) => {
    if(!regex.test(input.value)){
        event.preventDefault();
        $(input).addClass("validationError")
    } else {
        $(input).removeClass("validationError")
    }
};

