:: compress.bat

@echo off
chcp 65001 > nul
setlocal EnableDelayedExpansion

set FOLDER=.\script\dist
set COUNT=0

echo 대상 폴더: %FOLDER%
echo.

for /R "%FOLDER%" %%f in (*.js) do (
    @terser "%%f" -c passes=3,inline=3,reduce_vars=true,unused=true -m -o "%%f"
    @echo 정리됨: %%f
    @set /A COUNT+=1 > nul
)

echo.
echo 총 정리된 파일 수: !COUNT!
exit /b
