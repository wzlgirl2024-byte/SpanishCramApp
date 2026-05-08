@echo off
setlocal enabledelayedexpansion

REM 获取当前日期和时间
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set datepart=!datetime:~0,8!
set timepart=!datetime:~8,6!
set timestamp=!datepart!_!timepart!

REM 创建备份文件夹名称
set backup_name=src_backup_%datepart%_%timepart%
set backup_dir=src_backup\%backup_name%

REM 复制 src 到备份目录
xcopy /E /I /Y src %backup_dir%

echo Backup created at %backup_dir%
pause