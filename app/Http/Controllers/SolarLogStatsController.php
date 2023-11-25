<?php
/*
 *
 * setcookie("TestCookie", $value, time()+3600);
 *
 * $_COOKIE['TestCookie'];
 */
namespace App\Http\Controllers;

use DateTime;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;
use Exception;
use GuzzleHttp\Client;
//use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SolarLogStatsController extends Controller
{
    var string $deviceIpAddress = 'http://157.231.187.42:5179'; //'remote.pbdesign.co.uk:5179';
    var string $cmd = '/getjp';
    var string $loginData = 'u=installer&p=Wi11iam9869';
    var string $userPass = 'Wi11iam9869';
    var array $data = [];
    var array $deviceInfo = [];

    var $token = '';
    var $token_expires = 0;
    var $commandSet = '{"854":null,"877":null,"878":null}';
    var $requestCounter = 0;

    // DIFFERENT SETS OF STATS
    const month_year = '{"801":{"170":null}}';
    const startupData = '{"152":null,"161":null,"162":null,"447":null,"610":null,"611":null,"617":null,"706":null,"739":null,"740":null,"744":null,"800":{"100":null,"160":null},"801":{"101":null,"102":null},"858":null,"895":{"100":null,"101":null,"102":null,"103":null,"104":null,"105":null}}';
    const inverterDataArray = [];
    const pollingData = '{"447":null,"777":{"0":null},"778":{"0":null},"801":{"170":null}}';
    const historicData = '{"854":null,"877":null,"878":null}';
    const fastpollData = '{"608":null,"780":null,"781":null,"782":null,"794":{"0":null},"801":{"175":null},"858":null}';
    const historicDataJSONmonths = '/months.json?_=';
    const historicDataJSONyears = '/years.json?_=';

    var $deviceList = [];
    var $brandlist = [];
        const deviceClassList = ['Inverter', 'Sensor', 'counter', 'Hybrid-System', 'Battery', 'An intelligent consumer', 'Switch', 'Heat pump', 'Heating Rod', 'Chargin'];
    var $numinv = 0;
        const names = [];
    var $numsg = 0;

    const deviceinfos = [];
    const devicetypes = [];
    const devicebrands = [];
    const deviceclasses = [];

    var $uzimp;
    var $battDevicePresent = false;
    var $battPresent = false;
        const battindex = [];
    var $battarrind = 0;
    var $battdata = [];

    var int $feed = 0;

    var bool|array $historic = false;
    var $histCRON = '0 0 * * *';
    var array $raw_data = [];
    var array $referencial_data_out = [];
    var $forecast = false;
        const urlForecast = 'https://api.forecast.solar/';
    var $cmdForecast;
    var $lat;
    var $lon;
    var $dec;
    var $az;
    var $kwp;
    public function __construct(){}
    public function fetch_weather_report(){}

    /**
     * @return void
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * THIS ONE WORKS
     */
    public function login($debug=false): bool{
        try{
            $headers = [
                'Accept'=> '*/*',
                'Accept-Encoding'   => 'gzip, deflate',
                'Connection'        => 'keep-alive',
                'Content-Type'      => 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer'           => $this->deviceIpAddress.'/',
                'Accept-Origin'     => $this->deviceIpAddress.'/',
                'User-Agent'        => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                'X-Requested-With'  => 'XMLHttpRequest',
                'Cookie'=> 'banner_hidden=false'
            ];

            $client = new Client(['base_uri' => $this->deviceIpAddress]);
            $response = $client->post('login', ['headers'=> $headers, 'form_params'=>['u'=>'installer', 'p'=>'Wi11iam9869'], 'debug'=>$debug]);

            $h = $response->getHeaders();
            $this->token = substr($h['Set-Cookie'][0], 9);
            $this->token_expires = time()+60*60; // not sure that this is necessary
            //setcookie('solarLogToken', $this->token, time()+60*60);

            return true;

            /**
             * @var  $name
             * @var  $values
             * test params
             *  $body = $response->getBody()->getContents(); // with getContents shows no change
             *  show response message // print_r( 'body of request response: '.$body);
             foreach ($response->getHeaders() as $name => $values) {
                echo $name . ': ' . implode(', ', $values) . "\r\n";
            }**/
        }
        catch(\Exception $e){
            //print_r('There was an issue');
            return false;
        }
    }

    private function fetch_logs(string $command_set='', string $token='oCkwrj2aqHt9JaWchVCN5ZlQeoQHcbQwLG0GsFjiyPg%3D', bool $debug=false){
        try {
            $headers = [
                'Accept' => '*/*',
                'Accept-Encoding' => 'gzip, deflate',
                'Connection' => 'keep-alive',
                'Content-Type' => 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer' => $this->deviceIpAddress . '/',
                'Accept-Origin' => $this->deviceIpAddress . '/',
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                'X-Requested-With' => 'XMLHttpRequest',
                'Cookie' => 'banner_hidden=false;  SolarLog='.$this->token
            ];

            $client = new Client(['base_uri' => $this->deviceIpAddress]);
            $body_data = 'token='.$this->token.';preval=none;'.self::pollingData;
            $response = $client->post($this->cmd, ['headers'=>$headers, 'body' =>$body_data, 'debug' => $debug]);
            $body = $response->getBody()->getContents();
            $data = explode(';', $body);

            /**
             * TEST DATA OUT
             * echo '<p>';print_r($headers); echo '</p>';
            echo '<p>Body Data: '.$body_data."\n"."</p>";
            echo 'response header: '; print_r($response->getHeaders());
            echo "\n<br>";
            echo 'exploded data'. "\n";
            echo $data[0];
            print_r($this->raw_data);**/
            //$this->raw_data = json_decode($data[0], true);

            $data = json_decode($data[0], true);

            $this->add_hourly_stats_data($data['801']['170']['105']);

            $r = $this->read();
            $data[999] = $r['data'];
            unset($data[447]);

            return json_encode($data);
        }
        catch(Exception $e){
            return json_encode(['message'=>'there was an issue']);
        }

    }

    public function run_logcheck(): string{
        try{
            if($this->login()){
                return $this->fetch_logs();
            }
        }
        catch (GuzzleException $e) {
            return '';
        }
        return '';
    }

    public function filter_solar_log_data(string $requested_data, array $response){
        /**switch (substr($requested_data. 0, 6)) {
            case '{"447"':
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
                break;
            default:
                // probably the same as the 447 data
                break;
        }**/
    }


    private function add_hourly_stats_data(string $value_to_add){
        $data = $this->read();
        // this is where the hour and midnight logic goes

        $s = substr($data['lastTimeRetrieved'], 11,2);

        if($s === "00"){
            $data['data'] = [];
        }

        if(substr($data['lastTimeRetrieved'], 11,2) !== substr($this->createISOTimestamp(), 11,2)){
            $data['data'][] = [$this->createISOTimestamp(), (int)$value_to_add];
        }

        $this->write($data['data']);
    }


    // put write login in here.
    private function write(array $data=[]): void{
        // here is the issue
        $h = Storage::disk('public')->get('full_stats.json');
        $ar = json_decode($h, true);
        $ar['lastTimeRetrieved'] = $this->createISOTimestamp();
        $ar['data'] = $data;
        Storage::disk('public')->put('full_stats.json', json_encode($ar));
    }

    private function read(): array{
        $h = Storage::disk('public')->get('full_stats.json');
        return json_decode($h, true);
    }

    private function createISOTimestamp(): string{
        return date_format(date_timestamp_set(new DateTime(), time()), 'c');
    }
}
