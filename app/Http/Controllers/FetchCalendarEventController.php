<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FetchCalendarEventController extends Controller
{
    public function get_auth_code(){
        if(!$_REQUEST['app_id'] === 'b3eca716-1757-4bdf-8169-c34900322fe893') exit();

        $_APPLICATION_ID = 'b3eca716-1757-4bdf-8169-c3490f04e893';
        $_CERTIFICATE_VALUE = 'NB88Q~EcgDWdZu3NeIuzzhlnyT_E91TCkLn0Gc-3';
        $_TENANT_ID = 'af2ad4a6-0eff-4044-9f9c-bb0af98437ce';
        $fields_string = '';

        $vars = ['client_id' => urlencode($_APPLICATION_ID), 'scope'=>urlencode('https://graph.microsoft.com/.default'),
            'client_secret'=> urlencode($_CERTIFICATE_VALUE), 'grant_type' => urlencode('client_credentials')];

        foreach($vars as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }

        $fields_string = rtrim($fields_string, '&');

        $headers = [ 'Content-Type: application/x-www-form-urlencoded' ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,'https://login.microsoftonline.com/' . $_TENANT_ID . '/oauth2/v2.0/token');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);  //Post Fields
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $streamVerboseHandle = fopen('php://temp', 'w+');
        curl_setopt($ch, CURLOPT_STDERR, $streamVerboseHandle);

        $server_output = curl_exec ($ch);

        curl_close ($ch);

        if ($server_output === FALSE) {
            $out = printf("cUrl error (#%d): %s<br>\n",
                curl_errno($ch),
                htmlspecialchars(curl_error($ch)), true);
        }

        rewind($streamVerboseHandle);
        $verboseLog = stream_get_contents($streamVerboseHandle);

        $out = "cUrl verbose information:\n". "<pre>" . htmlspecialchars($verboseLog). "</pre>\n";


        return $server_output;
    }
}
