Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\DAVID\.gemini\antigravity\brain\b186b5a3-6f23-413a-ae86-717c10f7088c\antigravity_header_1778769763617.png')
$bmp = New-Object System.Drawing.Bitmap(4096, 2304)
$graph = [System.Drawing.Graphics]::FromImage($bmp)
$graph.DrawImage($img, 0, 0, 4096, 2304)
$bmp.Save('C:\Users\DAVID\Desktop\ANTIGRAVITY\public\images\play_console_header.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
$graph.Dispose()
$bmp.Dispose()
$img.Dispose()
