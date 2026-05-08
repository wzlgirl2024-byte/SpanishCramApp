@echo off
REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo Python未安装，正在尝试使用node.js的http-server...
    npm list -g http-server >nul 2>&1
    if errorlevel 1 (
        echo 请先安装Python或Node.js。
        echo 1. 安装Python: https://www.python.org/downloads/
        echo 2. 或安装Node.js: https://nodejs.org/
        echo 3. 然后再次运行此脚本。
        pause
        exit /b 1
    ) else (
        echo 使用http-server启动...
        http-server dist -p 8080 -o
    )
) else (
    echo 使用Python启动HTTP服务器...
    start http://localhost:8080
    python -m http.server 8080 --directory dist
)