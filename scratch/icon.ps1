Add-Type -AssemblyName System.Drawing
$pngPath = 'C:\Users\DAVID\Desktop\ANTIGRAVITY\public\icon-512-premium.png'
$outPath = 'C:\Users\DAVID\Desktop\ANTIGRAVITY\public\images\play_console_icon.jpg'

$img = [System.Drawing.Image]::FromFile($pngPath)
$bmp = New-Object System.Drawing.Bitmap(512, 512)
$graph = [System.Drawing.Graphics]::FromImage($bmp)
$graph.Clear([System.Drawing.Color]::Black)
$graph.DrawImage($img, 0, 0, 512, 512)
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$graph.Dispose()
$bmp.Dispose()
$img.Dispose()
