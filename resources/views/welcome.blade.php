<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<!--<![endif]-->
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-layout="vertical" data-topbar="light" data-sidebar="dark" data-sidebar-size="sm-hover">
<head>
    <meta charset="utf-8"/>
    <title>PBDesign Solar log charts</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="{{asset('assets/img/favicon.ico')}}">
    <!-- Layout config Js -->
    <script src="{{asset('assets/js/layout.js')}}"></script>
    <!-- Bootstrap Css -->
    <link href="{{asset('assets/css/bootstrap.min.css')}}" rel="stylesheet" type="text/css" />
    <!-- Icons Css -->
    <link href="{{asset('assets/css/icons.min.css')}}" rel="stylesheet" type="text/css" />
    <!-- App Css-->
    <link href="{{asset('assets/css/app.min.css')}}" rel="stylesheet" type="text/css" />
    <!-- Custom CSS -->
    <link href="{{asset('assets/css/custom.css')}}" rel="stylesheet" type="text/css"/>
    <script defer src="https://api.forecast.solar/chart/init.js"></script>
    <link href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" rel="stylesheet"/>
    <script src="assets/libs/axios/axios.min.js"></script>
</head>
<body>
<!-- Begin page -->
<div id="layout-wrapper">
    <!-- removeNotificationModal -->
    <div id="removeNotificationModal" class="modal fade zoomIn" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="NotificationModalbtn-close"></button>
                </div>
                <div class="modal-body">
                    <div class="mt-2 text-center">
                        <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f7b84b,secondary:#f06548" style="width:100px;height:100px"></lord-icon>
                        <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                            <h4>There was an issue.</h4>
                            <p class="text-muted mx-4 mb-0">Please contact admin or developer of this page</p>
                        </div>
                    </div>
                    <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
                        <button type="button" class="btn w-sm btn-danger" id="delete-notification">Close</button>
                    </div>
                </div>

            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <!-- ============================================================== -->
    <!-- Start right Content here -->
    <!-- ============================================================== -->
    <div class="main-content">

        <div class="container-fluid p-2">
            <div class="row">
                <!--- FIRST CHART --->
                <div class="col-3">
                    <div class="card card-animate overflow-hidden">
                        <div class="position-absolute start-0" style="z-index: 0;">
                            <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
                                <style>
                                    .s0 {
                                        opacity: .05;
                                        fill: var(--vz-success)
                                    }
                                </style>
                                <path id="Shape 8" class="s0" d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z" />
                            </svg>
                        </div>
                        <div class="card-body" style="z-index:1 ;">
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1 overflow-hidden">
                                    <p class="text-uppercase fw-medium text-muted text-truncate mb-3"> Total Generated YTD</p>
                                    <h4 class="fs-22 fw-semibold ff-secondary mb-0"><span class="counter-value" data-target="yieldYTD" id="yieldYTD">0</span></h4>
                                </div>
                                <!--<div class="flex-shrink-0">
                                    <div id="yieldYTDTime" data-colors='["--vz-danger"]' class="apex-charts" dir="ltr">Used %</div>
                                </div>-->
                            </div>
                        </div><!-- end card body -->
                    </div>
                </div>
                <!--- SECOND CHART --->
                <div class="col-3">
                    <div class="card card-animate overflow-hidden">
                        <div class="position-absolute start-0" style="z-index: 0;">
                            <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
                                <style>
                                    .s0 {
                                        opacity: .05;
                                        fill: var(--vz-success)
                                    }
                                </style>
                                <path id="Shape 8" class="s0" d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z" />
                            </svg>
                        </div>
                        <div class="card-body" style="z-index:1 ;">
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1 overflow-hidden">
                                    <p class="text-uppercase fw-medium text-muted text-truncate mb-3"> Total Generated This Month</p>
                                    <h4 class="fs-22 fw-semibold ff-secondary mb-0"><span class="counter-value" data-target="yieldCurrentMonth" id="yieldCurrentMonth">0</span></h4>
                                </div>
                                <!--<div class="flex-shrink-0">
                                    <div id="totalGeneratedCurrentMonth" data-colors='["--vz-danger"]' class="apex-charts" dir="ltr">Used %</div>
                                </div>-->
                            </div>
                        </div><!-- end card body -->
                    </div>
                </div>
                <!--- THIRD CHART --->
                <div class="col-3">
                    <div class="card card-animate overflow-hidden">
                        <div class="position-absolute start-0" style="z-index: 0;">
                            <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
                                <style>
                                    .s0 {
                                        opacity: .05;
                                        fill: var(--vz-success)
                                    }
                                </style>
                                <path id="Shape 8" class="s0" d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z" />
                            </svg>
                        </div>
                        <div class="card-body" style="z-index:1 ;">
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1 overflow-hidden">
                                    <p class="text-uppercase fw-medium text-muted text-truncate mb-3"> Generated today</p>
                                    <h4 class="fs-22 fw-semibold ff-secondary mb-0"><span class="counter-value" data-target="generatedToday" id="generatedToday">0</span></h4>
                                </div>
                                <div class="flex-shrink-0">
                                    <div id="estimatedToGenToday" data-colors='["--vz-danger"]' class="apex-charts" dir="ltr"></div>
                                </div>
                            </div>
                        </div><!-- end card body -->
                    </div>
                </div>
                <!--- FOURTH CHART --->
                <div class="col-3">
                    <div class="card card-animate overflow-hidden">
                        <div class="position-absolute start-0" style="z-index: 0;">
                            <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
                                <style>
                                    .s0 {
                                        opacity: .05;
                                        fill: var(--vz-success)
                                    }
                                </style>
                                <path id="Shape 8" class="s0" d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z" />
                            </svg>
                        </div>
                        <div class="card-body" style="z-index:1 ;">
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1 overflow-hidden">
                                    <p class="text-uppercase fw-medium text-muted text-truncate mb-3"> Total Usage for Today</p>
                                    <h4 class="fs-22 fw-semibold ff-secondary mb-0"><span class="counter-value" data-target="totalUsageToday" id="totalUsageToday">0</span></h4>
                                </div>
                                <div class="flex-shrink-0">
                                    <div id="interview_chart" data-colors='["--vz-danger"]' class="apex-charts" dir="ltr"></div>
                                </div>
                            </div>
                        </div><!-- end card body -->
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xl-6">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title mb-0">Weather</h4>
                        </div>
                        <div class="card-body">
                            <div id="mapFrame" style="height:400px;"></div>
                        </div>
                    </div>
                    <!-- end card -->
                </div>
                <!-- end col -->
                <div class="col-xl-6">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title mb-0">Production estimate East today</h4>
                        </div>
                        <div class="card-body">
                            <div style="text-align:center">
                                <script defer src="https://api.forecast.solar/chart/5309117d.js"></script>
                            </div>
                        </div>
                    </div>
                    <!-- end card -->
                </div>
                <!-- end col -->
            </div>
            <!-- end row -->

            <div class="row">
                <div class="col-xl-6">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title mb-0">Daily Production by month / day</h4>
                        </div>
                        <div class="card-body">
                            <div id="daily-production" data-colors='["--vz-success"]' class="e-charts"></div>
                        </div>
                    </div>
                    <!-- end card -->
                </div>

                <!-- end col -->
                <div class="col-xl-6">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title mb-0">Hourly Production</h4>
                        </div>
                        <div class="card-body">
                            <div id="hourly-production" data-colors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' class="e-charts"></div>
                        </div>
                    </div>
                    <!-- end card -->
                </div>
                <!-- end col -->
            </div>
            <!-- end row -->
        </div>
    </div>
    <!-- container-fluid -->
</div>
<!-- end main content-->

</div>
<!-- END layout-wrapper -->
<!-- JAVASCRIPT -->
<script src="{{asset('assets/libs/bootstrap/js/bootstrap.bundle.min.js')}}"></script>
<script src="{{asset('assets/libs/node-waves/waves.min.js')}}"></script>
<script src="{{asset('assets/libs/feather-icons/feather.min.js')}}"></script>
<script src="{{asset('assets/libs/lord-icons/lord-icon-2.1.0.js')}}"></script>

<!-- echarts js -->
<script src="{{asset('assets/libs/echarts/dist/echarts.min.js')}}"></script>
<script>
    let weatherURL = 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=6224ec3c71f49cd08cf354231cae33fb';
    let testData  = {};
    let seriesData = [];
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

    function fetchLogsFromServer(){
        fetch('{{url('fetch/logs')}}')
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
                /** top bar stats **/
                yieldCurrentMonth_view.innerHTML = new Intl.NumberFormat().format(Math.round(testData['801']['170']['107']/1000)) + " KW";

                const ytdText = new Intl.NumberFormat().format(Math.round(testData['801']['170']['108']/1000));
                yieldYTD_view.innerHTML = ytdText + " KW";
                //yieldYTDTime_view.innerHTML = testData['801']['170']['100'].replace(' ', '<br>'); // future feature

                /** generated today **/
                let yieldTodayTxt = new Intl.NumberFormat().format(Math.round(testData['801']['170']['105']));
                yieldToday = yieldTodayTxt;
                generatedToday_view.innerHTML = yieldTodayTxt + " W";

                hourlyProductionChartOption.dataset.source = testData['999'];

                //let app = {};

                if (option && typeof option === 'object') {
                    dailyYieldChart.setOption(option);
                }
                if(hourlyProductionChartOption && typeof hourlyProductionChartOption === 'object'){
                    hourlyProductionChart.setOption(hourlyProductionChartOption);
                }
            });
    }

    // RUN THE FETCH THEN WAIT AND RUN EVERY 9 MINUTES
    fetchLogsFromServer();
    setTimeout(function(){
        fetchLogsFromServer();
    }, 15*60*1000)

    /**
     * DAILY PRODUCTION DATA FOR THIS MONTH
     */
    let dom = document.getElementById('daily-production');
    let dailyYieldChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    let option = {
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

</script>
<!-- App js -->
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
<script src="{{asset('assets/js/weather-map.init.js')}}"></script>
</body>
</html>
