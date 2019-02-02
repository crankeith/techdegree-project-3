//Variables
let totalCost = 0;

//Selectors
const $form = $('form');
const color = $('#color');
const $emailInput  = $('#mail');
const $activities = $('.activities');
const activityList = $('.activities input');
const creditCard = $('#credit-card');
const payPal = creditCard.next();
const bitCoin = creditCard.next().next();
const paymentOptions = $('#payment');

//Regex
const dayTimeRegex = /— [\w\s\d-]+/;
const priceRegex = /\$\d+/;
const emailRegex = /^[\w\d-]+@[\w\d-]+\.[\w\d-]+$/;
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

//Insert Elements Into DOM
// Total cost
$activities.after($('<p id="totalCost">Total Cost: $<span> -</span></p>'));
// Error Messages
const $nameErrorMessage = addErrorMessage($('#name') ,"The name field is required to complete this form.");
const $emailMissingErrorMessage = addErrorMessage($emailInput,"The email field is required to complete this form.");
const $emailErrorMessage = addErrorMessage($emailInput,"The email provided is not a proper format (e.g. email@sample.com)");
const $activitiesErrorMessage = addErrorMessage($activities,"Select at least 1 activity.");
const $paymentMissingErrorMessage = addErrorMessage(paymentOptions,"Please select a payment method");
const $creditCardErrorMessage = addErrorMessage($('#cc-num'),"Credit card value must be between 13 and 16 digits");
const $zipErrorMessage = addErrorMessage($('#zip'),"Zip code must be exactly 5 digits.");
const $cvvErrorMessage = addErrorMessage($('#cvv'),"CVV code must be exactly 3 digits.");

//----------
// TSHIRT DESIGN
//----------

//Initially disable color selector until theme is chosen
color.hide();
color.prev().hide();

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
        color.show();
        color.prev().show();
        for(let i = 0; i < colors.length; i++){
                if(regex.test(colors[i].textContent)){
                    $(colors[i]).show();
                } else{
                    $(colors[i]).hide();
                }
            }
        }
    else {
        color.hide();
        color.prev().hide();
    }
});

//----------
// ACTIVITIES
//----------

//Add error message to activities and hide it for later


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


//----------
// PAYMENT INFO
//----------

paymentOptions.children()[0].disabled = true;
payPal.hide();
bitCoin.hide();
paymentOptions.children()[1].selected = true;

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
// FORM REAL-TIME VALIDATION
//----------


$form.on('keyup', (e) => {
    const elem = e.target;
    if(elem.id === "name"){
        if(!elem.value){
            displayError(e, elem, $nameErrorMessage);
        } else {
            hideError(elem, $nameErrorMessage);
        }
    } else if(elem.id === "mail"){
        validateInput(e, emailRegex, elem, $emailErrorMessage);
    } else if(elem.id === "cc-num"){
        validateInput(e, ccRegex, elem, $creditCardErrorMessage);
    } else if(elem.id === "zip"){
        validateInput(e, zipRegex, elem, $zipErrorMessage);
    } else if(elem.id === "cvv"){
        validateInput(e, cvvRegex, elem, $cvvErrorMessage);
    }
});

//----------
// FORM SUBMIT
//----------

$form.on('submit', (e) => {
    const userName = e.target["user_name"];
    const userEmail = e.target["user_email"];
    const userCC = e.target["user_cc-num"];
    const userZip = e.target["user_zip"];
    const userCvv = e.target["user_cvv"];
    const $numActivitiesChecked = $('label input:checked', $activities).length;

    //Check name
    if(!userName.value){
        displayError(e, userName, $nameErrorMessage);
    } else {
        hideError(userName, $nameErrorMessage);
    }

    //Check email address
    if(!userEmail.value){
        displayError(e, userEmail, $emailMissingErrorMessage);
    } else {
        hideError(userEmail, $emailMissingErrorMessage);
        validateInput(e, emailRegex, userEmail, $emailErrorMessage);
    }

    //Check Activities
    if($numActivitiesChecked < 1) {
        e.preventDefault();
        $activitiesErrorMessage.show();
    } else {
        $activitiesErrorMessage.hide();
    }

    //Check Payment Method
    if(paymentOptions[0].value === "select_method"){
        $paymentMissingErrorMessage.show();
    } else if(paymentOptions[0].value === "credit card"){
        $paymentMissingErrorMessage.hide();
        validateInput(e, ccRegex, userCC, $creditCardErrorMessage);
        validateInput(e, zipRegex, userZip, $zipErrorMessage);
        validateInput(e, cvvRegex, userCvv, $cvvErrorMessage);
    }
});

//---------
//FUNCTIONS
//---------


//ERROR HANDLING

function addErrorMessage(element, str){
    const errorMsg =  $("<span class=\"errorMessage\" >" + str + "</span>");
    element.after(errorMsg);
    errorMsg.hide();
    return errorMsg;
}

function displayError (event, input, errorMsgElem) {
    event.preventDefault();
    $(input).addClass("validationError");
    errorMsgElem.show()
}

function hideError (input, errorMsgElem){
    $(input).removeClass("validationError");
    errorMsgElem.hide();
}

function validateInput (event, regex, input, errorMsgElem) {
    if(!regex.test(input.value)){
        displayError (event, input, errorMsgElem);
    } else {
        hideError(input, errorMsgElem);
    }
}

//Extract cost from string and add to a provided total
function handleCost (currentTotal, checkedActivity) {
    const priceStr =  checkedActivity.nextSibling.textContent.match(priceRegex);
    const price = Number(priceStr[0].replace(/\$/,''));
    if(checkedActivity.checked){
        return currentTotal += price;
    } else {
        return currentTotal -= price;
    }
}

function hideAllPayments () {
    creditCard.hide();
    payPal.hide();
    bitCoin.hide();
}
