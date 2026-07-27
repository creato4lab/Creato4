$path = 'a:\creato4\src\components\Preloader.tsx'
$lines = Get-Content $path
$lines[0..422] | Set-Content $path
