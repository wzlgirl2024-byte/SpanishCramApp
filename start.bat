@echo off
chcp 65001 >nul
title 西班牙语复习软件启动器
echo ========================================
echo   西班牙语复习软件 - 一键启动
echo ========================================
echo.

REM 检查是否已存在进程在运行
netstat -ano | findstr ":8080" >nul
if not errorlevel 1 (
    echo 端口8080已被占用，可能是软件已在运行。
    echo 正在尝试打开浏览器...
    start http://localhost:8080
    echo 如果无法打开，请关闭其他占用8080端口的程序。
    pause
    exit /b 0
)

REM 检查Python
echo 正在检查Python...
python --version >nul 2>&1
if not errorlevel 1 (
    echo 检测到Python，使用Python启动HTTP服务器...
    start http://localhost:8080
    python -m http.server 8080 --directory dist
    goto :end
)

REM 检查Node.js和http-server
echo Python未找到，正在检查Node.js...
node --version >nul 2>&1
if not errorlevel 1 (
    echo 检测到Node.js，检查http-server...
    npm list -g http-server >nul 2>&1
    if not errorlevel 1 (
        echo 使用http-server启动...
        start http://localhost:8080
        http-server dist -p 8080 -o
        goto :end
    ) else (
        echo 正在全局安装http-server（需要管理员权限）...
        npm install -g http-server
        if not errorlevel 1 (
            echo 安装成功，启动...
            start http://localhost:8080
            http-server dist -p 8080 -o
            goto :end
        ) else (
            echo 安装失败，请手动以管理员身份运行：npm install -g http-server
        )
    )
)

REM 两者都不可用
echo.
echo 错误：未找到Python或Node.js。
echo.
echo 请安装以下任一环境：
echo 1. Python 3（推荐）：https://www.python.org/downloads/
echo 2. Node.js：https://nodejs.org/
echo.
echo 安装后请重新运行此脚本。
echo.
pause
exit /b 1

:end
echo.
echo 服务器已启动，按Ctrl+C停止。
pause