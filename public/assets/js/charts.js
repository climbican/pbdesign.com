/** start
 *
 * '{"801":{"170":null}}'
 * **/
//const https = require('https');
if (typeof localStorage === "undefined" || localStorage === null) {
    let LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const deviceIpAddress = 'http://157.231.187.42:5179'; //'remote.pbdesign.co.uk:5179';
const cmd = '/getjp';
let loginData = `u=installer&p=Wi11iam9869`;
let userPass = 'Wi11iam9869';
let data = [];
let deviceInfo = [];
//let loginData = `u=steve.smith@pbdesign.co.uk&p=Wi11iam328!`;
localStorage.setItem('dataToken', '');
let dataToken = '';
let commandSet = '{"854":null,"877":null,"878":null}';
let requestCounter = 0;

// DIFFERENT SETS OF STATS
const month_year = '{"801":{"170":null}}';
const startupData = `{"152":null,"161":null,"162":null,"447":null,"610":null,"611":null,"617":null,"706":null,"739":null,"740":null,"744":null,"800":{"100":null,"160":null},"801":{"101":null,"102":null},"858":null,"895":{"100":null,"101":null,"102":null,"103":null,"104":null,"105":null}}`;
const inverterDataArray = [];
const pollingData = '{"447":null,"777":{"0":null},"778":{"0":null},"801":{"170":null}}';
const historicData = '{"854":null,"877":null,"878":null}';
const fastpollData = '{"608":null,"780":null,"781":null,"782":null,"794":{"0":null},"801":{"175":null},"858":null}';
const historicDataJSONmonths = '/months.json?_=';
const historicDataJSONyears = '/years.json?_=';

let deviceList = [];
let brandlist = [];
const deviceClassList = ['Inverter', 'Sensor', 'counter', 'Hybrid-System', 'Battery', 'An intelligent consumer', 'Switch', 'Heat pump', 'Heating Rod', 'Charging Station'];
let numinv = 0;
const names = [];
let numsg = 0;
const namessg = new Array(10);

const deviceinfos = [];
const devicetypes = [];
const devicebrands = [];
const deviceclasses = [];

let uzimp;
let battDevicePresent = false;
let battPresent = false;
const battindex = [];
let battarrind = 0;
let battdata = [];
let testend;
let testj = 0;
let testi = 0;
let feed = 0;

let historic = false;
let histCRON = '0 0 * * *'

let forecast = false;
const urlForecast = 'https://api.forecast.solar/';
let cmdForecast;
let lat;
let lon;
let dec;
let az;
let kwp;


let optionsDefault = {
    method: 'post',
    headers: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'SolarLog': `${dataToken}`,
        'banner_hidden':false
    }
};

let optionsJson = {
    //port,
    method: 'get',
    headers: {
        'Accept': '*/*',
        'WithCredentials': true,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'SolarLog': `${dataToken}`,
        'banner_hidden':false
    }
};
async function login() {
    try {
        const options = JSON.parse(JSON.stringify(optionsDefault));
        options.headers = {
            banner_hidden: false
        };
        console.debug(`Options: ${JSON.stringify(options)}`);
        console.debug('start LOGIN');

        try {
            const response = await axios.post(`${deviceIpAddress}/login`, loginData, options);

            console.debug(`Status-Code: ${response.status}`);
            console.debug(`Header: ${JSON.stringify(response.headers)}`)
            console.debug(`Response.body= ${response.data}`);

            const token = response.headers['Set-Cookie'].toString();
            console.log('token data ' + token);
            //dataToken = token.slice(9);
            localStorage.setItem('dataToken', dataToken);
            console.log('full token ' + JSON.stringify(token));
            console.debug(`Datatoken: ${dataToken}`);
        } catch (error) {
            console.info(`Login - https reqest on line 113 - Error: ${error}`);
            if (requestCounter > 4) {
                console.warn('Login failed several times, queries stopped, restart adapter in 90 seconds.');

                console.log('unload'); //unload();

                /**let restartTimer = setTimeout(() => {
                    restartTimer = null;
                    // not sure what this does restartAdapter()
                }, 90000);**/
            } else {
                console.info(`Error beim Login: Statuscode:${error}. Run login again at the next opportunity.`)
                requestCounter++;
            }
        }
    } catch (e) {
        console.warn(`Login - Error: ${e.message}`);
    }
} //END login

async function logCheck(dataLC) {
    try {
        if (!userPass) {
            await httpsRequest(dataLC);
        } else {
            const options = JSON.parse(JSON.stringify(optionsDefault));
            options.headers['SolarLog'] = `${dataToken}`;
            options.headers['banner_hidden'] = false;

            console.debug(`Options: ${JSON.stringify(options)}`);
            console.debug('Start LogCheck');

            try {
                const response = await axios.get(`${deviceIpAddress}/logcheck?`, options);

                console.debug(`Status-Code: ${response.status}`);
                console.debug(`Header: ${JSON.stringify(response.headers)}`)
                console.debug(`Response.body= ${response.data}`);

                const bodyArray = response.data.split(';');
                console.debug(`bodyarray0= ${bodyArray[0]}`);

                //logcheck: 0;0;1 = nicht angemeldet, 1;2;2= installateur 1;3;3 =inst/pm 1;1;1 =benutzer
                if (bodyArray[0] != 0) {
                    console.debug('login OK, starte Request');
                    await httpsRequest(dataLC);
                } else {
                    console.info('login Not OK, start first login, then request');
                    await login();
                    setTimeout(async () => await logCheck(dataLC), 2000);
                }
            } catch (error) {
                console.info(`Logcheck - axios - Error: ${error}`);

                if (requestCounter > 4) {
                    console.warn('\n' +
                        'Log check failed several times, queries are stopped, restart adapter in 90 seconds.');
                    //unload();

                    restartTimer = setTimeout(() => {
                        restartTimer = null;
                        //restartAdapter()
                    }, 90000);
                } else {
                    console.info(`Log check error: status code:${error}. Run Logcheck again at the next opportunity.`)
                    requestCounter++;
                }
            }
        }
    } catch (e) {
        console.warn(`Logcheck - Error: ${e.message}`);
    }
} //logcheck END

async function httpsRequest(reqData) { //Performs a query on the solarlog and passes the result on for evaluation.
    try {
        let reqAddress = deviceIpAddress;
        let options;
        if (reqData.includes('.json')) {

            //console.debug('DATA: ' + reqdata + ' and DATALENGTH: ' + reqdata.length)
            options = JSON.parse(JSON.stringify(optionsJson));
            options.headers['SolarLog'] = `${dataToken}`;
            options.headers['banner_hidden'] = false;
            //options.pathname = reqdata + Date.now().toString();

            reqAddress = deviceIpAddress + reqData + Date.now().toString();

            options.url = `${reqAddress}`;
            //options.params = {
            //`_`: `${Date.now().toString()}`
            //};

        } else {
            //const data = 'token=' + datatoken + ';preval=none;' + reqdata;

            //console.debug('DATA: ' + reqdata + ' and DATALENGTH: ' + reqdata.length)
            options = JSON.parse(JSON.stringify(optionsDefault));
            options.headers['SolarLog'] = `${dataToken}`;
            options.headers['banner_hidden'] = false;

            options.url = `${reqAddress}${cmd}`;
            options.data = `token=${dataToken};preval=none;${reqData}`

            //options.pathname = cmd;
            //options.headers['Content-Length'] = data.length;
        }

        console.debug(` OPTIONS: ${JSON.stringify(options)}`); //ReqAddress: ${reqAddress} ReqData: ${reqData}

        try {
            const response = await axios( /*`${reqAddress}${cmd}`, `token=${dataToken};preval=none;${reqData}`, */ options);

            console.debug(`Status-Code: ${response.status}`);
            console.debug(`Header: ${JSON.stringify(response.headers)}`);
            console.debug(`Response.body= ${JSON.stringify(response.data)}`);

            const bodyr = JSON.stringify(response.data);

            requestCounter = 0;
            if (reqData.includes('.json')) {
                //await read Solarlog DataJson(reqData, bodyr);
                //console.debug(`END Request: ${reqData}`);
            } else {
                await read_solarlog_data(reqData, bodyr);
                //console.debug(`END Request: ${reqData}`);
            }
        } catch (error) {
            console.info(`httpsRequest - axios - Error: ${error}`);

            if (requestCounter > 4) {
                console.warn('Multiple incorrect http requests, queries are stopped, restart adapter in 90 seconds.');
                //unload();

                let restartTimer = setTimeout(() => {
                    restartTimer = null;
                    //restartAdapter()
                    console.info('restart Adapter');
                }, 90000);
            } else {
                console.info(`Dang something gone wrong: Statuscode:${error}. Code check time :).`);
                requestCounter++;
            }
        }
    } catch (e) {
        console.warn(`JSON-parse-Error httpsRequest: ${e.message}`);
    }
} //end httpsRequest


async function read_solarlog_data(reqData, resData) {
    try {
        //console.debug('Process Data');
        //console.debug(`Data: ${reqData}`);
        //console.debug(`Evaluation data: ${resData}`);

        switch (reqData.slice(0, 6)) {
            case '{"141"': //inverter names and deviceinfo-code
                try {
                    const dataJuzna = JSON.parse(resData)[141];

                    for (let y = 0; y < (numinv - 1); y++) {
                        names.push(dataJuzna[y][119]);
                        console.debug(`Inverters: ${names}`);
                        deviceInfo.push(dataJuzna[y][162]);
                        console.debug(`Deviceinfos: ${deviceInfo}`);
                    }

                    await defDeviceInfo();
                } catch (e) {
                    console.warn(`JSON-parse-Error inverter names / device info: ${e.message}`);
                    throw e;
                }

                break;

            case '{"152"': //const startupData = ''{"152":null,"161":null,"162":null,"447":null,"610":null,"611":null,"617":null,"706":null,"739":null,"740":null,"744":null,"800":{"100":null,"160":null},"801":{"101":null,"102":null},"858":null,"895":{"100":null,"101":null,"102":null,"103":null,"104":null,"105":null}}';
                try { //"739":null,"744":null
                    deviceList = JSON.parse(resData)[739];
                    console.debug(`Devicelist: ${deviceList}`);
                    brandlist = JSON.parse(resData)[744];
                    console.debug(`Brandlist: ${JSON.stringify(brandlist)}`);
                } catch (e) {
                    console.warn(`read Solarlog Data - Error in get device list / brandlist: ${e}`);
                    throw e;
                }

                try { //"740":null
                    const dataJ = JSON.parse(resData)[740];
                    console.debug(`List of Inverters: ${JSON.stringify(dataJ)}`);
                    while (statusuz !== 'Err' && numinv < 100) {
                        statusuz = dataJ[numinv.toString()];
                        numinv++;
                    }
                    console.info('info.numinv' /*numinv*/ , numinv - 1, true);
                    console.debug(`Number of inverters/meters :${numinv - 1}`);


                    for (var i = 0; i < (numinv - 1); i++) {
                        var dataFront = '{"141":{';
                        var dataElements = '":{"119":null,"162":null}';
                        inverterDataArray.push(`"${i.toString()}${dataElements}`);
                    }

                    const inverterData = `${dataFront + inverterDataArray.toString()}}}`;

                    await logCheck(inverterData);
                } catch (e) {
                    console.warn(`read Solarlog Data - Error in get numinv: ${e}`);
                    throw e;
                }

                try { //"447":null
                    const sgdata = JSON.parse(resData)[447];
                    console.debug(`Switch group data: ${JSON.stringify(sgdata)}`);
                    for (let isg = 0; isg < 10; isg++) {
                        const sgname = JSON.parse(resData)[447][isg][100];
                        sgname && console.debug(`new switching group: ${sgname}`);
                        namessg[isg] = sgname.replace(/\s+/g, '');
                    }
                    console.debug(`Number of switching groups: ${namessg.filter(Boolean).length}`)
                    numsg = namessg.filter(Boolean).length;
                    console.debug(`namessg = ${namessg}`);
                    console.debug(`New switching groups: ${namessg}`);
                } catch (e) {
                    console.warn(`read Solarlog Data - Error  in get switchgrouplist: ${e}`);
                    throw e;
                }

                try { //"610":null,"611":null,"617":null,"706":null,"800":{"100":null,"160":null},"801":{"101":null,"102":null},"858":null,"895":{"100":null,"101":null,"102":null,"103":null,"104":null,"105":null}
                    console.info('info.RTOS', JSON.parse(resData)[610], true);
                    console.info('info.CLIB', JSON.parse(resData)[611], true);
                    console.info('info.MAC', JSON.parse(resData)[617], true);
                    console.info('info.SN', JSON.parse(resData)[706], true);
                    console.info('info.Model', (JSON.parse(resData)[800][100]).toString(), true);
                    console.info('info.InstDate', JSON.parse(resData)[800][160], true);
                    console.info('info.FW', JSON.parse(resData)[801][101], true);
                    console.info('info.FWrelD', JSON.parse(resData)[801][102], true);
                    const sdinfo = JSON.parse(resData)[895];
                    console.info('info.SD', `[${sdinfo[101]}|${sdinfo[103]}|${sdinfo[102]}|${sdinfo[100]}] - ${sdinfo[104]}/${sdinfo[105]}`, true);
                } catch (e) {
                    console.warn(`read Solarlog Data - Error in system information: ${e}`);
                    throw e;
                }

                try { //"152":null,"161":null,"162":null
                    const effizienz = JSON.parse(resData)[162];
                    const leistung = JSON.parse(resData)[161];
                    const setPointY = effizienz * (leistung / 1000);

                    console.info('forecast.setpointYear', setPointY, true);
                    console.info('forecast.setpointMonth.01', (JSON.parse(resData)[152][0] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.02', (JSON.parse(resData)[152][1] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.03', (JSON.parse(resData)[152][2] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.04', (JSON.parse(resData)[152][3] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.05', (JSON.parse(resData)[152][4] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.06', (JSON.parse(resData)[152][5] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.07', (JSON.parse(resData)[152][6] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.08', (JSON.parse(resData)[152][7] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.09', (JSON.parse(resData)[152][8] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.10', (JSON.parse(resData)[152][9] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.11', (JSON.parse(resData)[152][10] / 100) * setPointY, true);
                    console.info('forecast.setpointMonth.12', (JSON.parse(resData)[152][11] / 100) * setPointY, true);

                    const ds = new Date();
                    const m = ds.getMonth();
                    console.info('forecast.setpointCurrMonth', ((JSON.parse(resData)[152][m] / 100) * setPointY), true);
                    console.info('forecast.setpointToday', ((JSON.parse(resData)[152][m] / 100) * setPointY) / 30, true);
                } catch (e) {
                    console.warn(`read Solarlog Data - Error in setpoint: ${e}`);
                    throw e;
                }

                try { //"858":null
                    battdata = JSON.parse(resData)[858];
                    console.debug(`Battery data: ${battdata}`);
                    if (battdata.length > 0) {
                        battPresent = true;
                        console.debug('Battery present, create objects.');
                        console.debug(`Battery status: ${battPresent}`);

                    } else {
                        console.debug('No battery available.');
                        console.debug(`Battery status: ${battPresent}`);
                    }

                    console.debug('END');
                } catch (e) {
                    console.warn(`JSON-parse-error Battery Present: ${e.message}`);
                    throw e;
                }

                if (names.length > 0 && deviceclasses.length > 0) {
                    await setInvObjects();
                }
                break;

            case '{"447"': //pollingData = '{"447":null,"777":{"0":null},"778":{"0":null},"801":{"170":null}}';
                try { //"447":null
                    const dataSG = JSON.parse(resData)[447];
                    console.debug(`switching groups: ${namessg}`);
                    console.debug(`Number Elemente: ${numsg}`);
                    for (let sgj = 0; sgj < 10; sgj++) {
                        if (namessg[sgj]) {
                            console.debug(`SwichtGroup.${namessg[sgj]} Modus: ${dataSG[sgj][102]}`);
                            console.info(`SwitchGroup.${namessg[sgj]}.mode`, dataSG[sgj][102], true);
                            console.debug(`SwichtGroup.${namessg[sgj]} Verknüpfte Hardware: ${names[dataSG[sgj][101][0][100]]}`);
                            console.info(`SwitchGroup.${namessg[sgj]}.linkeddev`, names[dataSG[sgj][101][0][100]], true);
                            console.debug(`SwichtGroup.${namessg[sgj]} Verknüpfte Hardware Untereinheit: ${dataSG[sgj][101][0][101]}`);
                            console.info(`SwitchGroup.${namessg[sgj]}.linkeddevsub`, dataSG[sgj][101][0][101], true);
                        }
                    }
                } catch (e) {
                    console.warn(`read Solarlog Data - Error in swichtgroupmode: ${e}`);
                    throw e;
                }

                try { //"801":{"170":null}
                    json = JSON.parse(resData)[801][170];
                    console.debug(`Data801_170: ${JSON.stringify(json)}`);
                    console.info('info.lastSync', json[100].toString());
                    console.info('info.totalPower', parseInt(json[116]));
                    console.info('status.pac', parseInt(json[101]));
                    console.info('status.pdc', parseInt(json[102]));
                    console.info('status.uac', parseInt(json[103]));
                    console.info('status.udc', parseInt(json[104]));
                    console.info('status.conspac', parseInt(json[110]));
                    console.info('status.yieldday', parseInt(json[105]));
                    console.info('status.yieldyesterday', parseInt(json[106]));
                    console.info('status.yieldmonth', parseInt(json[107]));
                    console.info('status.yieldyear', parseInt(json[108]));
                    console.info('status.yieldtotal', parseInt(json[109]));
                    console.info('status.consyieldday', parseInt(json[111]));
                    console.info('status.consyieldyesterday', parseInt(json[112]));
                    console.info('status.consyieldmonth', parseInt(json[113]));
                    console.info('status.consyieldyear', parseInt(json[114]));
                    console.info('status.consyieldtotal', parseInt(json[115]));
                } catch (e) {
                    console.warn(`read Solarlog Data - Error in standard data request: ${e}`);
                    throw e;
                }

                try { //"777":{"0":null}
                    const dataSUZ = JSON.parse(resData)[777][0];
                    console.debug(`DataSUZ: ${dataSUZ}`);
                    console.debug(`Inv. to treat: ${names}`);
                    const namLeng = names.length;
                    console.debug(`Number of Element: ${namLeng}`);
                    const d = new Date();
                    const today = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear() - 2000}`;
                    console.debug(`Today: ${today}`);
                    for (let isuz = 0; isuz < 31; isuz++) {
                        if (dataSUZ[isuz].includes(today.toString())) {
                            var indexsuz = isuz;
                            console.debug(`Index Daily Values: ${indexsuz}`);
                            break;
                        }
                    }
                    const daysum = dataSUZ[indexsuz][1];
                    console.debug(`Daily Totals: ${daysum}`);
                    for (let suzi = 0; suzi < namLeng; suzi++) {
                        if (deviceclasses[suzi] !== 'Battery') {
                            console.debug(`INV.${names[suzi]}: ${daysum[suzi]}`);
                            console.info(`INV.${names[suzi]}.daysum`, daysum[suzi], true);
                        }
                    }
                } catch (e) {
                    console.warn(`read Solarlog Data - Error in sum data inverters: ${e}`);
                    throw e;
                }

                try { ////"778":{"0":null}
                    const dataselfcons = JSON.parse(resData)[778][0];
                    console.debug(`DataSelfCons: ${dataselfcons}`);
                    const d = new Date();
                    const today = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear() - 2000}`;
                    console.debug(`Today: ${today}`);
                    const monattoday = d.getMonth() + 1;
                    console.debug(`Month today: ${monattoday}`);
                    for (let isuz = 0; isuz < 31; isuz++) {
                        if (dataselfcons[isuz].includes(today.toString())) {
                            let indexsuz = isuz;
                            console.debug(`Index Daily Values: ${indexsuz}`);
                            break;
                        }
                    }
                    const dataselfconstoday = dataselfcons[indexsuz];
                    console.debug(`Daily Values SelfCons: ${dataselfconstoday}`);
                    const daysum = dataselfcons[indexsuz][1];
                    console.debug(`Daily Totals Own Consumption: ${daysum}`);
                    const dayratio = Math.round((daysum / json[105]) * 1000) / 10;

                    console.info('SelfCons.selfconstoday', daysum, true);
                    console.info('SelfCons.selfconsratiotoday', dayratio, true);

                    d.setDate(d.getDate() - 1);
                    const yesterday = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear() - 2000}`;
                    console.debug(`Yesterday: ${yesterday}`);
                    const monatGestern = d.getMonth() + 1;
                    console.debug(`Monat yesterday: ${monatGestern}`);
                    if (monatGestern === monattoday) {
                        for (let iscy = 0; iscy < 31; iscy++) {
                            if (dataselfcons[iscy].includes(yesterday.toString())) {
                                var indexscy = iscy;
                                console.debug(`Index Daily Values yesterday: ${indexscy}`);
                                break;
                            }
                        }
                        const dataselfconsyesterday = dataselfcons[indexscy];
                        console.debug(`Yesterday Values SelfCons: ${dataselfconsyesterday}`);
                        const daysumy = dataselfcons[indexscy][1];
                        console.debug(`Yeesterday sum own soncumption: ${daysumy}`);
                        const dayratioy = Math.round((daysumy / json[106]) * 1000) / 10;

                        console.info('SelfCons.selfconsyesterday', daysumy, true);
                        console.info('SelfCons.selfconsratioyesterday', dayratioy, true);
                        lastdaysumy = daysum;
                        lastdayratioy = dayratio;
                    } else {
                        console.info('SelfCons.selfconsyesterday', lastdaysumy, true);
                        console.info('SelfCons.selfconsratioyesterday', lastdayratioy, true);
                    }

                    if (battDevicePresent && battPresent) {
                        console.info(`INV.${names[battindex[0]]}.BattSelfCons`, dataselfconstoday[2], true);
                        console.info(`INV.${names[battindex[0]]}.BattChargeDaysum`, dataselfconstoday[3], true);
                        console.info(`INV.${names[battindex[0]]}.BattDischargeDaysum`, dataselfconstoday[4], true);
                    } else if (!battDevicePresent && battPresent) {
                        console.info('INV.Battery.BattSelfCons', dataselfconstoday[2], true);
                        console.info('INV.Battery.BattChargeDaysum', dataselfconstoday[3], true);
                        console.info('INV.Battery.BattDischargeDaysum', dataselfconstoday[4], true);
                    } else if (!battDevicePresent && !battPresent) {
                        console.debug('Keine Battery vorhanden');
                    } else {
                        console.debug('Strange: Batterydaten vorhanden aber Battery - Vorhanden Indikatoren falsch');
                    }
                } catch (e) {
                    console.warn(`read Solarlog Data - Error in self consumtion: ${e}`);
                    throw e;
                }

                break;

            case '{"608"': //fastpollData = '{"608":null,"780":null,"781":null,"782":null,"801":{"175":null},"858":null}';
                try { //"608":null
                    const datafast = JSON.parse(resData);

                    if (datafast[608][0].includes("DENIED") == true) {
                        console.warn('SolarLog access violation - restart Adapter');
                        restartAdapter();

                    } else {
                        console.debug(`Inv. to treat: ${names}`);
                        const namLeng = names.length;
                        console.debug(`Number of Element: ${namLeng}`);
                        for (let uzj = 0; uzj < namLeng; uzj++) {
                            if (deviceclasses[uzj] !== 'Battery') {
                                console.debug(`INV.${names[uzj]} Status: ${datafast[608][uzj]}`);
                                console.info(`INV.${names[uzj]}.status`, datafast[608][uzj], true);
                                console.debug(`INV.${names[uzj]} PAC: ${datafast[782][uzj]}`);
                                console.info(`INV.${names[uzj]}.PAC`, parseInt(datafast[782][uzj]), true);
                            }
                        }

                        console.debug(`Switching groups: ${namessg}`);

                        console.debug(`Number of switching groups: ${numsg}`);
                        for (let sgsj = 0; sgsj < 10; sgsj++) {
                            if (namessg[sgsj]) {
                                console.debug(`SwichtGroup.${namessg[sgsj]} Status: ${datafast[801][175][sgsj][101]}`);
                                console.info(`SwitchGroup.${namessg[sgsj]}.state`, datafast[801][175][sgsj][101], true);
                            }
                        }

                        battdata = datafast[858];
                        console.debug(`Battery Data: ${battdata}`);
                        console.debug(`Batter Data - Long: ${battdata.length}`)
                        if (!battdata.length) {
                            battdata[2] = 0;
                            battdata[3] = 0;
                        }
                        console.debug(`Generation: ${+datafast[780] - +battdata[3]}`);
                        console.info('status.pac', parseInt(+datafast[780] - +battdata[3]), true);
                        console.debug(`Consumption: ${+datafast[781] - +battdata[2]}`);
                        console.info('status.conspac', parseInt(+datafast[781] - +battdata[2]), true);

                        if (battDevicePresent && battPresent) {
                            console.info(`INV.${names[battindex[0]]}.BattLevel`, battdata[1], true);
                            console.info(`INV.${names[battindex[0]]}.ChargePower`, battdata[2], true);
                            console.info(`INV.${names[battindex[0]]}.DischargePower`, battdata[3], true);
                            feed = +datafast[780] - +datafast[781];
                            console.debug(`Erzeugung(+)/Consumption(-): ${feed}`);
                            console.info('status.feed', feed, true);
                            if (Math.sign(feed) === 1) {
                                console.info('status.feedin', feed, true);
                                console.info('status.feedinactive', true, true);
                                console.info('status.feedout', 0, true);
                            } else {
                                console.info('status.feedin', 0, true);
                                console.info('status.feedinactive', false, true);
                                console.info('status.feedout', Math.abs(feed), true);
                            }
                        } else if (!battDevicePresent && battPresent) {
                            console.info('INV.Battery.BattLevel', battdata[1], true);
                            console.info('INV.Battery.ChargePower', battdata[2], true);
                            console.info('INV.Battery.DischargePower', battdata[3], true);
                            feed = +datafast[780] - +datafast[781];
                            console.debug(`Erzeugung(+)/Consumption(-): ${feed}`);
                            console.info('status.feed', feed, true);
                            if (Math.sign(feed) === 1) {
                                console.info('status.feedin', feed, true);
                                console.info('status.feedinactive', true, true);
                                console.info('status.feedout', 0, true);
                            } else {
                                console.info('status.feedin', 0, true);
                                console.info('status.feedinactive', false, true);
                                console.info('status.feedout', Math.abs(feed), true);
                            }
                        } else if (!battDevicePresent && !battPresent) {
                            console.debug('Keine Battery vorhanden');
                            feed = +datafast[780] - +datafast[781];
                            console.debug(`Erzeugung(+)/Consumption(-): ${feed}`);
                            console.info('status.feed', feed, true);
                            if (Math.sign(feed) === 1) {
                                console.info('status.feedin', feed, true);
                                console.info('status.feedinactive', true, true);
                                console.info('status.feedout', 0, true);
                            } else {
                                console.info('status.feedin', 0, true);
                                console.info('status.feedinactive', false, true);
                                console.info('status.feedout', Math.abs(feed), true);
                            }
                        } else {
                            console.debug('Strange: Batterydaten vorhanden aber Battery - Vorhanden Indikatoren falsch');
                        }

                        setDisplayData(datafast[794][0]);

                    }

                } catch (e) {
                    console.warn(`read Solarlog Data - Error in datafast: ${e}`);
                    throw e;
                }
                break;

            case `{"854"`: //const historicData = '{"854":null,"877":null,"878":null}';
                try { //"854":null
                    const dataYear = JSON.parse(resData)[854];
                    console.debug(`DataYear: ${dataYear}`);
                    console.debug(`Inv. to treat: ${names}`);
                    const namLeng = names.length;

                    console.debug(`Number of Elemente: ${namLeng}`);
                    for (let iy = 0; iy < dataYear.length; iy++) {
                        const year = dataYear[iy][0].slice(-2);
                        for (let inu = 0; inu < names.length; inu++) {
                            if (dataYear[iy][1][inu]) {
                                data.push(`Historic.20${year}.yieldyearINV.${names[inu]}`, {
                                    type: 'state',
                                    common: {
                                        name: 'yieldyear',
                                        desc: 'Year sum Wh',
                                        type: 'number',
                                        role: 'value.yearsum',
                                        read: true,
                                        write: false,
                                        unit: 'Wh'
                                    },
                                    native: {}
                                });
                            }
                        }
                    }

                    for (let iy = 0; iy < dataYear.length; iy++) {
                        const year = dataYear[iy][0].slice(-2);
                        for (let inu = 0; inu < names.length; inu++) {
                            if (dataYear[iy][1][inu]) {
                                console.info(`Historic.20${year}.yieldyearINV.${names[inu]}`, dataYear[iy][1][inu], true);
                            }
                        }
                    }
                } catch (e) {
                    console.warn(`read Solarlog Data - Error in status data inverters: ${e}`);
                    throw e;
                }

                if (reqData.includes('"877"')) {
                    try { //"877":null
                        const dataMonthtot = JSON.parse(resData)[877];
                        console.debug(`DataMonth: ${dataMonthtot}`);

                        for (let iy = 0; iy < dataMonthtot.length; iy++) {
                            const year = dataMonthtot[iy][0].slice(-2);
                            const month = dataMonthtot[iy][0].slice(3, 5);

                            data.push(`Historic.20${year}.monthly.${month}.yieldmonth`, {
                                type: 'state',
                                common: {
                                    name: 'yieldmonth',
                                    desc: 'Month sum producion Wh',
                                    type: 'number',
                                    role: 'value.monthsum',
                                    read: true,
                                    write: false,
                                    unit: 'Wh'
                                },
                                native: {}
                            });

                            data.push(`Historic.20${year}.monthly.${month}.consmonth`, {
                                type: 'state',
                                common: {
                                    name: 'consmonth',
                                    desc: 'Month sum consumption Wh',
                                    type: 'number',
                                    role: 'value.monthsum',
                                    read: true,
                                    write: false,
                                    unit: 'Wh'
                                },
                                native: {}
                            });

                            data.push(`Historic.20${year}.monthly.${month}.selfconsmonth`, {
                                type: 'state',
                                common: {
                                    name: 'selfconsmonth',
                                    desc: 'Month sum  self consumption Wh',
                                    type: 'number',
                                    role: 'value.monthsum',
                                    read: true,
                                    write: false,
                                    unit: 'kWh'
                                },
                                native: {}
                            });
                        }

                        for (let iy = 0; iy < dataMonthtot.length; iy++) {
                            const year = dataMonthtot[iy][0].slice(-2);
                            const month = dataMonthtot[iy][0].slice(3, 5);

                            if (dataMonthtot[iy][1]) {
                                console.info(`Historic.20${year}.monthly.${month}.yieldmonth`, dataMonthtot[iy][1], true);
                                console.info(`Historic.20${year}.monthly.${month}.consmonth`, dataMonthtot[iy][2], true);
                                console.info(`Historic.20${year}.monthly.${month}.selfconsmonth`, dataMonthtot[iy][3], true);
                            }
                        }

                        console.info('SelfCons.selfconsmonth', dataMonthtot[dataMonthtot.length - 1][3], true);
                        console.info('SelfCons.selfconslastmonth', dataMonthtot[dataMonthtot.length - 2][3], true);

                        console.info('SelfCons.selfconsratiomonth', Math.round((dataMonthtot[dataMonthtot.length - 1][3] * 1000) / (dataMonthtot[dataMonthtot.length - 1][2]) * 1000) / 10, true);
                        console.info('SelfCons.selfconsratiolastmonth', Math.round((dataMonthtot[dataMonthtot.length - 2][3] * 1000) / (dataMonthtot[dataMonthtot.length - 2][2]) * 1000) / 10, true);
                    } catch (e) {
                        console.warn(`read Solarlog Data - Error in historic monthly: ${e}`);
                        throw e;
                    }

                    try { //878":null}
                        const dataYeartot = JSON.parse(resData)[878];
                        console.debug(`DataYear: ${dataYeartot}`);

                        for (let iy = 0; iy < dataYeartot.length; iy++) {
                            const year = dataYeartot[iy][0].slice(-2);

                            data.push(`Historic.20${year}.yieldyear`, {
                                type: 'state',
                                common: {
                                    name: 'yieldyear',
                                    desc: 'Year sum producion Wh',
                                    type: 'number',
                                    role: 'value.yearsum',
                                    read: true,
                                    write: false,
                                    unit: 'Wh'
                                },
                                native: {}
                            });

                            data.push(`Historic.20${year}.consyear`, {
                                type: 'state',
                                common: {
                                    name: 'consyear',
                                    desc: 'Year sum consumption Wh',
                                    type: 'number',
                                    role: 'value.yearsum',
                                    read: true,
                                    write: false,
                                    unit: 'Wh'
                                },
                                native: {}
                            });

                            data.push(`Historic.20${year}.selfconsyear`, {
                                type: 'state',
                                common: {
                                    name: 'selfconsyear',
                                    desc: 'Year sum  self consumption Wh',
                                    type: 'number',
                                    role: 'value.yearsum',
                                    read: true,
                                    write: false,
                                    unit: 'kWh'
                                },
                                native: {}
                            });
                        }

                        for (let iy = 0; iy < dataYeartot.length; iy++) {
                            const year = dataYeartot[iy][0].slice(-2);
                            if (dataYeartot[iy][1]) {
                                console.info(`Historic.20${year}.yieldyear`, dataYeartot[iy][1], true);
                                console.info(`Historic.20${year}.consyear`, dataYeartot[iy][2], true);
                                console.info(`Historic.20${year}.selfconsyear`, dataYeartot[iy][3], true);
                            }
                        }

                        console.info('SelfCons.selfconsyear', dataYeartot[dataYeartot.length - 1][3], true);
                        console.info('SelfCons.selfconslastyear', dataYeartot[dataYeartot.length - 2][3], true);

                        console.info('SelfCons.selfconsratioyear', Math.round((dataYeartot[dataYeartot.length - 1][3] * 1000) / (dataYeartot[dataYeartot.length - 1][2]) * 1000) / 10, true);
                        console.info('SelfCons.selfconsratiolastyear', Math.round((dataYeartot[dataYeartot.length - 2][3] * 1000) / (dataYeartot[dataYeartot.length - 2][2]) * 1000) / 10, true);
                    } catch (e) {
                        console.warn(`read Solarlog Data - Error in status historic sum data: ${e}`);
                        throw e;
                    }
                }
                break;

            case '{"801"': //nur Daten über offene JSON-Schnittstelle'
                try {
                    json = JSON.parse(resData)[801][170];
                    console.log('Data open JSON: ' + JSON.stringify(json));
                    console.info('info.lastSync', json[100], true);
                    console.info('info.totalPower', parseInt(json[116]), true);
                    console.info('status.pac', parseInt(json[101]), true);
                    console.info('status.pdc', parseInt(json[102]), true);
                    console.info('status.uac', parseInt(json[103]), true);
                    console.info('status.udc', parseInt(json[104]), true);
                    console.info('status.conspac', parseInt(json[110]), true);
                    console.info('status.yieldday', parseInt(json[105]), true);
                    console.info('status.yieldyesterday', parseInt(json[106]), true);
                    console.info('status.yieldmonth', parseInt(json[107]), true);
                    console.info('status.yieldyear', parseInt(json[108]), true);
                    console.info('status.yieldtotal', parseInt(json[109]), true);
                    console.info('status.consyieldday', parseInt(json[111]), true);
                    console.info('status.consyieldyesterday', parseInt(json[112]), true);
                    console.info('status.consyieldmonth', parseInt(json[113]), true);
                    console.info('status.consyieldyear', parseInt(json[114]), true);
                    console.info('status.consyieldtotal', parseInt(json[115]), true);
                } catch (e) {
                    console.warn(`read Solarlog Data - Error in standard data request: ${e}`);
                    throw e;
                }
                break;

            default:
                console.warn('Error: Problem with the Solarlog data evaluation, no data record recognized');
        }
        console.log('DATA --> ' + JSON.stringify(data));

    } catch (e) {
        console.warn(`read Solarlog Data - Error : ${e}`);
    }
} //end read Solarlog Data


function pull_data(dataRequestParams){
    if (localStorage.getItem('tokenData') !== null) {
        if(localStorage.getItem('tokenData') !== ''){
            logCheck(dataRequestParams);
        }
        else{
            login()
                .then( () =>{
                    logCheck(dataRequestParams).then(()=>{});
                });

            console.info('inner else and ran login and logcheck')
        }
    } else {
        login()
            .then( () =>{
                logCheck(dataRequestParams).then(()=>{});
            });
    }
}
// PULL DATA STARTING HERE
pull_data(pollingData);

var hourlyProductionChart = echarts.init(document.getElementById('hourly-production'));

var hourlyProductionChartData =  [
    ['2018-04-10T11:40:33Z', 11, 8],
    ['2018-04-10T12:40:33Z', 14, 8],
    ['2018-04-10T13:40:33Z', 10, 7],
    ['2018-04-10T14:40:33Z', 9, 6],
    ['2018-04-10T15:40:33Z', 8, 3],
    ['2018-04-10T16:40:33Z', 7, 4],
    ['2018-04-10T17:40:53Z', 5, 3],
    ['2018-04-10T18:41:03Z', 4, 2],
    ['2018-04-10T19:44:03Z', 5, 1],
    ['2018-04-10T20:45:03Z', 6, 0]
];

var hourlyProductionChartOption = {
    legend: {},
    tooltip: {
        trigger: 'axis',
    },
    dataset: {
        source:hourlyProductionChartData,
        dimensions: ['timestamp', 'sensor1', 'sensor2'],
    },
    xAxis: { type: 'time' },
    yAxis: { },
    series: [
        {
            name: 'sensor1',
            type: 'line',
            encode: {
                x: 'timestamp',
                y: 'sensor1' // refer sensor 1 value
            }
        },{
            name: 'sensor2',
            type: 'line',
            encode: {
                x: 'timestamp',
                y: 'sensor2'
            }
        }]
};
hourlyProductionChart.setOption(hourlyProductionChartOption);
