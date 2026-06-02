@echo off
cd /d "D:\Claude\Home\Projects\Lucia Fashion\Site Lucia Fashion\lucia-fashion"
git add .
set /p msg="Descrie modificarea: "
git commit -m "%msg%"
git push
echo.
echo Site actualizat cu succes!
pause