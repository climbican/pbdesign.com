<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <title>PB Design & Developments Ltd Scrolling Welcome footer</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="apple-touch-icon" href="icon.png">
    <!-- Place favicon.ico in the root directory -->

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">

    <meta name="theme-color" content="#fafafa">
    <style>
        .footer {
            height: 70px;
            width: 100%;
            overflow: hidden;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 10;
        }
        .footer img {
            float: left;
            height: 68px;
            background: #555;
        }
        .footer h1 {
            font-size: 2em;
            color: #222222;
            position: relative;
            bottom: 18px;
            left: 140px;
        }

        #imgcontainer { float:left; margin-left:3px; height:100%;}

        marquee { width:94%; margin-top:12px; }
    </style>
</head>

<body>
<!-- Add your site or application content here -->
<p>The example is for the footer and shows the scrolling bar at the bottom up to 5 min before a meeting time.</p>
<p>Short testing directions:</p>
<div>
    <ol>
        <li>Create an appointment at least 6 minutes after current time</li>
        <li><ul>
                <li>in the "Subject" line add the name of the company.</li>
                <li>in the body of the meeting add the names of the visiting clients exactly as you want it to be seen in the footer.</li>
            </ul></li>
        <li>Add end time approximately 10 min after start</li>
        <li>An additional test can be done by adding back to back meetings.  <br>The new meeting text will overwrite the existing one.</li>
    </ol>
</div>
<div>
    Note: If there is a font type that you want to use please let me know and I will make the change.
</div>
<div class="footer" id="footerDiv">
    <div id="imgcontainer"><img src="{{url('assets/img/pb-design-logo.png')}}"/></div>
    <marquee scrollamount="10">
        <h1 id="welcomeMessageDiv">Welcome Message</h1>
    </marquee>
</div>

<script>
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
        data.append('app_id', _APPLICATION_ID);
        //fetch token
        xhr.open('POST', 'https://ldgc1.ledgedog.com/get_auth_code_by.php');
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

</script>
</body>
</html>
