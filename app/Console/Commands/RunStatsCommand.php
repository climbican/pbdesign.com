<?php

namespace App\Console\Commands;

use App\Http\Controllers\SolarLogStatsController;
use Illuminate\Console\Command;

class RunStatsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-stats-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This is to generate the stats for the hourly production.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $s = new SolarLogStatsController();
        $s->run_logcheck();
    }
}
