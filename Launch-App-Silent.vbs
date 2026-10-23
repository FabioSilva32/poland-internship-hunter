Set WshShell = CreateObject("WScript.Shell")
strPath = WshShell.CurrentDirectory & "\dist-electron\win-unpacked\Poland Internship Hunter.exe"
WshShell.Run """" & strPath & """", 1, False
