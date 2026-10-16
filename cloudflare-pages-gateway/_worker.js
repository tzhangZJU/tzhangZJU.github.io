const ALLOWED_ORIGINS = new Set(["https://tzhangzju.github.io"]);
const RETENTION_WINDOW = "-2 years";

const ALLOWED_EVENTS = new Set([
  "analytics_consent_accept", "back_to_top_click", "contact_embodied_model_click",
  "contact_github_click", "contact_zhihu_click", "demo_fold_box_video_click",
  "demo_fold_cloth_video_click", "demo_ink_rubbing_video_click",
  "dual_stream_memory_project_click", "email_contact_click", "github_magic_w0_click",
  "github_realtime_vla_click", "hero_view_work_click", "language_toggle_click",
  "location_update", "magic_brain_chinese_article_click",
  "magic_brain_english_article_click", "magic_brain_project_click",
  "magic_w0_project_click", "mobile_menu_toggle_click", "molmospaces_leaderboard_click",
  "nav_about_click", "nav_demos_click", "nav_papers_click", "nav_system_click",
  "nav_work_click", "page_view", "paper_dual_stream_memory_click",
  "paper_execution_aligned_noise_click", "paper_magic_w0_click",
  "paper_realtime_vla_click", "paper_rm_wam_click", "paper_tarsphere_click",
  "paper_trajectory_peaks_click", "ppt_download_click", "privacy_settings_click",
  "realtime_vla_project_click", "robodojo_leaderboard_click", "theme_toggle_click",
  "vla_interview_click"
]);

// Representative district-level postal codes. Reverse-geocoding providers do
// not always return a postcode even when they resolve a Chinese district, and
// Cloudflare's fallback postcode may only represent the municipality.
const DISTRICT_POSTAL_CODES = new Map([
  ["310101", "200001"], ["310104", "200030"], ["310105", "200050"],
  ["310106", "200040"], ["310107", "200333"], ["310109", "200086"],
  ["310110", "200082"], ["310112", "201100"], ["310113", "201900"],
  ["310114", "201800"], ["310115", "200135"], ["310116", "201540"],
  ["310117", "201600"], ["310118", "201700"], ["310120", "201400"],
  ["310151", "202150"]
]);

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://tzhangzju.github.io",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "Vary": "Origin"
  };
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
  });
}

function classifyDevice(userAgent) {
  if (/iPad|Tablet/i.test(userAgent)) return "tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(userAgent)) return "mobile";
  return "desktop";
}

function classifyBrowser(userAgent) {
  if (!userAgent) return "Unknown";

  // App-embedded browsers must be checked before their Chromium/WebKit engine.
  if (/MicroMessenger/i.test(userAgent)) return /wxwork/i.test(userAgent) ? "WeCom" : "WeChat";
  if (/DingTalk/i.test(userAgent)) return "DingTalk";
  if (/Lark|Feishu/i.test(userAgent)) return "Feishu/Lark";
  if (/AlipayClient/i.test(userAgent)) return "Alipay";
  if (/AliApp\(TB|WindVane/i.test(userAgent)) return "Taobao";
  if (/baiduboxapp/i.test(userAgent)) return "Baidu App";
  if (/Weibo/i.test(userAgent)) return "Weibo";
  if (/Instagram/i.test(userAgent)) return "Instagram";
  if (/FBAN|FBAV/i.test(userAgent)) return "Facebook";
  if (/ChatGPT|OpenAI|Codex/i.test(userAgent)) return "ChatGPT/Codex";
  if (/LinkedInApp/i.test(userAgent)) return "LinkedIn";
  if (/Twitter/i.test(userAgent)) return "X/Twitter";
  if (/Telegram/i.test(userAgent)) return "Telegram";
  if (/(?:^|\s)Line\//i.test(userAgent)) return "LINE";
  if (/musical_ly|TikTok/i.test(userAgent)) return "TikTok";
  if (/aweme|BytedanceWebview/i.test(userAgent)) return "Douyin";
  if (/XiaoHongShu|XHS/i.test(userAgent)) return "Xiaohongshu";
  if (/MQQBrowser/i.test(userAgent)) return "QQ Browser";
  if (/(?:^|\s)QQ\//i.test(userAgent)) return "QQ";
  if (/GSA\//i.test(userAgent)) return "Google App";

  // Vendor browsers and privacy browsers generally include a Chrome token too.
  if (/HuaweiBrowser/i.test(userAgent)) return "Huawei Browser";
  if (/SamsungBrowser/i.test(userAgent)) return "Samsung Internet";
  if (/MiuiBrowser/i.test(userAgent)) return "MIUI Browser";
  if (/VivoBrowser/i.test(userAgent)) return "vivo Browser";
  if (/HeyTapBrowser|OppoBrowser/i.test(userAgent)) return "OPPO Browser";
  if (/Quark/i.test(userAgent)) return "Quark";
  if (/UCBrowser|UCWEB/i.test(userAgent)) return "UC Browser";
  if (/QHBrowser|360SE|360EE/i.test(userAgent)) return "360 Browser";
  if (/MetaSr|SogouMobileBrowser/i.test(userAgent)) return "Sogou Browser";
  if (/DuckDuckGo/i.test(userAgent)) return "DuckDuckGo";
  if (/YaBrowser/i.test(userAgent)) return "Yandex Browser";
  if (/Vivaldi/i.test(userAgent)) return "Vivaldi";
  if (/Brave/i.test(userAgent)) return "Brave";
  if (/Whale/i.test(userAgent)) return "Naver Whale";
  if (/Arc\//i.test(userAgent)) return "Arc";

  // Standalone browsers and generic system WebViews.
  if (/EdgiOS|EdgA|Edg\//i.test(userAgent)) return "Edge";
  if (/OPiOS|OPR\/|Opera Mini|Opera Mobi/i.test(userAgent)) return "Opera";
  if (/FxiOS|Firefox\//i.test(userAgent)) return "Firefox";
  if (/Electron/i.test(userAgent)) return "Electron";
  if (/HeadlessChrome/i.test(userAgent)) return "Headless Chrome";
  if (/CriOS|Chrome\//i.test(userAgent) && !/; wv\)|\bwv\b|Version\/4\.0/i.test(userAgent)) return "Chrome";
  if (/Android/i.test(userAgent) && /; wv\)|\bwv\b|Version\/4\.0/i.test(userAgent)) return "Android WebView";
  if (/iPhone|iPad|iPod/i.test(userAgent) && /AppleWebKit/i.test(userAgent) && !/Safari\//i.test(userAgent)) return "iOS WebView";
  if (/Version\/[^ ]+.*Safari\//i.test(userAgent)) return "Safari";
  if (/MSIE|Trident\//i.test(userAgent)) return "Internet Explorer";
  return "Other";
}

function classifyOS(userAgent) {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Mac OS X|Macintosh/i.test(userAgent)) return "macOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Other";
}

function optionalNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function optionalText(value, maxLength = 200) {
  return typeof value === "string" && value ? value.slice(0, maxLength) : null;
}

function classifyIPVersion(ipAddress) {
  if (typeof ipAddress !== "string" || !ipAddress) return "unknown";
  if (ipAddress.includes(":")) return "IPv6";
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ipAddress)) return "IPv4";
  return "unknown";
}

function resolvePostalCode(details, cf, hasReverseGeocode) {
  const providerPostalCode = optionalText(details.postal_code, 30);
  if (!hasReverseGeocode) return providerPostalCode || cf.postalCode || null;

  const districtCode = String(details.district_code || "").replace(/\D/g, "");
  const districtPostalCode = DISTRICT_POSTAL_CODES.get(districtCode);
  if (districtPostalCode && (!providerPostalCode || providerPostalCode === "200000")) {
    return districtPostalCode;
  }
  return providerPostalCode || districtPostalCode || cf.postalCode || null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "homepage-analytics-pages", consent_version: "v5-location-prompt" }, 200, headers);
    }

    if (request.method === "OPTIONS" && url.pathname === "/events") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST" || url.pathname !== "/events") {
      return json({ ok: false, error: "not_found" }, 404, headers);
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return json({ ok: false, error: "origin_not_allowed" }, 403, headers);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400, headers);
    }

    if (!ALLOWED_EVENTS.has(body.event)) {
      return json({ ok: false, error: "event_not_allowed" }, 400, headers);
    }

    const sourcePage = typeof body.source_page === "string" ? body.source_page.slice(0, 500) : "";
    if (!sourcePage.startsWith("https://tzhangzju.github.io")) {
      return json({ ok: false, error: "invalid_source_page" }, 400, headers);
    }

    const userAgent = request.headers.get("User-Agent") || "";
    const cf = request.cf || {};
    const location = body.location && typeof body.location === "object" ? body.location : {};
    const details = location.details && typeof location.details === "object" ? location.details : {};
    const latitude = optionalNumber(location.latitude);
    const longitude = optionalNumber(location.longitude);
    const hasGps = latitude !== null && latitude >= -90 && latitude <= 90
      && longitude !== null && longitude >= -180 && longitude <= 180;
    const hasReverseGeocode = hasGps && optionalText(details.district);

    const ipAddress = request.headers.get("CF-Connecting-IP") || "unknown";

    await env.DB.prepare(`
      INSERT INTO analytics_events (
        event_name, event_id, visitor_id, session_id,
        source_page, referrer, ip_address, ip_version,
        country, region, region_code, city, postal_code, timezone,
        district, district_code, location_source, geocoding_provider,
        device, browser, operating_system, consent_version,
        latitude, longitude, location_accuracy_m, location_captured_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      body.event,
      optionalText(body.event_id, 100),
      optionalText(body.visitor_id, 100),
      optionalText(body.session_id, 100),
      sourcePage,
      typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "",
      ipAddress,
      classifyIPVersion(ipAddress),
      hasGps ? (optionalText(details.country_code, 10) || cf.country || null) : (cf.country || null),
      hasGps ? (optionalText(details.region) || cf.region || null) : (cf.region || null),
      hasGps ? (optionalText(details.region_code, 30) || cf.regionCode || null) : (cf.regionCode || null),
      hasGps ? (optionalText(details.city) || cf.city || null) : (cf.city || null),
      hasGps ? resolvePostalCode(details, cf, hasReverseGeocode) : (cf.postalCode || null),
      cf.timezone || null,
      hasGps ? optionalText(details.district) : null,
      hasGps ? optionalText(details.district_code, 30) : null,
      hasReverseGeocode ? "gps_reverse_geocode" : (hasGps ? "gps" : "ip"),
      hasReverseGeocode ? optionalText(details.provider, 50) : null,
      classifyDevice(userAgent),
      classifyBrowser(userAgent),
      classifyOS(userAgent),
      typeof body.consent_version === "string" ? body.consent_version.slice(0, 20) : "v5-location-prompt",
      hasGps ? latitude : null,
      hasGps ? longitude : null,
      optionalNumber(location.accuracy),
      typeof location.captured_at === "string" ? location.captured_at.slice(0, 50) : null
    ).run();

    // Apply rolling retention after successful writes. This keeps the database
    // at a maximum two-year history without requiring a separate cron worker.
    await env.DB.prepare(`
      DELETE FROM analytics_events
      WHERE occurred_at < datetime('now', ?)
    `).bind(RETENTION_WINDOW).run();

    return json({ ok: true }, 201, headers);
  }
};
