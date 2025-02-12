Set oShell = CreateObject ("WScript.Shell")
Dim strArgs
strArgs = "cmd /c run_script.bat"
oShell.Run strArgs, 0, false