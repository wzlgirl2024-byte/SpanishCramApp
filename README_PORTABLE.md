# 便携运行版本（无需npm）

此版本已预构建为静态文件，无需安装Node.js或npm即可运行。适用于Windows、macOS和Linux。

## 包含文件

- `dist/` – 编译后的前端文件（HTML、CSS、JS）
- `start.bat` – **Windows一键启动脚本**（推荐，智能检测环境）
- `run.sh` – macOS/Linux启动脚本
- `API_KEY_TEST_PLAN.md` – API密钥更换测试方案（可选）
- `run.bat` – 旧版Windows启动脚本（备用）

## 运行步骤

### Windows用户（推荐使用start.bat）
1. 双击 `start.bat`。
2. 脚本会自动检测是否已安装 **Python 3** 或 **Node.js**：
   - 如果已安装，会自动启动HTTP服务器并打开浏览器（http://localhost:0527）。
   - 如果未安装，会显示清晰指引，并尝试自动安装 `http-server`（需管理员权限）。
3. 如果出现防火墙提示，请允许访问。
4. 浏览器打开后，在页面右上角“API Key设置”中输入您的DeepSeek API Key即可使用。

### macOS / Linux用户
1. 打开终端，进入本目录。
2. 为脚本添加执行权限（首次运行需要）：
   ```bash
   chmod +x run.sh
   ```
3. 运行脚本：
   ```bash
   ./run.sh
   ```
4. 浏览器将自动打开；如果没有，请手动访问 http://localhost:0527。

### 备选方案：直接打开文件（不推荐）
如果您没有Python或Node.js，可以尝试直接双击 `dist/index.html`，但某些功能（如语音合成）可能因浏览器安全限制而无法正常工作。建议使用本地服务器。

## 设置API密钥
首次使用需要在页面右上角的“API Key设置”面板中输入您的DeepSeek API Key。密钥仅保存在本地浏览器中，不会上传到任何服务器。

## 注意事项
- 本版本为**静态版本**，所有AI功能仍需要有效的DeepSeek API Key。
- 语音朗读功能依赖浏览器的Web Speech API，仅Chrome/Edge支持西班牙语发音。
- 如果遇到“npm不是可执行文件”错误，说明您正在尝试运行开发版本；请使用本便携版本。

## 故障排除
1. **端口0527被占用**：编辑 `start.bat` 或 `run.sh`，将 `0527` 改为其他端口（如 `0528`）。
2. **浏览器未自动打开**：手动访问 http://localhost:0527。
3. **AI功能报错**：检查API Key是否正确，并确保网络可访问 `api.deepseek.com`。
4. **语音不发音**：确保浏览器允许页面播放音频（通常需要用户交互）。
5. **脚本闪退**：以管理员身份运行 `start.bat`，或根据提示安装Python/Node.js。

## 更新
如需更新到新版本，请替换整个 `dist` 文件夹，并保留您的 `start.bat`/`run.sh` 脚本。

---
如有问题，请参考主项目README或联系开发者。