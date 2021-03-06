<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * @TODO REFACTOR!!!!!
 *
 *
 * Class RepoController
 * @package App\Http\Controllers
 */
class RepoController extends Controller
{
    /**
     * @return array
     */
    public function repo(Request $request)
    {
        $data = $request->get('data');
        
        $repo = $data['repo'] ?? null;
        $owner = $data['owner'] ?? null;
        $url = $data['url'] ?? null;
        $type = $data['type'] ?? 'github';
        
        abort_unless(($owner && $repo) || ($type === 'markdown' && $url), 400);
        
        $key = $repo . '.' . $owner . '.' . $type . '.' . $url;
        
        // $cached = Cache::get($key);
        $cached = null;
        if (!$cached) {
            if ($type === 'github') {
                $data = $this->githubRepo($owner, $repo);
                if( is_string($data) ) {
                    $cached = $this->mockGithubReleases($data, $owner.'/'.$repo);
                } else {
                    $cached = $data;
                }
            } else if ($type === 'markdown') {
                $data = $this->fetch($url);
                $cached = $this->github($data);
            } else {
                abort(400);
            }
            
            Cache::put($key, $cached, 300);
        }
        
        
        //die(var_dump($data));
        
        
        //$output = $this->mockChangeLogJs();
        //$output = $this->mockLaravelChangeLog();
        
        
        return [
            'data' => $cached
        ];
    }
    
    private function githubRepo($owner, $repo)
    {
        $client = new Client();
        $res = null;
        
        try {
            $res = $client->get( 'https://api.github.com/repos/' . $owner . '/' . $repo . '/releases', [
                'headers' => [
                    'Authorization' => 'token ' . config('services.github.token'),
                ]
            ]);
        } catch (\Exception $exception) {
            return ['error' => $exception->getMessage()];
        }
        
        if (!$res) {
            return null;
        }
        
        if ($res->getStatusCode() !== 200) {
            return ['error' => 'Repo not found!'];
        }
        
        return $res->getBody()->getContents();
    }
    
    private function fetch($url)
    {
        $client = new Client();
        $res = null;
        
        try {
            $res = $client->get( $url);
        } catch (\Exception $exception) {
            return ['error' => $exception->getMessage()];
        }
        
        if (!$res) {
            return null;
        }
        
        if ($res->getStatusCode() !== 200) {
            return ['error' => 'Repo not found!'];
        }
        
        return $res->getBody()->getContents();
    }
    
    /**
     * @return array
     */
    private function mockLaravelChangeLog()
    {
        $data = file_get_contents(
            base_path('tests/mocks/changelog-laravel.md')
        );
    
        return $this->github($data);
    }
    
    /**
     * @param Request $request
     *
     * @return array
     */
    public function repoValidate(Request $request)
    {
        $data = $request->input('data');
        
        preg_match('/https:\/\/github.com\/([^\/\n]*)\/([^\/\n]*)?/', $data['repo'], $matches);
        
        $valid = false;
        $repo = null;
        
        if (count($matches) > 2) {
            $owner = $matches[1];
            $repo = $matches[2];
            
            $valid = true;
            $repo = '/' . $owner . '/' . $repo;
        }
        
        if (!$valid && filter_var($data['repo'], FILTER_VALIDATE_URL)) {
            $valid = true;
            $repo = 'markdown?url=https://raw.githubusercontent.com/rstacruz/nprogress/master/History.md';
        }
        
        return [
            'success' => true,
            'data' => [
                'valid' => $valid,
                'path' => $repo
            ]
        ];
    }
    
    /**
     * @return array
     */
    private function mockChangeLogJs($data = null)
    {
        $data = $data ?: file_get_contents(
            base_path('tests/mocks/changelog.json')
        );
    
        $data = (json_decode($data, false))->releases;
    
        $output = [];
        foreach ($data as $version => $datum) {
            $changes = [];
        
            foreach ($datum as $change) {
                preg_match('/\[(\w+)\]/', $change, $matches);
                $message = $change;
                $tag = null;
            
                if(count($matches) > 1) {
                    $tag = $matches[1];
                    $message = trim(str_replace($matches[0], '', $message));
                }
            
                $changes[] = [
                    'tag' => $tag,
                    'type' => $this->getType($tag),
                    'message' => $message
                ];
            }
        
            $output[] = [
                'title' => '',
                'version' => $version,
                'changes' => $changes
            ];
        }
        
        return $output;
    }
    
    private function getType($type)
    {
        $types = [
            'added' => 'green',
            'add' => 'green',
            'new' => 'green',
            'improvement' => 'green',
            'feature' => 'green',
            'fix' => 'red',
            'important' => 'red',
            'change' => 'lblue',
            'update' => 'blue',
            'contributor' => 'blue',
            'improved' => 'blue',
            'remove' => 'gray',
            'revert' => 'gray',
            'break' => 'red',
        ];
    
        $found = null;
        $type = strtolower($type);
        
        foreach ($types as $needle => $value) {
            if ($needle !== '' && mb_strpos($type, $needle) !== false) {
                $found = $value;
                break;
            }
        }
        
        return $found;
    }
    
    private function mockGithubReleases($data = null, $repo = null)
    {
        // $file = 'github-releases-endpoint.json';
    
        // $data = $data ?: file_get_contents(
        //     base_path('tests/mocks/' . $file)
        // );
        
        $data = json_decode($data, false);
        $changes = [];
        
        foreach ($data as $datum) {
            $time = strtotime($datum->created_at);
            $date = date('F jS Y', $time);
            $changes[$time] = [
                'version' => $datum->tag_name,
                'title' => $date,
                'changes' => $this->mapChanges(explode("\r\n", $datum->body), -1, null, $repo)
            ];
        }

        krsort($changes);
        
        return array_values($changes);
        
    }
    
    /**
     * @param string $raw
     *
     * @return array
     */
    private function github(string $raw): array
    {
        $output = [];
        
        $data = explode("\n", $raw);
        $linesMax = count($data);
    
        $md = new \Parsedown();
        $md->setSafeMode(true);

        foreach ($data as $i => $item) {
            
            if( !Str::startsWith($item, '## ') ) {
                continue;
            }
    
            $changes = $this->mapChanges($data, $i, $linesMax);
            
            $output[] = [
                'version' => $md->line(str_replace('## ', '', $item)),
                'changes' => $changes
            ];
        }
        
        return $output;
    }
    
    /**
     * @param string $data
     * @param $i
     * @param int $linesMax
     *
     * @return array
     */
    private function mapChanges(array $data, $i = 0, $linesMax = null, $repo = null): array
    {
        $valid = true;
        $max = 1000;
        $j = 0;
        
        if (!$linesMax) {
            $linesMax = count($data);
        }
    
        $md = new \Parsedown();
        $md->setSafeMode(true);
        
        $changes = [];
        $tag = '';
        while ($valid && $j < $max && ($i + $j) < $linesMax) {
            $j++;
            //$counter++;
            $line = $data[ $i + $j ] ?? null;

            if( $line === null ) {
                break;
            }
            
            if( ($j > 1) && (Str::startsWith($line, '## ')) ) {
                break;
            }
            
            if( $line === '' ) {
                continue;
            }
            
            if( Str::startsWith($line, '### ') ) {
                $tag = str_replace('### ', '', $line);
                continue;
            }
            
            $pos = strpos($line, '- ');
            if( $pos !== false ) {
                $line = substr_replace($line, '', 0, 2);
            }
    
            if( strpos($line, '* ') !== false ) {
                $line = substr_replace($line, '', 0, 2);
            }

            if ($repo) {
                $rep = '[#$1](https://github.com/'.$repo.'/pull/$1)';
                // $line = preg_replace('/[^\[]\#(\d+)[^\]]/', $rep, $line);
                // $line = preg_replace('/[^\[]?\#(\d+)[^\]]?/', $rep, $line);
                $line = preg_replace('/\[\#(\d+)\]\(http[^)]*\)/', '#$1', $line);
                $line = preg_replace('/\#(\d+)/', $rep, $line);
            }
            
            $changes[] = [
                'tag' => $tag,
                'type' => $this->getType($tag),
                'message' => trim($md->line($line)),
                // 'message' => $line
            ];
        }
        
        return $changes;
    }
}
