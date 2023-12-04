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
    <script src="{{asset('assets/libs/axios/axios.min.js')}}"></script>
    <link href="{{asset('assets/css/banner_styles.css')}}" rel="stylesheet" type="text/css"/>
    <style>
        .main-container {
            height: 100vh;
            width: 100vw;
            border:dashed darkgreen 3px;
        }
    </style>
</head>
<body>
<!-- Begin page -->
<div class="main-container">
    <!-- removeNotificationModal -->
    <!-- ============================================================== -->
    <!-- Start right Content here -->
    <!-- ============================================================== -->

            <div class="row" style="height:16% !important;">
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

            <div style="height:36% !important;border:yellow solid 3px;">
                <div style="width:48%;float:left;">
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
                <div style="width:48%;float:left;">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title mb-0">Production estimate for today</h4>
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
            <div  style="height:36% !important;border:purple solid 3px;">
                <div style="width:48%;float:left;">
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
                <div style="width:48%;float:left;">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title mb-0">Hourly Production in KW</h4>
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
<!-- end main content-->
<div class="footer" id="footerDiv">
    <div id="imgcontainer"><img src="{{url('assets/img/pb-design-logo.png')}}"/></div>
    <marquee scrollamount="10">
        <h1 id="welcomeMessageDiv">Welcome Message</h1>
    </marquee>
</div>
</div>
<!-- END layout-wrapper -->
<!-- JAVASCRIPT -->
<script src="{{asset('assets/libs/bootstrap/js/bootstrap.bundle.min.js')}}"></script>
<script src="{{asset('assets/libs/node-waves/waves.min.js')}}"></script>
<script src="{{asset('assets/libs/feather-icons/feather.min.js')}}"></script>
<script src="{{asset('assets/libs/lord-icons/lord-icon-2.1.0.js')}}"></script>

<!-- echarts js -->
<script src="{{asset('assets/libs/echarts/dist/echarts.min.js')}}"></script>
<!-- CHART FETCH AND INIT SCRIPTS -->
<script>var fetchURL = '{{url('fetch/logs')}}';</script>
<script src="{{asset('assets/js/chart-init.js')}}"></script>
<!-- App js -->
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
<script src="{{asset('assets/js/weather-map.init.js')}}"></script>
<!-- BANNER CODE -- FIRST LINE IS TO GENERATE THE URL FOR THE AUTH CODE -->
<!-- TODO: LEFT OFF HERE ... GET AUTH CODE IS FORKED UP AND RETURNS AN ERROR -->
<script>
    var getAuthCodeURL = '{{url('api/get/auth/code')}}';
    var appId = "{{env('APPLICATION_ID')}}"
</script>
<script src="{{asset('assets/js/banner_init.js')}}"></script>
</body>
</html>
