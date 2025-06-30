192.168.0.100
///// batch file example to start your Docker container on Windows.
@echo off
docker run -d -p 3000:3000 --name mern-container my-mern-app
echo Server started on port 3000
pause
///// batch file example to start your Docker container on Windows.


///// Windows batch script that backs up your Docker volume data by copying it to a folder with the current date:
@echo off
setlocal

REM Set the name of your Docker volume
set VOLUME_NAME=your_db_volume

REM Set backup destination folder
set BACKUP_DIR=C:\docker_db_backups

REM Create backup folder with date
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
    set DATE=%%d-%%b-%%c
)

set DEST=%BACKUP_DIR%\backup_%DATE%
mkdir "%DEST%"

REM Get volume mount path (Docker volumes are stored in a default location)
for /f "delims=" %%i in ('docker volume inspect %VOLUME_NAME% -f "{{.Mountpoint}}"') do set VOLUME_PATH=%%i

REM Copy files from volume to backup folder
xcopy "%VOLUME_PATH%\*" "%DEST%\" /E /I /Y

echo Backup completed at %DEST%
pause
///// Windows batch script that backs up your Docker volume data by copying it to a folder with the current date:


