$sh = New-Object -ComObject WScript.Shell
$sc = $sh.CreateShortcut('C:\Users\itzfa\Desktop\Poland Internship Hunter.lnk')
"TargetPath: " + $sc.TargetPath
"Arguments: " + $sc.Arguments
"WorkingDirectory: " + $sc.WorkingDirectory
