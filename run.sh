#!/bin/bash

# 检查Python是否安装
if command -v python3 &> /dev/null; then
    echo "使用Python启动HTTP服务器..."
    open http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null &
    python3 -m http.server 8080 --directory dist
elif command -v python &> /dev/null; then
    echo "使用Python启动HTTP服务器..."
    start http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null &
    python -m http.server 8080 --directory dist
elif command -v node &> /dev/null; then
    echo "使用http-server启动..."
    npx http-server dist -p 8080 -o
else
    echo "请先安装Python或Node.js。"
    echo "1. 安装Python: https://www.python.org/downloads/"
    echo "2. 或安装Node.js: https://nodejs.org/"
    exit 1
fi