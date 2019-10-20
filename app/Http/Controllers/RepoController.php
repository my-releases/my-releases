<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;

class RepoController extends Controller
{
    public function repo()
    {
        //$output = $this->mockChangeLogJs();
        //$output = $this->mockLaravelChangeLog();
        $output = $this->mockGithubReleases();
        
        return [
            'data' => $output
        ];
    }
    
    private function mockLaravelChangeLog()
    {
        $data = file_get_contents(
            base_path('tests/mocks/changelog-laravel.md')
        );
    
        return $this->github($data);
    }
    
    private function mockChangeLogJs()
    {
        $data = file_get_contents(
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
            'fix' => 'blue',
            'contributor' => 'blue',
            'improved' => 'blue',
            'remove' => 'red',
            'revert' => 'red',
            'important' => 'red'
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
    
    
    private function mockGithubReleases()
    {
        $file = 'github-releases-endpoint.json';
    
        $data = file_get_contents(
            base_path('tests/mocks/' . $file)
        );
        
        $data = json_decode($data, false);
        $changes = [];
        foreach ($data as $datum) {
            $date = date('F dS Y', strtotime($datum->created_at));
            $changes[] = [
                'version' => $datum->tag_name,
                'title' => $date,
                'changes' => $this->mapChanges(explode("\r\n", $datum->body), -1)
            ];
        }
        
        return $changes;
        
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
        
        //dd($data);
        
        foreach ($data as $i => $item) {
            //$output[] = $data;
            
            if( !Str::startsWith($item, '## ') ) {
                continue;
            }
    
            $changes = $this->mapChanges($data, $i, $linesMax);
            
            $output[] = [
                //'title' => 'November 12, 2019',
                'version' => $md->line(str_replace('## ', '', $item)),
                'changes' => $changes
            ];
            
            //$counter++;
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
    private function mapChanges(array $data, $i = 0, $linesMax = null): array
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
            //dd($line);
            
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
            
            //$tag = 'Added';
            $changes[] = [
                'tag' => $tag,
                'type' => $this->getType($tag),
                'message' => $md->line($line),
                //'message' => $line
            ];
        }
        
        return $changes;
    }
}
