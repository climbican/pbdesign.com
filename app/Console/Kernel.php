<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Http\Controllers\SolarLogStatsController;

class Kernel extends ConsoleKernel
{

    protected $commands = [Commands\RunStatsCommand::class]; //layered method
    /**
     * Define the application's command schedule.
     *
     * '/opt/homebrew/Cellar/php@8.1/8.1.24/bin/php' 'artisan' app:run-stats-command > '/dev/null' 2>&1
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('app:run-stats-command')->everyTenMinutes(); //OOP method
        $schedule->command('logcleaner:run', ['--keeplines' => 5000, '--keepfiles' => 14])->daily()->at('01:00');  // direct method
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
