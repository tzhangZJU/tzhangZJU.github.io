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

## 访问统计查询

前端统计入口为 `https://homepage-analytics-mobile.pages.dev/events`。该 Pages Function 与现有 `homepage-analytics` D1 数据库绑定，用于避开部分移动网络对 `workers.dev` 的 DNS 污染或阻断；原 Worker 可继续作为管理与历史实现保留。

统计事件采用滚动两年保留策略。网关在每次成功写入后清理 `occurred_at` 早于当前时间两年的记录；从 6 个月延长到 2 年不会影响当前已有数据。

D1 的 `occurred_at` 由 `datetime('now')` 生成并按 UTC 保存；例如数据库中的 `2026-10-16 19:26:02` 对应北京时间 `2026-10-17 03:26:02`。保留 UTC 可避免跨时区和夏令时歧义，查询展示时使用 `datetime(occurred_at, '+8 hours')` 转为东八区。

D1 中的 IP 字段名为 `ip_address`，地址类型字段名为 `ip_version`（`IPv4` / `IPv6`）。查看最新完整记录及东八区时间时可使用：

`referrer` 为空表示直接访问（手动输入、书签、二维码、新窗口等），或来源网站/浏览器隐私策略未提供 Referrer；这是浏览器层面的正常结果，不代表上报失败。前端只保留可用 Referrer 的 origin，不保留路径和查询参数。

浏览器识别覆盖常见桌面端、移动端、国产浏览器和 App 内置 WebView，包括 Chrome、Safari、Edge、Firefox、Opera、WeChat、WeCom、QQ Browser、飞书、钉钉、支付宝、淘宝、微博、抖音、小红书、华为、小米、vivo、OPPO、UC、夸克、360、搜狗、Samsung Internet 及 Android/iOS WebView 等。服务端只能依据浏览器提供的 User-Agent 判定；如果某些 Chromium 内核浏览器为了兼容性或隐私只声明为 Chrome，则无法可靠区分其真实品牌。

```sql
SELECT id, occurred_at AS occurred_at_utc,
       datetime(occurred_at, '+8 hours') AS occurred_at_cn,
       event_name, source_page, ip_address, ip_version,
       country, region, city, district, district_code, location_source,
       device, browser, operating_system,
       consent_version, latitude, longitude, location_accuracy_m,
       location_captured_at
FROM analytics_events
ORDER BY id DESC
LIMIT 100;
```

核心交互使用独立的 `event_name`，包括导航、主题/语言切换、访谈、榜单、PPT 下载、项目主页、论文、GitHub、演示视频和联系方式等。按事件类型汇总点击量可使用：

事件由前端元素的 `data-analytics-event` 标记统一触发，并在 Cloudflare Worker 中通过显式白名单校验；新增事件时应同步更新前端标记与 Worker 白名单。D1 主表 `analytics_events` 已移除旧版仅允许 `page_view`、`ppt_download_click` 的表级约束，迁移前的 5 条记录保存在备份表 `analytics_events_legacy_v2_20261017` 中。

移动端事件会先写入浏览器本地待发送队列，仅在 Worker 返回成功后移除。用户首次同意统计后，`analytics_consent_accept` 与 `page_view` 会立即上报，不再等待 GPS；定位成功后再通过独立的 `location_update` 事件补充经纬度。网络恢复、下次打开页面及页面转入后台时都会重试尚未确认送达的事件，以降低微信内置浏览器和移动网络切换造成的漏报。

定位采用两级策略：页面打开时主动请求浏览器定位权限；没有 GPS 时使用 Cloudflare 的公网 IP 定位，`location_source=ip`；浏览器获得 GPS 权限后，通过 BigDataCloud 客户端逆地理编码补充 `district`、`district_code` 及更准确的省市信息，`location_source=gps_reverse_geocode`；逆地理编码失败但 GPS 可用时仍保留经纬度，`location_source=gps`。针对部分必须由用户手势触发权限提示的移动端或内嵌浏览器，首次自动请求失败后会在用户第一次点击或按键时重试一次。

当 GPS 已解析到上海区级行政代码、但逆地理编码服务没有返回邮编时，网关使用区级代表邮编补全 `postal_code`，避免继续沿用上海市级的 `200000`。若服务返回了更精确的邮编，则优先保留服务返回值。

每次前端更新发布时，必须同时更新 `script.js` 中的 `analyticsConsentVersion`、`index.html` 中的脚本缓存版本，以及 Cloudflare 网关健康检查返回的 `consent_version`。

检查移动端记录可使用：

```sql
SELECT id, occurred_at, event_name, ip_address, country, region, city,
       latitude, longitude, location_accuracy_m,
       device, browser, operating_system
FROM analytics_events
WHERE device <> 'desktop'
ORDER BY id DESC
LIMIT 100;
```

```sql
SELECT event_name, COUNT(*) AS event_count
FROM analytics_events
GROUP BY event_name
ORDER BY event_count DESC, event_name;
```

查看最近的核心点击明细可使用：

```sql
SELECT id, occurred_at, event_name, ip_address, country, region, city,
       device, browser, operating_system
FROM analytics_events
WHERE event_name <> 'page_view'
ORDER BY id DESC
LIMIT 100;
```

## 隐私与安全

当前页面采用以下防护：

- 页面级 CSP 仅允许加载同源脚本、样式、图片和视频，并关闭对象、框架、网络连接及表单提交。
- 使用 `no-referrer`，访问外部项目、论文或访谈链接时不发送本页来源地址。
- 邮箱不再以明文或 `mailto:` 出现在静态 HTML 中，仅在用户点击“邮件联系”时由脚本还原。
- `robots.txt` 阻止遵守规则的爬虫抓取演示视频与访谈封面；页面同时要求搜索引擎不索引图片、不生成视频预览。

这些措施只能降低自动抓取和误用风险，不能阻止有意下载。浏览器要显示图片或播放视频，就必须取得媒体数据；GitHub Pages 也会公开发布部署目录中的所有静态文件。若媒体需要真正的访问控制，应把原始文件移出公开仓库，改用私有对象存储或视频平台，并通过后端授权生成短时签名 URL；更高要求可使用分片流媒体和 DRM。

GitHub Pages 不支持为仓库配置完整的自定义响应头。若迁移到支持响应头的平台，建议至少设置：

```text
Content-Security-Policy: default-src 'self'; base-uri 'none'; object-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; connect-src https://homepage-analytics-mobile.pages.dev https://homepage-analytics.zhangt91.workers.dev; form-action 'none'; frame-ancestors 'none'
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=(), usb=()
X-Content-Type-Options: nosniff
Cross-Origin-Resource-Policy: same-origin
```

注意：邮箱曾出现在 Git 历史中。当前改动可以阻止基础页面爬虫直接提取，但无法抹除已经发布的提交历史；若需要从历史中移除，必须重写 Git 历史并强制推送，执行前应先备份并确认影响范围。
