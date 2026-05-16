Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\DAVID\.gemini\antigravity\brain\b186b5a3-6f23-413a-ae86-717c10f7088c\antigravity_feature_graphic_1778772316792.png')
$bmp = New-Object System.Drawing.Bitmap(1024, 500)
$graph = [System.Drawing.Graphics]::FromImage($bmp)
$graph.DrawImage($img, 0, 0, 1024, 500)
$bmp.Save('C:\Users\DAVID\Desktop\ANTIGRAVITY\public\images\play_store_feature.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
$graph.Dispose()
$bmp.Dispose()
$img.Dispose()
