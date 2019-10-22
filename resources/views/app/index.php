<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?php echo $title ?? 'My Releases' ?></title>
    
    <link rel="stylesheet" type="text/css" media="screen" href="/static/css/app.<?php echo ($isDev ? 'full' : 'min') . '.css?v=' . $js['version'] ?>" />
    
</head>
<body>
    <div id="app-wrapper" :class="[theme]">
        <app></app>
    
        <div id="footer-bar">
            <a href="https://github.com/my-releases" target="_blank">GitHub</a> &middot;
            <a href="https://undraw.co" target="_blank">Icons by <b>unDraw</b></a> &middot;
            <a href="https://www.bright.sh" target="_blank">Deployed with <b>Bright.sh</b></a>
        </div>
    </div>
    
    <script>
        window.app = <?php echo json_encode($js) ?>;
    </script>
    
    <?php if($isDev): ?>
        <script>document.write('<script src="//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
    <?php endif; ?>
    <script src="/static/js/app.<?php echo ($isDev ? 'full' : 'min') . '.js?v=' . ($js['version'] ?? '1.0.0') ?>"></script>
    
    <script>
        console.log(
            '%c app %c '+app.version+' %c %c Vue %c ' + Vue.version + ' %c %c Vue Router %c ' + VueRouter.version,
            'background: #444; color: #fff; padding: 2px 10px; font-size: 8pt; border-radius: 3px 0 0 3px;',
            'background: #2ecc71; color: #fff; padding: 2px 10px; font-size: 8pt; border-radius: 0 3px 3px 0;',
            '',
            'background: #444; color: #fff; padding: 2px 10px; font-size: 8pt; border-radius: 3px 0 0 3px;',
            'background: #9b59b6; color: #fff; padding: 2px 10px; font-size: 8pt; border-radius: 0 3px 3px 0;',
            '',
            'background: #444; color: #fff; padding: 2px 10px; font-size: 8pt; border-radius: 3px 0 0 3px;',
            'background: #9b59b6; color: #fff; padding: 2px 10px; font-size: 8pt; border-radius: 0 3px 3px 0;',
        );
    
        console.info('You are running my-releases in %s mode.', app.env);
    </script>

    <?php include __DIR__ . '/../analytics.php' ?>
</body>
</html>
