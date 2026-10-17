# Tao Zhang Personal Homepage

个人主页采用纯静态 HTML、CSS 和 JavaScript 开发，无需安装依赖或执行构建命令，可直接在本地预览并部署到 GitHub Pages。

## 本地预览

在仓库目录中运行：

```bash
python3 -m http.server 4173
```

然后在浏览器访问 `http://127.0.0.1:4173/`。

## 内容更新位置

- 页面结构与论文、项目、联系方式：`index.html`
- 颜色、布局和移动端样式：`styles.css`
- 中英文案、语言与主题切换、页面交互：`script.js`
- 图片、视频等静态素材：`assets/`

修改完成后，建议先通过本地预览检查桌面端与移动端显示效果，再提交到 GitHub。

## 上传到 GitHub

确认本地预览无误后，在仓库目录运行：

```bash
git status
git add .
git commit -m "Update personal homepage"
git push -u origin main
```

若使用 SSH 地址推送失败，请先确认 GitHub SSH Key 已配置；也可将远程地址改为 HTTPS 后重试：

```bash
git remote set-url origin https://github.com/tzhangZJU/tzhangZJU.github.io.git
git push -u origin main
```

## 启用 GitHub Pages

1. 打开仓库 `https://github.com/tzhangZJU/tzhangZJU.github.io`。
2. 进入 `Settings` → `Pages`。
3. 在 `Build and deployment` 中选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/(root)`，点击 `Save`。
5. 等待 GitHub Actions 部署完成后，访问 `https://tzhangzju.github.io/`。

首次发布或后续推送后，页面更新通常需要等待片刻。若浏览器仍显示旧内容，可尝试强制刷新。
