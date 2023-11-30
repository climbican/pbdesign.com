let messageDiv = document.getElementById('welcomeMessageDiv');
let footerDiv = document.getElementById('footerDiv');
footerDiv.style.display = 'none';
let welcomeMessage = "Welcome to BlueYonder ";
let companyName = "";

// // NOTE: IF YOU WANT TO KEEP THIS EXTRA SECURE CHANGE THE APPLICATION ID
const _APPLICATION_ID = 'b3eca716-1757-4bdf-8169-c34900322fe893';

messageDiv.innerHTML = welcomeMessage + companyName;

let tokenData = {};
let tokenValidUntil = 0;
let eventData = {};
let bannerText = '';
let startTimeG = 0;
let endTimeG = 0;
let footerVisible = false;

window.localStorage.setItem('tokenData', {});

function getNewToken(callback){
    let xhr = new XMLHttpRequest();

    var data = new FormData();
    console.log('app id ' + appId);
    data.append('app_id', appId);
    //fetch token
    // url is on parent page
    xhr.open('POST', getAuthCodeURL);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if(xhr.status === 200){
            footerVisible = true;
            tokenData = JSON.parse(xhr.response);
            tokenValidUntil = Date.now() + (3500 * 1000);
            let at = tokenData.access_token;
            window.localStorage.setItem('tokenData', JSON.stringify({tokenValidUntil: tokenValidUntil, accessToken: at}));
            callback();
        }
        else{
            tokenData.tokenValidUntil = 0;
            console.log('There was an issue with the request');
            alert('Oops, there was an issue');
        }
    };
    xhr.send(data);
}

function getNextCalendarEvent() {
    const d = new Date();
    let startTime = d.toISOString();
    /*
    * THIS DEFINES THE RANGE OF TIME FROM NOW + X TO LIMIT THE NUMBER OF EVENTS THAT WILL BE QUERIED
     */
    const numMinutesRange = 6;
    let endTime = new Date( d.getTime() + (numMinutesRange*60*1000)).toISOString();

    // test to match microsoft date format.
    let t = startTime.split(".");
    let o = endTime.split(".");

    startTime = t[0];
    endTime = o[0];

    startTime = startTime.replace(":00", '');
    endTime = endTime.replace(":00", '');
    let xhrE = new XMLHttpRequest();
    //MICROSOFT GRAPH URL TO WITH EMAIL ADDRESS ACCOUNT IN IT.  CHANGE IF NEEDED
    const urlToCall = 'https://graph.microsoft.com/v1.0/users/michael.rumack@pbdesign.co.uk/calendar/events?$select=subject,bodyPreview,organizer,attendees,start,end&$filter=start/dateTime%20ge%20%27'+startTime+'%27%20and%20start/dateTime%20lt%20%27'+endTime+'%27';

    xhrE.open('GET', urlToCall, true);
    xhrE.setRequestHeader('Authorization', 'Bearer ' + tokenData.access_token);

    xhrE.onload = function (e) {
        if (xhrE.status === 200) {
            //console.log('sent request for events');
            eventData = xhrE.response;
            const evData = JSON.parse(eventData);

            if(evData.value.length > 0){
                //console.log('event data exists and is being set and set to visible');
                messageDiv.innerHTML = welcomeMessage + " -- " + evData.value[0].bodyPreview + " from "  + evData.value[0].subject;
                footerDiv.style.display = 'block';
                endTimeG = evData.value[0].end.dateTime;
                ///console.log('end time set to ' + endTimeG);
                //console.log('the data raw ' + JSON.stringify(evData.value[0].end));
                footerVisible = true;
            }
        }
        else {
            console.log('there was an issue fetching the event')
        }
    };

    xhrE.send();
}

function doNothing(){return true;}
// FETCH EVENTS FROM CALENDAR, THIS WILL CONTAIN THE INFO TO POPULATE THE BANNER
// // WHEN TO START AND REMOVE BANNER
function fetchEvents(){
    console.log('ran fetch events');
    if(footerVisible){
        //console.log('footer is visible');
        //test time and set hidden and
        let nd = new Date().toISOString();
        //console.log('test data endTime ' + endTimeG + ' compared to : nd ' + nd);
        if(endTimeG < nd){
            // set footerVisible to false
            endTimeG = 0;
            messageDiv.innerHTML = '';
            footerVisible = false;
            footerDiv.style.display = 'none';
        }
    }

    if(tokenValidUntil < Date.now()){
        getNewToken(getNextCalendarEvent);
    }
    else{
        getNextCalendarEvent();
    }
}
// INTERVAL OF TIME USED TO LOOK FOR NEW EVENTS
// // RECOMMENDATION: USE 50-60% OF THE RANGE TIME
const searchInterval = 3;
setInterval(fetchEvents, (searchInterval*60*1000));
