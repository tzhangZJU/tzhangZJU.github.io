const ALLOWED_ORIGINS = new Set(["https://tzhangzju.github.io"]);

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
  if (/MicroMessenger/i.test(userAgent)) return "WeChat";
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/OPR\//i.test(userAgent)) return "Opera";
  if (/CriOS|Chrome\//i.test(userAgent)) return "Chrome";
  if (/FxiOS|Firefox\//i.test(userAgent)) return "Firefox";
  if (/Safari\//i.test(userAgent)) return "Safari";
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

function classifyIPVersion(ipAddress) {
  if (typeof ipAddress !== "string" || !ipAddress) return "unknown";
  if (ipAddress.includes(":")) return "IPv6";
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ipAddress)) return "IPv4";
  return "unknown";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "homepage-analytics-pages", consent_version: "v3-default" }, 200, headers);
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

    const ipAddress = request.headers.get("CF-Connecting-IP") || "unknown";

    await env.DB.prepare(`
      INSERT INTO analytics_events (
        event_name, source_page, referrer, ip_address, ip_version,
        country, region, region_code, city, postal_code, timezone,
        device, browser, operating_system, consent_version,
        latitude, longitude, location_accuracy_m, location_captured_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      body.event,
      sourcePage,
      typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "",
      ipAddress,
      classifyIPVersion(ipAddress),
      cf.country || null,
      cf.region || null,
      cf.regionCode || null,
      cf.city || null,
      cf.postalCode || null,
      cf.timezone || null,
      classifyDevice(userAgent),
      classifyBrowser(userAgent),
      classifyOS(userAgent),
      typeof body.consent_version === "string" ? body.consent_version.slice(0, 20) : "v2",
      optionalNumber(location.latitude),
      optionalNumber(location.longitude),
      optionalNumber(location.accuracy),
      typeof location.captured_at === "string" ? location.captured_at.slice(0, 50) : null
    ).run();

    return json({ ok: true }, 201, headers);
  }
};
