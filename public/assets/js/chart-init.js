let weatherURL = 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=6224ec3c71f49cd08cf354231cae33fb';
let testData  = {};
let seriesData = [];
var option = {};
let xAxisData = [];
let v = null;
let totalDaily = 0;
let yieldYTD_view = document.getElementById('yieldYTD');
// let yieldYTDTime_view = document.getElementById('yieldYTDTime'); // temporarily disabled
let yieldCurrentMonth_view = document.getElementById('yieldCurrentMonth');
let generatedToday_view = document.getElementById('generatedToday');
var yieldToday = 0;
let d = new Date();
var yieldTodayDate = d.toISOString(); /// d.valueOf()      //=> 1586707200000
var yieldTodayLastFetch = d.valueOf();
var hourlyProductionChartData =  [];
let consumedToday = document.getElementById('totalUsageToday');

function fetchLogsFromServer(){
    fetch(fetchURL)
.then((response) => response.json())
        .then((json) => {
            testData = json;
            xAxisData = [];
            testData['777']['0'].forEach((val)=>{
                xAxisData.push(val[0].substring(0,2));
                totalDaily = 0;
                val[1].forEach((n)=>{
                    totalDaily  += n;
                });
                seriesData.push(totalDaily/1000);
            });
            //console.log('in teh response');
            /** top bar stats **/
            yieldCurrentMonth_view.innerHTML = new Intl.NumberFormat().format(Math.round(testData['801']['170']['107']/1000)) + " KW";

            const ytdText = new Intl.NumberFormat().format(Math.round(testData['801']['170']['108']/1000));
            yieldYTD_view.innerHTML = ytdText + " KW";
            //yieldYTDTime_view.innerHTML = testData['801']['170']['100'].replace(' ', '<br>'); // future feature

            /** generated today **/
            yieldToday = new Intl.NumberFormat().format(Math.round((testData['801']['170']['105'] / 1000)));
            console.log('today\'s data' + testData['801']['170']['105']);
            generatedToday_view.innerHTML = yieldToday + "KW";

            hourlyProductionChartOption.dataset.source = testData['999'];
            option.xAxis[0].data = xAxisData;

            if (option && typeof option === 'object') {
                dailyYieldChart.setOption(option);
            }
            if(hourlyProductionChartOption && typeof hourlyProductionChartOption === 'object'){
                hourlyProductionChart.setOption(hourlyProductionChartOption);
            }

            consToday = new Intl.NumberFormat().format(Math.round((testData['801']['170']['111'] / 1000)));
            consumedToday.innerHTML = consToday + "KW";
        });
}

// RUN THE FETCH THEN WAIT AND RUN EVERY 9 MINUTES
fetchLogsFromServer();
var i=0;
setInterval(()=>{
    //console.log('ran the script ' + i)
    fetchLogsFromServer();
    i++;
}, 9*60*1000)

/**
 * DAILY PRODUCTION DATA FOR THIS MONTH
 */
let dom = document.getElementById('daily-production');
let dailyYieldChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});

option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: ['Production']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
        }
    ],
    yAxis: [
        {
            name: 'KW',
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Total Production',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: seriesData
        }
    ]
};

window.addEventListener('resize', dailyYieldChart.resize);
/**
 * HOURLY PRODUCTION DATA
 */
/** hourly chart */
let hourlyProductionChart = echarts.init(document.getElementById('hourly-production'));

var hourlyProductionChartOption = {
    legend: {},
    tooltip: {
        trigger: 'axis',
    },
    dataset: {
        source:hourlyProductionChartData,
        dimensions: ['timestamp', 'yield'],
    },
    xAxis: { type: 'time' },
    yAxis: { },
    series: [
        {
            name: 'all-inverters',
            type: 'line',
            encode: {
                x: 'timestamp',
                y: 'Yield' // refer sensor 1 value
            }
        }]
};
