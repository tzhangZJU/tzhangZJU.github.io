# Tao Zhang Personal Homepage

个人主页采用纯静态 HTML、CSS 和 JavaScript，不需要安装依赖或执行构建命令，可直接部署到 GitHub Pages。

## 本地预览

在仓库目录中运行：

```bash
python3 -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/`。

## 内容更新位置

- 页面结构与论文、项目、联系方式：`index.html`
- 颜色、布局、移动端样式：`styles.css`
- 中英文案、浅色/深色主题切换与移动端导航：`script.js`
- 图片：`assets/`

主页现已包含教育与工作经历、Magic-Lab 团队和技术体系建设、代表成果、公开交流、论文与项目。若后续补充正式头像，可替换 `assets/interview-cover.png`；保持原文件名即可直接生效。

## 上传到 GitHub

确认本地预览无误后，在仓库目录运行：

```bash
git status
git add index.html styles.css script.js README.md .gitignore assets
git commit -m "Build personal homepage"
git push -u origin main
```

若使用 SSH 地址推送失败，请先确认 GitHub SSH Key 已配置；也可把远程地址改为 HTTPS 后再推送：

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

首次发布或后续推送后，页面更新通常需要等待片刻。若浏览器仍显示旧内容，可进行强制刷新。

## 隐私与安全

当前页面采用以下防护：

- 页面级 CSP 仅允许加载同源脚本、样式、图片和视频，并关闭对象、框架、网络连接及表单提交。
- 使用 `no-referrer`，访问外部项目、论文或访谈链接时不发送本页来源地址。
- 邮箱不再以明文或 `mailto:` 出现在静态 HTML 中，仅在用户点击“邮件联系”时由脚本还原。
- `robots.txt` 阻止遵守规则的爬虫抓取演示视频与访谈封面；页面同时要求搜索引擎不索引图片、不生成视频预览。

这些措施只能降低自动抓取和误用风险，不能阻止有意下载。浏览器要显示图片或播放视频，就必须取得媒体数据；GitHub Pages 也会公开发布部署目录中的所有静态文件。若媒体需要真正的访问控制，应把原始文件移出公开仓库，改用私有对象存储或视频平台，并通过后端授权生成短时签名 URL；更高要求可使用分片流媒体和 DRM。

GitHub Pages 不支持为仓库配置完整的自定义响应头。若迁移到支持响应头的平台，建议至少设置：

```text
Content-Security-Policy: default-src 'self'; base-uri 'none'; object-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
X-Content-Type-Options: nosniff
Cross-Origin-Resource-Policy: same-origin
```

注意：邮箱曾出现在 Git 历史中。当前改动可以阻止基础页面爬虫直接提取，但无法抹除已经发布的提交历史；若需要从历史中移除，必须重写 Git 历史并强制推送，执行前应先备份并确认影响范围。
