@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
set "MAVEN_CMD=%SCRIPT_DIR%.maven\apache-maven-3.9.9\bin\mvn.cmd"

if not exist "%MAVEN_CMD%" (
    echo Error: Maven not found at %MAVEN_CMD%
    exit /b 1
)

call "%MAVEN_CMD%" %*
endlocal
