<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\Factory;
use Illuminate\View\View;

class AppController extends Controller
{
    /**
     * Application UI entry point
     *
     * @return Factory|View
     */
    public function index()
    {
        return $this->render();
    }
    
    /**
     * @param $owner
     * @param $route
     *
     * @return Factory|View
     */
    public function repo($owner, $route)
    {
        return $this->render([
            'title' => 'Release notes for ' . $owner . '/' . $route
        ]);
    }
    
    /**
     * @param array $options
     *
     * @return Factory|View
     */
    private function render($options = [])
    {
        return view('app.index')->with(array_merge([
            'js' => $this->js(),
            'isDev' => env('APP_ENV') === 'local',
        ], $options));
    }
    
    /**
     * @return array
     */
    private function js(): array
    {
        return [
            'version' => config('app.version'),
            'version_date' => config('app.version_date'),
            'env' => env('APP_ENV'),
            
            'api_endpoint' => '/api/v1/',
            'api_token' => '',
        ];
    }
}
