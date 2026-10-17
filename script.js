document.documentElement.classList.add("js");

const translations = {
  zh: {
    skip: "跳转到正文",
    navAbout: "关于",
    navSystem: "能力体系",
    navWork: "成果与工作",
    navPapers: "论文",
    navDemos: "演示",
    aboutKicker: "PROFILE · 关于",
    systemKicker: "SYSTEM · 能力体系",
    workKicker: "IMPACT & WORK · 成果与代表工作",
    papersKicker: "PUBLICATIONS · 论文",
    demosKicker: "DEMOS · 演示",
    contactKicker: "CONTACT · 合作交流",
    openMenu: "展开导航",
    closeMenu: "收起导航",
    sendEmail: "发送邮件",
    emailContact: "邮件联系",
    themeDark: "夜间",
    themeLight: "日间",
    themeToDark: "切换至深色模式",
    themeToLight: "切换至浅色模式",
    heroName: "张涛",
    heroLead: "魔法原子具身模型负责人<br>算法 VP",
    viewWork: "查看代表工作",
    watchInterview: "观看 VLA 世界模型访谈",
    role: "当前角色",
    roleValue: "魔法原子具身模型负责人 · 算法 VP",
    expertise: "核心方向",
    aboutTitle: "从视觉算法到具身智能，<br>让前沿模型走进真实世界",
    aboutP1: "博士毕业于浙江大学，先后在阿里巴巴、蔚来汽车从事视觉算法研发与自动驾驶工作。2026 年 1 月加入魔法原子，现任具身模型负责人、算法 VP。",
    aboutP2: "负责公司具身智能大模型研发及相关技术体系建设，覆盖数据、平台、模型、评测和部署，持续推动机器人智能系统能力升级。",
    career1Title: "浙江大学博士",
    career1Body: "以系统化科研训练建立视觉与智能算法基础。",
    career2Title: "视觉算法研发",
    career2Body: "参与产业级视觉算法研发，积累算法工程化与规模化落地经验。",
    career3Title: "自动驾驶",
    career3Body: "面向复杂真实环境开展感知与自动驾驶技术研发。",
    career4Title: "具身模型负责人 · 算法 VP",
    career4Body: "统筹具身大模型研发、技术体系建设与近 60 人团队协同。",
    recognition: "学术服务与人才认可",
    recognitionBody: "杭州市高层次人才 · 上海市高层次人才",
    graduateSupervisor: "浙江大学研究生校外导师",
    reviewerLine: "ICRA / ICLR / IROS 等会议审稿人",
    publicVoice: "行业交流",
    yanzhi: "焉知人形机器人大会",
    publicVoiceBody: "受邀发表主旨演讲与直播分享，并接受粉丝近千万的头部具身智能媒体个人专访，持续推动技术路线与产业认知升级。",
    systemTitle: "不只做模型，<br>也搭建让模型持续进化的系统",
    systemNote: "从组织与基础设施出发，打通数据生产、模型研发、评测部署和真实业务交付。",
    system1Title: "多学科团队与研发组织",
    system1Body: "从 0 到 1 搭建近 60 人 团队，形成跨平台、数据、模型、部署和评测的协同机制。",
    system1Item1: "具身平台前后端 · 遥操 · 数采 · 评测",
    system1Item2: "模型工程 · 量化部署 · 感知 · 大模型",
    system2Title: "数据闭环与基础设施",
    system2Body: "建设数据、算力、遥操和数采平台，让高质量机器人数据能够持续生产、治理和回流。",
    system2Item1: "数据平台 · 算力平台 · 基础/超视距遥操",
    system2Item2: "规模化数据增强 · 自动化处理流水线",
    system2Item3: "多类预标模型 · 质量评估与训练回流",
    system3Title: "基础模型与工程交付",
    system3Body: "围绕世界模型与 VLA+WM 形成模型研发主线，并把强化学习、记忆、后训练和推理优化带入完整交付链路。",
    system3Item1: "世界模型 · VLA+WM · 强化学习",
    system3Item2: "Memory · 后训练 · 推理加速优化",
    system3Item3: "从模型训练、量化到真机部署与评测",
    infraTitle: "Infra 体系能力",
    infraNote: "从机器人接入与遥操作，到训推一体平台和实时推理，形成覆盖数据生产、模型迭代与端侧执行的基础设施底座。",
    infraTeleopTitle: "多本体机器人遥操作",
    infraTeleopBody: "面向 Z1、轮臂、Piper、Carm 等多类机器人本体，建立统一遥操作接入、任务执行与数据采集能力。",
    infraPlatformTitle: "训推一体平台",
    infraPlatformBody: "统一管理数据、任务、设备与评测，贯通采集、数据处理、训练、评测和模型部署，支撑数据与模型持续闭环。",
    infraInferenceTitle: "实时推理框架",
    infraInferenceBody: "连接机器人状态、实时执行、动作缓存与控制器，承载多类 VLA/WAM 策略，支持低时延推理与运行日志追踪。",
    flywheelTitle: "每一次执行都沉淀数据资产，每一轮训练都释放新的端侧能力",
    flywheelOrchestration: "具身智能平台统一编排",
    flywheel1Title: "端侧 / 仿真执行",
    flywheel1Body: "产生真实结果",
    flywheel2Title: "数据自动回传",
    flywheel2Body: "结果与 Episode",
    flywheel3Title: "清洗与治理",
    flywheel3Body: "筛选有效样本",
    flywheel4Title: "标注与质检",
    flywheel4Body: "自动化质量门禁",
    flywheel5Title: "导出与训练",
    flywheel5Body: "构建训练数据集",
    flywheel6Title: "模型评测",
    flywheel6Body: "验证能力提升",
    flywheel7Title: "新模型下发",
    flywheel7Body: "进入下一轮执行",
    flywheelInsight1: "失败样本优先回流",
    flywheelInsight2: "全程保留数据与模型血缘",
    flywheelInsight3: "训练完成后一键重新部署",
    flywheelLoop: "持续迭代",
    flywheelLoopPath: "执行 → 数据 → 模型 → 再执行",
    talkKicker: "TECH TALK · 分享交流",
    talkTitle: "具身大模型的技术与实践：模型、数据与基建",
    talkBody: "围绕具身大模型研发与落地，分享模型、数据闭环与基础设施协同迭代的实践思考。",
    talkDownload: "获取原始 PPT",
    impactTitle: "以技术成果、真实交付<br>与代表工作共同验证进展",
    impactNote: "从榜单、真机，到开源项目与完整技术方案，集中呈现可验证的研究与产业成果。",
    resumeMetric: "筛选简历",
    interviewMetric: "面试人次",
    teamMetric: "团队规模",
    roboMetric: "RoboDojo-Sim 榜单",
    molmoMetric: "MolmoSpaces 榜单",
    realRobotMetric: "真机任务成功率",
    roboProof: "查看完整榜单",
    molmoProof: "查看完整榜单",
    realRobotProof: "真机任务验证",
    outcome1Title: "开源成果与榜单验证",
    outcome1Body: "发布 Magic-W0、Toward Real-Time VLAs 等工作，并<strong class=\"inline-emphasis\">在 RoboDojo、MolmoSpaces 等具身模型榜单取得 Top 1</strong>。",
    outcome2Title: "真机效果与展会呈现",
    outcome2Body: "整套能力支持上交会、<strong class=\"inline-emphasis\">WAIC、WRC、IFA</strong>、外滩大会等重要活动展示，并形成近千万元外售订单，验证技术系统的可交付性。",
    shanghaiFair: "上交会",
    inclusionConference: "外滩大会",
    workTitle: "从基础模型到真实机器人",
    magicW0Body: "用统一状态动作接口、结构化世界转移和层对齐交互，将世界预测与连续动作生成放进同一个基础模型。",
    realtimeBody: "把标准 Flow 的 10 步采样压缩到非均匀两步，并以系统级评测连接模型速度与真实双臂执行。",
    brainBody: "让上层 VLM 找目标、分割模型生成三色视觉协议、VLA 执行动作，把语义指令转化为可见引导。",
    memoryBody: "以时序记忆追踪执行状态，以空间检索找回历史视觉证据，让 VLA 处理依赖历史的操作任务。",
    projectPage: "项目主页",
    chineseIntro: "中文介绍",
    papersTitle: "研究论文与技术报告",
    papersNote: "* 表示通讯作者&项目负责人；Under Review 状态按 2026 年 10 月材料整理。",
    demosTitle: "让方法回到真实任务",
    demosNote: "代表性真机演示与 WAIC、WRC、IFA 等展演。",
    foldCloth: "衣服折叠",
    foldBox: "纸箱封包",
    inkRubbing: "年画拓印",
    demoResultLabel: "测试结果",
    demoCapabilityLabel: "任务能力",
    demoDeploymentLabel: "落地关注",
    playVideo: "播放视频",
    demoSourceNote: "现场视频，原倍速",
    foldClothResult: "不同颜色、尺寸衣物成功率 <b>100%</b>，平均执行时间 <b>43.6 秒</b>，可响应中途干扰。",
    foldClothCapability: "完成衣物折叠，可响应执行中干扰；在上交会、WAIC、WRC 以 Zero-Shot 方式部署展示，相关公众号视频获 <b>2k+ 点赞</b>。",
    foldClothDeployment: "柔性操作、干扰后的恢复，以及连续处理所需的人工支持。",
    foldBoxResult: "折叠纸盒与贴短胶带的整体成功率 <b>95.5%</b>，成功案例执行时长 <b>45 秒</b>。",
    foldBoxCapability: "纸箱位置改变或被推倒、胶带拿走后可继续作业；在上交会、WAIC、WRC 展示，贴胶带效果获现场专业人士认可。",
    foldBoxDeployment: "折叠与封贴质量、失败重试，以及供料与成品转运。",
    inkRubbingResult: "基于自采数据训练，成功率 <b>96.3%</b>，平均执行时长 <b>40 秒</b>。",
    inkRubbingCapability: "完成蘸墨、刷墨至拓印，适应初始位置变化与光线干扰；于 WRC、外滩大会现场展示。",
    inkRubbingDeployment: "拓印质量一致性、工具状态变化，以及多轮连续作业稳定性。",
    contactTitle: "关于具身智能、机器人基础模型<br>与研究协作，欢迎交流",
    footerLine: "Embodied AI · 从模型走向真实世界的行动",
    backTop: "返回顶部",
    privacySettings: "访问统计设置",
    privacyKicker: "PRIVACY · 访问统计",
    privacyTitle: "是否允许访问统计？",
    privacySummary: "为改进主页内容并了解资料关注情况，本网站会记录页面访问、交互及相关网络、位置信息。<br><br>数据由 Tao Zhang 管理，仅用于本站访问统计、分析，不用于广告或跨站跟踪，最长保存 2 年。",
    privacyDecline: "不同意",
    privacyAccept: "允许",
    privacyBlockedTitle: "当前无法访问",
    privacyBlockedSummary: "您已选择不同意访问统计，因此当前不能继续访问网页。如需进入，请重新选择。",
    privacyReconsider: "重新选择"
  },
  en: {
    skip: "Skip to content",
    navAbout: "About",
    navSystem: "System",
    navWork: "Impact & work",
    navPapers: "Papers",
    navDemos: "Demos",
    aboutKicker: "PROFILE · ABOUT",
    systemKicker: "SYSTEM · CAPABILITIES",
    workKicker: "IMPACT & WORK · SELECTED WORK",
    papersKicker: "PUBLICATIONS · PAPERS",
    demosKicker: "DEMOS · REAL ROBOT",
    contactKicker: "CONTACT · COLLABORATION",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    sendEmail: "Send email",
    emailContact: "Email",
    themeDark: "Dark",
    themeLight: "Light",
    themeToDark: "Switch to dark mode",
    themeToLight: "Switch to light mode",
    heroName: "Tao Zhang",
    heroLead: "Head of Embodied Models<br>VP of Algorithms, MagicLab",
    viewWork: "View selected work",
    watchInterview: "Watch the VLA world-model interview",
    role: "Current role",
    roleValue: "Head of Embodied Models · VP of Algorithms",
    expertise: "Expertise",
    aboutTitle: "From visual algorithms to embodied AI—<br>moving frontier models into the real world",
    aboutP1: "I earned my PhD at Zhejiang University, then worked on visual algorithms and autonomous driving at Alibaba and NIO. I joined MagicLab in January 2026 and now serve as Head of Embodied Models and VP of Algorithms.",
    aboutP2: "I lead the company’s embodied foundation-model R&D and its supporting technical system across data, platforms, models, evaluation, and deployment—continually advancing the intelligence of real robotic systems.",
    career1Title: "PhD, Zhejiang University",
    career1Body: "Built a rigorous research foundation in vision and intelligent algorithms.",
    career2Title: "Visual Algorithm R&D",
    career2Body: "Developed production-grade visual algorithms and experience in engineering at scale.",
    career3Title: "Autonomous Driving",
    career3Body: "Worked on perception and autonomous-driving technology for complex real-world environments.",
    career4Title: "Head of Embodied Models · Algorithm VP",
    career4Body: "Lead embodied-model R&D, the technical system, and collaboration across a team of nearly 60.",
    recognition: "Academic service & recognition",
    recognitionBody: "Hangzhou High-Level Talent · Shanghai High-Level Talent",
    graduateSupervisor: "External Graduate Supervisor, Zhejiang University",
    reviewerLine: "Reviewer for ICRA / ICLR / IROS and related conferences",
    publicVoice: "Public engagement",
    yanzhi: "Yanzhi Humanoid Robotics Conference",
    publicVoiceBody: "Invited for keynotes and livestreams, and featured in a personal interview by a leading embodied-AI media outlet with nearly ten million followers—helping advance both technical direction and industry understanding.",
    systemTitle: "Beyond models:<br>a system in which they keep improving",
    systemNote: "Start with the organization and infrastructure, then connect data production, model R&D, evaluation, deployment, and delivery.",
    system1Title: "Multidisciplinary team and R&D organization",
    system1Body: "Built a team from zero to nearly 60 people, creating collaboration across platforms, data, models, deployment, and evaluation.",
    system1Item1: "Embodied platform · teleoperation · collection · evaluation",
    system1Item2: "Model engineering · quantization · perception · LLMs",
    system2Title: "Data flywheel and infrastructure",
    system2Body: "Built data, compute, teleoperation, and collection platforms so high-quality robot data can be produced, governed, and fed back continuously.",
    system2Item1: "Data platform · compute platform · standard and remote teleoperation",
    system2Item2: "Data augmentation at scale · automated pipelines",
    system2Item3: "Pre-labeling models · quality evaluation · training feedback",
    system3Title: "Foundation models and engineering delivery",
    system3Body: "Established world models and VLA+WM as the core research line, integrating reinforcement learning, memory, post-training, and inference optimization into delivery.",
    system3Item1: "World models · VLA+WM · reinforcement learning",
    system3Item2: "Memory · post-training · inference acceleration",
    system3Item3: "From model training and quantization to real-robot deployment",
    infraTitle: "Infrastructure stack",
    infraNote: "From robot access and teleoperation to an integrated training–inference platform and real-time inference, the stack connects data production, model iteration, and on-device execution.",
    infraTeleopTitle: "Multi-robot teleoperation",
    infraTeleopBody: "A unified teleoperation, task-execution, and data-collection layer for Z1, wheeled-arm, Piper, Carm, and other robot embodiments.",
    infraPlatformTitle: "Integrated training–inference platform",
    infraPlatformBody: "Centralizes data, tasks, devices, and evaluation while connecting collection, data processing, training, evaluation, and model deployment in a continuous loop.",
    infraInferenceTitle: "Real-time inference framework",
    infraInferenceBody: "Connects robot state, real-time execution, action buffering, and control; supports multiple VLA/WAM policies with low-latency inference and runtime tracing.",
    flywheelTitle: "Every execution becomes a data asset; every training cycle unlocks new on-device capability",
    flywheelOrchestration: "Unified orchestration by the embodied-intelligence platform",
    flywheel1Title: "Edge / simulation execution",
    flywheel1Body: "Produce real outcomes",
    flywheel2Title: "Automatic data return",
    flywheel2Body: "Results and episodes",
    flywheel3Title: "Cleaning and governance",
    flywheel3Body: "Select valid samples",
    flywheel4Title: "Labeling and QA",
    flywheel4Body: "Automated quality gates",
    flywheel5Title: "Export and training",
    flywheel5Body: "Build training datasets",
    flywheel6Title: "Model evaluation",
    flywheel6Body: "Validate capability gains",
    flywheel7Title: "New model delivery",
    flywheel7Body: "Start the next execution cycle",
    flywheelInsight1: "Prioritize failed-sample feedback",
    flywheelInsight2: "Preserve data and model lineage",
    flywheelInsight3: "Redeploy in one step after training",
    flywheelLoop: "Continuous iteration",
    flywheelLoopPath: "Execution → Data → Model → Execution",
    talkKicker: "TECH TALK · KNOWLEDGE SHARING",
    talkTitle: "Embodied Foundation Models: Technology and Practice across Models, Data, and Infrastructure",
    talkBody: "A practical perspective on embodied-foundation-model R&D and deployment, connecting model development, data flywheels, and infrastructure iteration.",
    talkDownload: "Get the original PPT",
    impactTitle: "Progress validated by technical outcomes,<br> real-world delivery, and selected work",
    impactNote: "From leaderboards, real robots, and commercial delivery to open-source projects and complete technical systems, each outcome is presented with verifiable evidence.",
    resumeMetric: "résumés screened",
    interviewMetric: "interviews conducted",
    teamMetric: "team members",
    roboMetric: "RoboDojo-Sim leaderboard",
    molmoMetric: "MolmoSpaces leaderboard",
    realRobotMetric: "real-robot task success",
    roboProof: "View full leaderboard",
    molmoProof: "View full leaderboard",
    realRobotProof: "Physical-task validation",
    outcome1Title: "Open source and benchmark validation",
    outcome1Body: "Released Magic-W0, Toward Real-Time VLAs, and other work, <strong class=\"inline-emphasis\">achieving Top-1 results on embodied-model benchmarks including RoboDojo and MolmoSpaces</strong>.",
    outcome2Title: "Exhibitions and commercial delivery",
    outcome2Body: "The full solution supported demonstrations at the China International Industry Fair, <strong class=\"inline-emphasis\">WAIC, WRC, and IFA</strong>, and the Inclusion Conference on the Bund, and secured nearly RMB 10 million in external orders.",
    shanghaiFair: "CIIF",
    inclusionConference: "Inclusion Conference",
    workTitle: "From foundation models to real robots",
    magicW0Body: "A unified state–action interface, Structured World Transition, and layer-aligned interaction place world prediction and continuous action generation in one foundation model.",
    realtimeBody: "Compress standard ten-step Flow sampling into two non-uniform stages, then evaluate how model speed translates to real bimanual execution.",
    brainBody: "A high-level VLM finds targets, segmentation produces a three-color visual protocol, and the VLA acts—turning semantic instructions into visible guidance.",
    memoryBody: "Temporal memory tracks execution state while spatial retrieval recovers historical visual evidence for history-dependent VLA tasks.",
    projectPage: "Project page",
    chineseIntro: "Chinese article",
    papersTitle: "Research papers and technical reports",
    papersNote: "* denotes corresponding author & project lead. Under-review status reflects the October 2026 source material.",
    demosTitle: "Methods, returned to real tasks",
    demosNote: "Representative real-robot demos and exhibits at WAIC, WRC, and IFA.",
    foldCloth: "Clothes Folding",
    foldBox: "Carton Packing",
    inkRubbing: "New Year Print Rubbing",
    demoResultLabel: "TEST RESULT",
    demoCapabilityLabel: "TASK CAPABILITY",
    demoDeploymentLabel: "DEPLOYMENT FOCUS",
    playVideo: "Play video",
    demoSourceNote: "On-site video · Original speed",
    foldClothResult: "Achieved a <b>100% success rate</b> across garments of different colors and sizes, with an average execution time of <b>43.6 seconds</b> and responsiveness to mid-execution disturbances.",
    foldClothCapability: "Completes clothes folding and responds to execution-time disturbances; deployed zero-shot at CIIF, WAIC, and WRC, with the related WeChat video receiving <b>2K+ likes</b>.",
    foldClothDeployment: "Deformable-object manipulation, recovery after disturbances, and the human support required for continuous operation.",
    foldBoxResult: "Achieved a <b>95.5% overall success rate</b> for carton folding and short-tape application, with successful runs taking <b>45 seconds</b>.",
    foldBoxCapability: "Continues after the carton is repositioned or knocked over, or after the tape is removed; demonstrated at CIIF, WAIC, and WRC, with the taping result recognized by industry professionals.",
    foldBoxDeployment: "Fold-and-seal quality, failure retries, material supply, and finished-product transfer.",
    inkRubbingResult: "Trained on self-collected data, achieving a <b>96.3% success rate</b> with an average execution time of <b>40 seconds</b>.",
    inkRubbingCapability: "Completes ink dipping, brushing, and print rubbing while tolerating initial-position and lighting changes; demonstrated live at WRC and the Inclusion Conference on the Bund.",
    inkRubbingDeployment: "Print-quality consistency, tool-state changes, and stability across repeated continuous operation.",
    contactTitle: "For embodied AI, robot foundation models, <br>and research collaboration—let’s talk",
    footerLine: "Embodied AI · From models to real-world action",
    backTop: "Back to top",
    privacySettings: "Analytics settings",
    privacyKicker: "PRIVACY · VISITOR ANALYTICS",
    privacyTitle: "Allow visitor analytics?",
    privacySummary: "To improve this homepage and understand interest in its content, this site records page visits, interactions, and related network and location information.<br><br>The data is managed by Tao Zhang, used only for this site's visitor statistics and analysis, never for advertising or cross-site tracking, and retained for up to two years.",
    privacyDecline: "Decline",
    privacyAccept: "Allow",
    privacyBlockedTitle: "Access is currently unavailable",
    privacyBlockedSummary: "You declined visitor analytics, so this page cannot currently be accessed. To enter the site, please reconsider your choice.",
    privacyReconsider: "Reconsider"
  }
};

const root = document.documentElement;
const languageToggle = document.querySelector("#language-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeColor = document.querySelector('meta[name="theme-color"]');
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");
const protectedEmail = [28, 28, 30, 31, 24, 29, 24, 21, 109, 87, 71, 88, 3, 72, 73, 88, 3, 78, 67];
const languageStorageKey = "site-language";
const storedLanguage = readStorage(languageStorageKey);
// Prefer an explicit saved choice; first-time and unavailable-storage visits start in Chinese.
let currentLanguage = storedLanguage === "en" || storedLanguage === "zh" ? storedLanguage : "zh";
let currentTheme = root.dataset.theme === "dark" ? "dark" : "light";

function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function decodeEmail() {
  return protectedEmail.map((value) => String.fromCharCode(value ^ 45)).join("");
}

document.querySelectorAll("[data-email-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `mailto:${decodeEmail()}`;
  });
});

const analyticsEndpoint = "https://homepage-analytics-mobile.pages.dev/events";
const analyticsLocationPolicyEndpoint = "https://homepage-analytics-mobile.pages.dev/location-policy";
// Bump this value for every frontend release so D1 records remain attributable.
const analyticsConsentVersion = "v12-regional-location-prompt";
const analyticsConsentKey = "analytics-consent-v2";
const analyticsQueueKey = "analytics-pending-events-v1";
const analyticsVisitorKey = "analytics-visitor-id-v1";
const analyticsQueueLimit = 100;
const privacyConsent = document.querySelector("#privacy-consent");
const privacyAccept = document.querySelector("#privacy-accept");
const privacyDecline = document.querySelector("#privacy-decline");
const privacyReconsider = document.querySelector("#privacy-reconsider");
const privacySettings = document.querySelector("#privacy-settings");
const privacyTitle = document.querySelector("#privacy-title");
const privacySummary = document.querySelector("#privacy-summary");
const accessControlledRegions = document.querySelectorAll("body > header, body > main, body > footer");
let pageViewTracked = false;
let currentLocation = null;
let locationRequestInFlight = null;
let sessionAnalyticsConsent = false;
let analyticsFlushInProgress = false;
let inMemoryAnalyticsQueue = [];
const engagementStartedAt = Date.now();
let visiblePeriodStartedAt = document.visibilityState === "visible" ? performance.now() : null;
let accumulatedActiveDurationMs = 0;
let lastEngagementReportDurationMs = -1;

function createAnalyticsId(prefix) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function getAnalyticsVisitorId() {
  const storedId = readStorage(analyticsVisitorKey);
  if (storedId) return storedId;
  const visitorId = createAnalyticsId("visitor");
  writeStorage(analyticsVisitorKey, visitorId);
  return visitorId;
}

const analyticsSessionId = createAnalyticsId("session");
const analyticsVisitorId = getAnalyticsVisitorId();

function readAnalyticsQueue() {
  try {
    const storedQueue = readStorage(analyticsQueueKey);
    if (!storedQueue) return [...inMemoryAnalyticsQueue];
    const queue = JSON.parse(storedQueue);
    if (!Array.isArray(queue)) return [...inMemoryAnalyticsQueue];
    inMemoryAnalyticsQueue = queue;
    return [...queue];
  } catch {
    return [...inMemoryAnalyticsQueue];
  }
}

function writeAnalyticsQueue(queue) {
  inMemoryAnalyticsQueue = queue.slice(-analyticsQueueLimit);
  writeStorage(analyticsQueueKey, JSON.stringify(inMemoryAnalyticsQueue));
}

function getClientEnvironmentContext() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const navigationEntry = performance.getEntriesByType?.("navigation")?.[0];
  const userAgentData = navigator.userAgentData;
  const urlParameters = new URLSearchParams(window.location.search);
  let clientTimezone = "";
  try {
    clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    clientTimezone = "";
  }
  return {
    client_language: navigator.language || "",
    client_languages: Array.isArray(navigator.languages) ? navigator.languages.slice(0, 10).join(",") : "",
    client_timezone: clientTimezone,
    client_utc_offset_minutes: new Date().getTimezoneOffset(),
    platform: userAgentData?.platform || navigator.platform || "",
    client_hint_brands: Array.isArray(userAgentData?.brands)
      ? userAgentData.brands.slice(0, 10).map((brand) => `${brand.brand}/${brand.version}`).join(",")
      : "",
    client_hint_mobile: typeof userAgentData?.mobile === "boolean" ? userAgentData.mobile : null,
    navigation_type: navigationEntry?.type || "",
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    screen_width: window.screen?.width || null,
    screen_height: window.screen?.height || null,
    screen_color_depth: window.screen?.colorDepth || null,
    device_pixel_ratio: window.devicePixelRatio || 1,
    touch_points: navigator.maxTouchPoints || 0,
    hardware_concurrency: navigator.hardwareConcurrency || null,
    device_memory_gb: navigator.deviceMemory || null,
    screen_orientation: window.screen?.orientation?.type || "",
    preferred_color_scheme: window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    prefers_reduced_motion: Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches),
    cookies_enabled: Boolean(navigator.cookieEnabled),
    browser_online: Boolean(navigator.onLine),
    do_not_track: navigator.doNotTrack || window.doNotTrack || "",
    network_effective_type: connection?.effectiveType || "",
    network_type: connection?.type || "",
    network_downlink_mbps: typeof connection?.downlink === "number" ? connection.downlink : null,
    network_rtt_ms: typeof connection?.rtt === "number" ? connection.rtt : null,
    save_data: Boolean(connection?.saveData),
    utm_source: urlParameters.get("utm_source") || "",
    utm_medium: urlParameters.get("utm_medium") || "",
    utm_campaign: urlParameters.get("utm_campaign") || "",
    utm_content: urlParameters.get("utm_content") || "",
    utm_term: urlParameters.get("utm_term") || ""
  };
}

function enqueueAnalyticsEvent(eventName, context = null) {
  const queue = readAnalyticsQueue();
  // page_stay is a cumulative session snapshot. Keep only the newest pending
  // snapshot so reconnecting after an offline period does not replay many
  // obsolete durations for the same session.
  if (eventName === "page_stay") {
    for (let index = queue.length - 1; index >= 0; index -= 1) {
      if (queue[index]?.event === "page_stay" && queue[index]?.session_id === analyticsSessionId) {
        queue.splice(index, 1);
      }
    }
  }
  queue.push({
    event: eventName,
    event_id: createAnalyticsId("event"),
    visitor_id: analyticsVisitorId,
    session_id: analyticsSessionId,
    client_sent_at: new Date().toISOString(),
    source_page: `${window.location.origin}${window.location.pathname}`,
    referrer: getReferrerOrigin(),
    consent_version: analyticsConsentVersion,
    location: currentLocation,
    context: { ...getClientEnvironmentContext(), ...(context || {}) }
  });
  writeAnalyticsQueue(queue);
}

function getReferrerOrigin() {
  if (!document.referrer) return "";
  try {
    return new URL(document.referrer).origin;
  } catch {
    return "";
  }
}

function hasAnalyticsConsent() {
  return true;
}

function setPageAccess(allowed) {
  accessControlledRegions.forEach((region) => {
    region.inert = !allowed;
    region.setAttribute("aria-hidden", String(!allowed));
  });
}

function setConsentDialog(open, mode = "prompt") {
  root.classList.remove("privacy-pending");
  privacyConsent.hidden = !open;
  document.body.classList.toggle("privacy-dialog-open", open);
  privacyConsent.classList.toggle("privacy-consent--blocked", mode === "blocked");
  privacyAccept.hidden = mode === "blocked";
  privacyDecline.hidden = mode === "blocked";
  privacyReconsider.hidden = mode !== "blocked";
  privacyTitle.innerHTML = translations[currentLanguage][mode === "blocked" ? "privacyBlockedTitle" : "privacyTitle"];
  privacySummary.innerHTML = translations[currentLanguage][mode === "blocked" ? "privacyBlockedSummary" : "privacySummary"];
  setPageAccess(!open);
  if (open) (mode === "blocked" ? privacyReconsider : privacyAccept).focus();
}

async function getLocationPermissionState() {
  if (!("geolocation" in navigator)) return "unsupported";
  if (!navigator.permissions?.query) return "unknown";

  try {
    const permission = await navigator.permissions.query({ name: "geolocation" });
    return permission.state;
  } catch {
    return "unknown";
  }
}

async function shouldPromptForLocationByIp() {
  try {
    const response = await fetch(analyticsLocationPolicyEndpoint, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store"
    });
    if (!response.ok) return false;
    const policy = await response.json();
    return policy.prompt_for_location === true;
  } catch {
    // A policy lookup failure must not block the page or unexpectedly request
    // location. Analytics will continue with server-side IP geolocation.
    return false;
  }
}

function requestCurrentLocation() {
  if (locationRequestInFlight) return locationRequestInFlight;

  locationRequestInFlight = (async () => {
    const permissionState = await getLocationPermissionState();
    if (permissionState === "unsupported" || permissionState === "denied") return null;

    // Existing grants are used silently everywhere. New permission prompts are
    // limited to visitors whose Cloudflare IP location is Shanghai or Jiangsu.
    if (permissionState !== "granted" && !(await shouldPromptForLocationByIp())) return null;

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            captured_at: new Date(position.timestamp).toISOString()
          };
          location.details = await reverseGeocodeLocation(location);
          resolve(location);
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  })();

  locationRequestInFlight.finally(() => {
    locationRequestInFlight = null;
  });
  return locationRequestInFlight;
}

async function requestLocationAndTrack() {
  const location = await requestCurrentLocation();
  if (!location) return false;
  currentLocation = location;
  trackAnalyticsEvent("location_update");
  return true;
}

function selectDistrict(localityData) {
  const administrative = localityData?.localityInfo?.administrative;
  if (Array.isArray(administrative)) {
    const district = [...administrative].reverse().find((item) => {
      const code = typeof item?.chinaAdminCode === "string"
        ? item.chinaAdminCode.replace(/\D/g, "")
        : "";
      return /^\d{6}$/.test(code) && !code.endsWith("00");
    });
    if (district?.name) {
      return {
        name: district.name,
        code: district.chinaAdminCode.replace(/\D/g, "")
      };
    }
  }
  return { name: localityData?.locality || "", code: "" };
}

async function reverseGeocodeLocation(location) {
  try {
    const endpoint = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
    endpoint.searchParams.set("latitude", String(location.latitude));
    endpoint.searchParams.set("longitude", String(location.longitude));
    endpoint.searchParams.set("localityLanguage", "zh");
    const response = await fetch(endpoint, { credentials: "omit", cache: "default" });
    if (!response.ok) return null;
    const data = await response.json();
    const district = selectDistrict(data);
    const municipality = /^(?:北京|上海|天津|重庆)(?:市)?$/u.test(data.principalSubdivision || "");
    return {
      country: data.countryName || "",
      country_code: data.countryCode || "",
      region: data.principalSubdivision || "",
      region_code: data.principalSubdivisionCode || "",
      city: data.city || (municipality ? data.principalSubdivision : data.locality) || "",
      district: district.name,
      district_code: district.code,
      postal_code: data.postcode || "",
      provider: "BigDataCloud",
      lookup_source: data.lookupSource || "reverseGeocoding"
    };
  } catch {
    return null;
  }
}

async function flushAnalyticsQueue() {
  if (analyticsFlushInProgress || !hasAnalyticsConsent()) return;
  analyticsFlushInProgress = true;

  try {
    while (true) {
      const queue = readAnalyticsQueue();
      if (!queue.length) break;

      const pendingEvent = queue[0];
      let delivered = false;
      try {
        const response = await fetch(analyticsEndpoint, {
          method: "POST",
          mode: "cors",
          credentials: "omit",
          keepalive: true,
          cache: "no-store",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify(pendingEvent)
        });
        delivered = response.ok;
      } catch {
        delivered = false;
      }

      if (!delivered) break;
      writeAnalyticsQueue(readAnalyticsQueue().filter((item) => item.event_id !== pendingEvent.event_id));
    }
  } finally {
    analyticsFlushInProgress = false;
  }
}

function trackAnalyticsEvent(eventName, context = null) {
  if (!hasAnalyticsConsent()) return;
  enqueueAnalyticsEvent(eventName, context);
  void flushAnalyticsQueue();
}

function pauseVisibleEngagement() {
  if (visiblePeriodStartedAt === null) return;
  accumulatedActiveDurationMs += Math.max(0, performance.now() - visiblePeriodStartedAt);
  visiblePeriodStartedAt = null;
}

function resumeVisibleEngagement() {
  if (visiblePeriodStartedAt === null) visiblePeriodStartedAt = performance.now();
}

function getActiveDurationMs() {
  const currentVisibleDuration = visiblePeriodStartedAt === null
    ? 0
    : Math.max(0, performance.now() - visiblePeriodStartedAt);
  return Math.round(accumulatedActiveDurationMs + currentVisibleDuration);
}

function reportPageStay(reason) {
  const durationMs = Math.max(0, Date.now() - engagementStartedAt);
  // visibilitychange(hidden) is normally followed immediately by pagehide.
  // Suppress an effectively identical second record.
  if (lastEngagementReportDurationMs >= 0 && durationMs - lastEngagementReportDurationMs < 1000) return;
  lastEngagementReportDurationMs = durationMs;
  trackAnalyticsEvent("page_stay", {
    duration_ms: durationMs,
    active_duration_ms: getActiveDurationMs(),
    interaction_method: reason
  });
}

function sanitizeResourceTarget(anchor) {
  try {
    const url = new URL(anchor.href, window.location.href);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

function classifyResource(anchor) {
  if (!(anchor instanceof HTMLAnchorElement) || !anchor.href) return null;
  const pathname = (() => {
    try { return new URL(anchor.href, window.location.href).pathname.toLowerCase(); }
    catch { return ""; }
  })();
  const extension = pathname.match(/\.([a-z0-9]{2,8})$/)?.[1] || "";
  if (anchor.matches(".talk-download")) return { event: "resource_download_click", type: "pptx" };
  if (anchor.hasAttribute("download") || /^(pdf|ppt|pptx|doc|docx|xls|xlsx|csv|zip|rar|7z)$/.test(extension)) {
    return { event: "resource_download_click", type: extension || "file" };
  }
  if (/^(png|jpe?g|gif|webp|svg|mp4|webm|mov)$/.test(extension)) {
    return { event: "resource_media_open", type: /^(mp4|webm|mov)$/.test(extension) ? "video" : "image" };
  }
  return null;
}

function trackPageView() {
  if (pageViewTracked || !hasAnalyticsConsent()) return;
  pageViewTracked = true;
  trackAnalyticsEvent("page_view");
}

document.addEventListener("click", (event) => {
  const analyticsTarget = event.target.closest("[data-analytics-event]");
  if (analyticsTarget) trackAnalyticsEvent(analyticsTarget.dataset.analyticsEvent);

  const anchor = event.target.closest("a[href]");
  const resource = classifyResource(anchor);
  if (resource) {
    trackAnalyticsEvent(resource.event, {
      resource_type: resource.type,
      resource_target: sanitizeResourceTarget(anchor),
      interaction_method: "click"
    });
  }
}, { capture: true });

document.addEventListener("copy", () => {
  trackAnalyticsEvent("content_copy", {
    selected_text_length: Math.min(window.getSelection()?.toString().length || 0, 1000000),
    interaction_method: "copy"
  });
});

document.addEventListener("contextmenu", (event) => {
  const resource = classifyResource(event.target.closest("a[href]"));
  trackAnalyticsEvent("context_menu_open", {
    resource_type: resource?.type || (event.target.closest("img, video") ? "media" : "page"),
    interaction_method: "contextmenu"
  });
});

window.addEventListener("beforeprint", () => {
  trackAnalyticsEvent("page_print_attempt", { interaction_method: "beforeprint" });
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if ((event.metaKey || event.ctrlKey) && key === "s") {
    trackAnalyticsEvent("page_save_shortcut_attempt", { interaction_method: "keyboard_shortcut" });
  }
  const screenshotShortcut = event.key === "PrintScreen"
    || (event.metaKey && event.shiftKey && ["3", "4", "5"].includes(key))
    || (/Windows/i.test(navigator.userAgent) && event.metaKey && event.shiftKey && key === "s");
  if (screenshotShortcut) {
    trackAnalyticsEvent("screenshot_shortcut_attempt", { interaction_method: "keyboard_shortcut" });
  }
}, { capture: true });

privacyAccept.addEventListener("click", async () => {
  sessionAnalyticsConsent = true;
  writeStorage(analyticsConsentKey, "accepted");
  setConsentDialog(false);
  trackAnalyticsEvent("analytics_consent_accept");
  trackPageView();
  currentLocation = await requestCurrentLocation();
  if (currentLocation) trackAnalyticsEvent("location_update");
});

privacyDecline.addEventListener("click", () => {
  sessionAnalyticsConsent = false;
  writeStorage(analyticsConsentKey, "declined");
  writeAnalyticsQueue([]);
  setConsentDialog(true, "blocked");
});

privacySettings.addEventListener("click", () => setConsentDialog(true));
privacyReconsider.addEventListener("click", () => setConsentDialog(true));

sessionAnalyticsConsent = true;
writeStorage(analyticsConsentKey, "accepted");
setConsentDialog(false);
privacySettings.hidden = true;
trackPageView();
void flushAnalyticsQueue();
// Existing grants are read silently. Visitors geolocated by IP to Shanghai or
// Jiangsu may receive the browser permission prompt; all other unresolved or
// denied states fall back to the server-side IP location path.
void requestLocationAndTrack();

window.addEventListener("online", () => void flushAnalyticsQueue());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    pauseVisibleEngagement();
    reportPageStay("hidden");
    void flushAnalyticsQueue();
  } else {
    resumeVisibleEngagement();
  }
});
window.addEventListener("pagehide", () => {
  pauseVisibleEngagement();
  reportPageStay("pagehide");
  void flushAnalyticsQueue();
});
// Keep an early one-minute safety snapshot so short visits are observable even
// when an embedded/mobile browser omits visibilitychange or pagehide. The
// server compacts these cumulative snapshots to one latest row per session.
window.setInterval(() => reportPageStay("heartbeat"), 60000);

function updateThemeControl() {
  const isDark = currentTheme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", translations[currentLanguage][isDark ? "themeToLight" : "themeToDark"]);
  themeIcon.textContent = isDark ? "☼" : "☾";
  themeLabel.textContent = translations[currentLanguage][isDark ? "themeLight" : "themeDark"];
  themeColor.setAttribute("content", isDark ? "#07111f" : "#f4f7f8");
}

function applyTheme(theme, persist = true) {
  currentTheme = theme === "dark" ? "dark" : "light";
  root.dataset.theme = currentTheme;
  updateThemeControl();
  if (persist) writeStorage("site-theme", currentTheme);
}

function applyLanguage(language, persist = true) {
  currentLanguage = language === "en" ? "en" : "zh";
  const dictionary = translations[currentLanguage];
  root.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const value = dictionary[element.dataset.i18nHtml];
    if (value) element.innerHTML = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.getAttribute("aria-expanded") === "true" ? "closeMenu" : element.dataset.i18nAria;
    const value = dictionary[key];
    if (value) element.setAttribute("aria-label", value);
  });
  if (!privacyConsent.hidden && privacyConsent.classList.contains("privacy-consent--blocked")) {
    privacyTitle.innerHTML = dictionary.privacyBlockedTitle;
    privacySummary.innerHTML = dictionary.privacyBlockedSummary;
  }
  languageToggle.textContent = currentLanguage === "zh" ? "EN" : "中文";
  languageToggle.setAttribute("aria-label", currentLanguage === "zh" ? "Switch to English" : "切换为中文");
  updateThemeControl();
  if (persist) writeStorage(languageStorageKey, currentLanguage);
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-label", translations[currentLanguage].openMenu);
}

themeToggle.addEventListener("click", () => applyTheme(currentTheme === "dark" ? "light" : "dark"));
languageToggle.addEventListener("click", () => applyLanguage(currentLanguage === "zh" ? "en" : "zh"));
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
  menuToggle.setAttribute("aria-label", translations[currentLanguage][isOpen ? "openMenu" : "closeMenu"]);
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
const navigationTargets = Array.from(navigation.querySelectorAll('a[href^="#"]'))
  .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
  .filter(({ section }) => section);

function updateActiveNavigation() {
  const marker = window.scrollY + window.innerHeight * 0.32;
  let activeLink = null;
  navigationTargets.forEach(({ link, section }) => {
    if (section.offsetTop <= marker) activeLink = link;
  });
  navigationTargets.forEach(({ link }) => {
    const isActive = link === activeLink;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

window.addEventListener("scroll", updateActiveNavigation, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 800) closeMenu();
  updateActiveNavigation();
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduceMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

document.querySelector("#year").textContent = new Date().getFullYear();
applyTheme(currentTheme, false);
applyLanguage(currentLanguage, false);
updateActiveNavigation();
