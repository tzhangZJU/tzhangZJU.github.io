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
    themeDark: "夜间",
    themeLight: "日间",
    themeToDark: "切换至深色模式",
    themeToLight: "切换至浅色模式",
    heroName: "张涛",
    heroLead: "魔法原子具身模型负责人<br>算法 VP",
    heroSummary: "博士毕业于浙江大学，先后在阿里巴巴、蔚来汽车从事视觉算法研发与自动驾驶工作；现负责具身智能大模型研发及相关技术体系建设。",
    viewWork: "查看代表工作",
    watchInterview: "观看 VLA 世界模型访谈",
    role: "当前角色",
    roleValue: "魔法原子具身模型负责人 · 算法 VP",
    expertise: "核心方向",
    contact: "联系方式",
    aboutTitle: "从视觉算法到具身智能，<br>让前沿模型走进真实世界",
    aboutP1: "博士毕业于浙江大学，先后在阿里巴巴、蔚来汽车从事视觉算法研发与自动驾驶工作。2016 年 1 月加入魔法原子，现任具身模型负责人、算法 VP。",
    aboutP2: "负责公司具身智能大模型研发及相关技术体系建设，覆盖团队、数据、平台、模型、评测和部署，持续推动机器人智能系统能力升级。",
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
    reviewerLine: "ICRA / ICLR / IROS 等会议审稿人",
    publicVoice: "行业交流",
    yanzhi: "焉知人形机器人大会",
    publicVoiceBody: "受邀发表主旨演讲与直播分享，并接受粉丝近千万的头部具身智能媒体个人专访，持续推动技术路线与产业认知升级。",
    systemTitle: "不只做模型，<br>也搭建让模型持续进化的系统",
    systemNote: "从组织与基础设施出发，打通数据生产、模型研发、评测部署和真实业务交付。",
    system1Title: "多学科团队与研发组织",
    system1Body: "从 0 到 1 搭建近 60 人 Magic-Lab 团队，形成跨平台、数据、模型、部署和评测的协同机制。",
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
    impactTitle: "以技术成果、真实交付<br>与代表工作共同验证进展",
    impactNote: "从榜单、真机与商业交付，到开源项目与完整技术方案，集中呈现可验证的研究与产业成果。",
    resumeMetric: "筛选简历",
    interviewMetric: "面试人次",
    teamMetric: "团队规模",
    roboMetric: "RoboDojo-Sim 榜单",
    molmoMetric: "MolmoSpaces 榜单",
    realRobotMetric: "真机任务成功率",
    orderMetric: "解决方案外售订单",
    outcome1Title: "开源成果与榜单验证",
    outcome1Body: "发布 Magic-W0、Toward Real-Time VLAs 等工作，并<strong class=\"inline-emphasis\">在 RoboDojo、MolmoSpaces 等具身模型榜单取得 Top 1</strong>。",
    outcome2Title: "展会呈现与商业落地",
    outcome2Body: "整套能力支持上交会、<strong class=\"inline-emphasis\">WAIC、WRC、IFA</strong>、外滩大会等重要活动展示，并形成近千万元外售订单，验证技术系统的可交付性。",
    shanghaiFair: "上交会",
    inclusionConference: "外滩大会",
    workTitle: "从基础模型到真实机器人",
    workNote: "以下项目均可进入团队主页查看完整技术说明、实验与演示。",
    magicW0Body: "用统一状态动作接口、结构化世界转移和层对齐交互，将世界预测与连续动作生成放进同一个基础模型。",
    realtimeBody: "把标准 Flow 的 10 步采样压缩到非均匀两步，并以系统级评测连接模型速度与真实双臂执行。",
    brainBody: "让上层 VLM 找目标、分割模型生成三色视觉协议、VLA 执行动作，把语义指令转化为可见引导。",
    memoryBody: "以时序记忆追踪执行状态，以空间检索找回历史视觉证据，让 VLA 处理依赖历史的操作任务。",
    projectPage: "项目主页",
    chineseIntro: "中文介绍",
    papersTitle: "研究论文与技术报告",
    papersNote: "* 表示通讯作者&项目负责人；Under Review 状态按 2026 年 10 月材料整理。",
    demosTitle: "让方法回到真实任务",
    demosNote: "代表性真机演示与 WAIC、WRC、IFA 等活动展示。",
    foldCloth: "叠衣服",
    foldBox: "叠纸盒",
    inkRubbing: "拓印",
    contactTitle: "关于具身智能、机器人基础模型<br>与研究协作，欢迎交流",
    footerLine: "Embodied AI · 从模型走向真实世界的行动",
    backTop: "返回顶部"
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
    themeDark: "Dark",
    themeLight: "Light",
    themeToDark: "Switch to dark mode",
    themeToLight: "Switch to light mode",
    heroName: "Tao Zhang",
    heroLead: "Head of Embodied Models<br>VP of Algorithms, MagicLab",
    heroSummary: "I hold a PhD from Zhejiang University and previously worked on visual algorithms and autonomous driving at Alibaba and NIO. I now lead embodied foundation-model R&D and the supporting technical system at MagicLab.",
    viewWork: "View selected work",
    watchInterview: "Watch the VLA world-model interview",
    role: "Current role",
    roleValue: "Head of Embodied Models · VP of Algorithms",
    expertise: "Expertise",
    contact: "Contact",
    aboutTitle: "From visual algorithms to embodied AI—<br>moving frontier models into the real world",
    aboutP1: "I earned my PhD at Zhejiang University, then worked on visual algorithms and autonomous driving at Alibaba and NIO. I joined MagicLab in January 2016 and now serve as Head of Embodied Models and VP of Algorithms.",
    aboutP2: "I lead the company’s embodied foundation-model R&D and its supporting technical system across team building, data, platforms, models, evaluation, and deployment—continually advancing the intelligence of real robotic systems.",
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
    reviewerLine: "Reviewer for ICRA / ICLR / IROS and related conferences",
    publicVoice: "Public engagement",
    yanzhi: "Yanzhi Humanoid Robotics Conference",
    publicVoiceBody: "Invited for keynotes and livestreams, and featured in a personal interview by a leading embodied-AI media outlet with nearly ten million followers—helping advance both technical direction and industry understanding.",
    systemTitle: "Beyond models:<br>a system in which they keep improving",
    systemNote: "Start with the organization and infrastructure, then connect data production, model R&D, evaluation, deployment, and delivery.",
    system1Title: "Multidisciplinary team and R&D organization",
    system1Body: "Built Magic-Lab from zero to nearly 60 people, creating collaboration across platforms, data, models, deployment, and evaluation.",
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
    impactTitle: "Progress validated by technical outcomes,<br> real-world delivery, and selected work",
    impactNote: "From leaderboards, real robots, and commercial delivery to open-source projects and complete technical systems, each outcome is presented with verifiable evidence.",
    resumeMetric: "résumés screened",
    interviewMetric: "interviews conducted",
    teamMetric: "team members",
    roboMetric: "RoboDojo-Sim leaderboard",
    molmoMetric: "MolmoSpaces leaderboard",
    realRobotMetric: "real-robot task success",
    orderMetric: "external solution orders",
    outcome1Title: "Open source and benchmark validation",
    outcome1Body: "Released Magic-W0, Toward Real-Time VLAs, and other work, <strong class=\"inline-emphasis\">achieving Top-1 results on embodied-model benchmarks including RoboDojo and MolmoSpaces</strong>.",
    outcome2Title: "Exhibitions and commercial delivery",
    outcome2Body: "The full solution supported demonstrations at the China International Industry Fair, <strong class=\"inline-emphasis\">WAIC, WRC, and IFA</strong>, and the Inclusion Conference on the Bund, and secured nearly RMB 10 million in external orders.",
    shanghaiFair: "CIIF",
    inclusionConference: "Inclusion Conference",
    workTitle: "From foundation models to real robots",
    workNote: "Open each project on the team site for full methods, experiments, and demos.",
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
    foldCloth: "Clothes folding",
    foldBox: "Box folding",
    inkRubbing: "Ink rubbing",
    contactTitle: "For embodied AI, robot foundation models,<br>and research collaboration—let’s talk",
    footerLine: "Embodied AI · From models to real-world action",
    backTop: "Back to top"
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
let currentLanguage = localStorage.getItem("site-language") === "en" ? "en" : "zh";
let currentTheme = root.dataset.theme === "dark" ? "dark" : "light";

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
  if (persist) localStorage.setItem("site-theme", currentTheme);
}

function applyLanguage(language) {
  currentLanguage = language;
  const dictionary = translations[language];
  root.lang = language === "zh" ? "zh-CN" : "en";
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
  languageToggle.textContent = language === "zh" ? "EN" : "中文";
  languageToggle.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换为中文");
  localStorage.setItem("site-language", language);
  updateThemeControl();
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
window.addEventListener("resize", () => {
  if (window.innerWidth > 800) closeMenu();
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
applyLanguage(currentLanguage);
