import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("/Users/qiu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");

const ROOT = process.cwd();
const ASSETS = path.join(ROOT, "assets");
const OUT = path.join(ROOT, "posters");

fs.mkdirSync(OUT, { recursive: true });

const W = 1080;
const H = 1920;

const dataUri = (file) => {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
};

const mascot = dataUri(path.join(ASSETS, "mascot-cutout-user.png"));
const logo = dataUri(path.join(ASSETS, "logo-mascot.png"));
const team = dataUri(path.join(ASSETS, "team.jpg"));

const font = `"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", Arial, sans-serif`;

const text = (content, x, y, size, fill = "#2a170f", weight = 700, extra = "") =>
  `<text x="${x}" y="${y}" font-family='${font}' font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${content}</text>`;

const lines = (items, x, y, size, fill = "#2a170f", weight = 700, gap = 1.35, extra = "") =>
  items.map((item, index) => text(item, x, y + index * size * gap, size, fill, weight, extra)).join("\n");

const roundedCard = (x, y, width, height, fill, stroke = "none", radius = 38, opacity = 1) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" opacity="${opacity}"/>`;

const qrPlaceholder = (x, y, size, variant = "red") => {
  const color = variant === "blue" ? "#1676e8" : variant === "dark" ? "#7d210e" : "#e9341f";
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${size}" height="${size}" rx="28" fill="#fffdf5" stroke="${color}" stroke-width="6" stroke-dasharray="18 12"/>
      <rect x="34" y="34" width="54" height="54" rx="8" fill="none" stroke="${color}" stroke-width="9"/>
      <rect x="${size - 88}" y="34" width="54" height="54" rx="8" fill="none" stroke="${color}" stroke-width="9"/>
      <rect x="34" y="${size - 88}" width="54" height="54" rx="8" fill="none" stroke="${color}" stroke-width="9"/>
      <text x="${size / 2}" y="${size / 2 - 10}" text-anchor="middle" font-family='${font}' font-size="42" fill="${color}" font-weight="900">二维码</text>
      <text x="${size / 2}" y="${size / 2 + 44}" text-anchor="middle" font-family='${font}' font-size="28" fill="#8b5844" font-weight="800">放这里</text>
    </g>`;
};

const shell = (body, defs = "") => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#6c1d08" flood-opacity="0.22"/>
    </filter>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#55180a" flood-opacity="0.18"/>
    </filter>
    ${defs}
  </defs>
  ${body}
</svg>`;

const posterOne = shell(`
  <rect width="${W}" height="${H}" fill="#e9341f"/>
  <path d="M0 0 H1080 V1920 H0 Z" fill="url(#p1bg)"/>
  <path d="M-80 760 C180 510 370 420 640 390 C890 365 1030 275 1160 120 V1920 H-80 Z" fill="#ff8a25" opacity="0.56"/>
  <path d="M0 1470 C220 1390 415 1450 620 1350 C805 1260 940 1200 1080 1240 V1920 H0 Z" fill="#fff1c4" opacity="0.22"/>

  <g transform="translate(74 72)">
    <rect width="98" height="98" rx="26" fill="#fff7e4"/>
    <image href="${logo}" x="10" y="10" width="78" height="78" preserveAspectRatio="xMidYMid meet"/>
    ${text("利民巧匠", 122, 42, 38, "#fff7df", 1000)}
    ${text("靠谱的生活服务", 122, 86, 26, "#ffe7a4", 800)}
  </g>

  <rect x="74" y="230" width="368" height="74" rx="37" fill="#ffef9a"/>
  ${text("销售派单员 / 城市负责人", 110, 279, 31, "#b52612", 1000)}
  ${text("搞钱号角", 74, 430, 92, "#fff8d8", 1000)}
  ${text("吹响", 74, 530, 92, "#fff8d8", 1000)}
  ${lines(["平台来单，你来判断、匹配、跟进", "不用上门维修，负责订单调度成交"], 78, 610, 34, "#fff", 900, 1.45)}

  <g filter="url(#shadow)">
    <image href="${mascot}" x="420" y="520" width="610" height="820" preserveAspectRatio="xMidYMid meet"/>
  </g>

  <g filter="url(#softShadow)">
    <rect x="74" y="760" width="280" height="104" rx="34" fill="#fff2b5"/>
    ${text("底薪 5K+", 116, 826, 42, "#c51f10", 1000)}
    <rect x="74" y="900" width="280" height="104" rx="34" fill="#fff2b5"/>
    ${text("高提成", 130, 966, 42, "#c51f10", 1000)}
  </g>

  <g filter="url(#shadow)">
    <rect x="72" y="1210" width="936" height="262" rx="46" fill="#fff8ed" opacity="0.94"/>
    ${text("核心工作", 118, 1282, 34, "#e9341f", 1000)}
    ${lines(["看订单类型 / 地区 / 服务时间", "匹配当地合适维修师傅", "跟进客户和结果，成交拿提成"], 118, 1348, 38, "#2a170f", 900, 1.45)}
  </g>

  <g transform="translate(74 1510)">
    ${qrPlaceholder(0, 0, 250, "red")}
    ${text("扫码查看岗位详情", 292, 72, 44, "#fff8d8", 1000)}
    ${text("动态招聘网页 · 立即报名", 292, 132, 32, "#ffe8a5", 800)}
    ${text("电话：150 7979 9923", 292, 194, 34, "#ffffff", 1000)}
  </g>
`, `
  <linearGradient id="p1bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#b7100a"/>
    <stop offset="0.36" stop-color="#f0431f"/>
    <stop offset="1" stop-color="#ffb64b"/>
  </linearGradient>
`);

const posterTwo = shell(`
  <rect width="${W}" height="${H}" fill="#0e8df2"/>
  <path d="M0 0 H1080 V1920 H0 Z" fill="url(#p2bg)"/>
  <path d="M0 610 C170 520 330 600 520 510 C720 410 890 320 1080 355 V0 H0 Z" fill="#dff6ff" opacity="0.4"/>
  <path d="M-120 1480 C180 1320 360 1420 590 1290 C820 1160 940 1110 1180 1160 V1920 H-120 Z" fill="#bdf8ef" opacity="0.45"/>

  <g transform="translate(70 64)">
    <rect width="92" height="92" rx="24" fill="#ffffff"/>
    <image href="${logo}" x="8" y="8" width="76" height="76" preserveAspectRatio="xMidYMid meet"/>
    ${text("利民巧匠招聘", 116, 44, 36, "#ffffff", 1000)}
    ${text("大平台 · 透明晋升 · 准时发薪", 116, 86, 25, "#e8fbff", 800)}
  </g>

  ${text("打工人逆袭", 72, 268, 86, "#ffffff", 1000)}
  ${text("从这里起飞", 72, 366, 86, "#fff27a", 1000)}

  <g filter="url(#shadow)">
    <image href="${mascot}" x="518" y="280" width="510" height="700" preserveAspectRatio="xMidYMid meet"/>
  </g>

  <g transform="translate(72 462)" filter="url(#softShadow)">
    <rect width="470" height="86" rx="26" fill="#ffffff" opacity="0.94"/>
    ${text("平台订单主动找上门", 34, 56, 34, "#1168c9", 1000)}
    <rect y="116" width="470" height="86" rx="26" fill="#ffffff" opacity="0.94"/>
    ${text("老员工带飞，快速上手", 34, 172, 34, "#1168c9", 1000)}
    <rect y="232" width="470" height="86" rx="26" fill="#ffffff" opacity="0.94"/>
    ${text("能力说话，拒绝论资排辈", 34, 288, 34, "#1168c9", 1000)}
  </g>

  <g filter="url(#shadow)">
    ${roundedCard(72, 965, 936, 458, "#ffffff", "none", 48, 0.96)}
    ${text("岗位怎么做", 126, 1048, 42, "#0d68c7", 1000)}
    <line x1="146" y1="1138" x2="900" y2="1138" stroke="#bde6ff" stroke-width="8" stroke-linecap="round"/>
    <circle cx="170" cy="1138" r="28" fill="#1676e8"/>
    <circle cx="410" cy="1138" r="28" fill="#1676e8"/>
    <circle cx="650" cy="1138" r="28" fill="#1676e8"/>
    <circle cx="890" cy="1138" r="28" fill="#1676e8"/>
    ${text("来单", 132, 1204, 31, "#2a170f", 900)}
    ${text("判断", 372, 1204, 31, "#2a170f", 900)}
    ${text("派单", 612, 1204, 31, "#2a170f", 900)}
    ${text("跟进", 852, 1204, 31, "#2a170f", 900)}
    ${lines(["根据订单类型、地区和服务时间，匹配当地合适师傅。", "师傅上门安装、维修、处理售后，你负责推进结果。"], 126, 1304, 32, "#4a4a4a", 800, 1.55)}
  </g>

  <g transform="translate(72 1488)">
    ${text("招业务员 / 派单员", 0, 0, 44, "#ffffff", 1000)}
    ${text("有销售经验、目标感强、能抗压优先", 0, 58, 30, "#e8fbff", 800)}
    ${qrPlaceholder(664, -24, 250, "blue")}
    ${text("扫码看动态网页", 0, 154, 42, "#fff27a", 1000)}
    ${text("留下信息，直接开聊", 0, 210, 31, "#ffffff", 900)}
  </g>
`, `
  <linearGradient id="p2bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#0864d9"/>
    <stop offset="0.48" stop-color="#18a8ff"/>
    <stop offset="1" stop-color="#7df4cc"/>
  </linearGradient>
`);

const posterThree = shell(`
  <rect width="${W}" height="${H}" fill="#fff4dc"/>
  <path d="M0 0 H1080 V1920 H0 Z" fill="url(#p3bg)"/>
  <clipPath id="teamClip"><rect x="70" y="108" width="940" height="470" rx="48"/></clipPath>
  <image href="${team}" x="70" y="108" width="940" height="470" preserveAspectRatio="xMidYMid slice" clip-path="url(#teamClip)" opacity="0.9"/>
  <rect x="70" y="108" width="940" height="470" rx="48" fill="url(#teamShade)"/>

  <g transform="translate(104 154)">
    <rect width="92" height="92" rx="24" fill="#fff7e8"/>
    <image href="${logo}" x="8" y="8" width="76" height="76" preserveAspectRatio="xMidYMid meet"/>
    ${text("利民巧匠", 116, 44, 38, "#fff8e5", 1000)}
    ${text("靠谱的生活服务", 116, 88, 26, "#ffe6a1", 800)}
  </g>

  ${text("百人同行", 104, 420, 76, "#fff8e5", 1000)}
  ${text("订单不断", 104, 512, 76, "#ffd86b", 1000)}

  <g filter="url(#shadow)">
    <image href="${mascot}" x="555" y="460" width="430" height="610" preserveAspectRatio="xMidYMid meet"/>
  </g>

  <g filter="url(#shadow)">
    ${roundedCard(70, 655, 940, 455, "#fffaf0", "none", 48, 0.96)}
    ${text("为什么值得来", 124, 738, 42, "#d83a17", 1000)}
    <rect x="124" y="800" width="360" height="78" rx="24" fill="#ffe3a4"/>
    ${text("200+ 城市覆盖", 158, 852, 34, "#8c2a12", 1000)}
    <rect x="124" y="906" width="360" height="78" rx="24" fill="#ffe3a4"/>
    ${text("600+ 服务项目", 158, 958, 34, "#8c2a12", 1000)}
    <rect x="538" y="800" width="360" height="78" rx="24" fill="#ffe3a4"/>
    ${text("底薪 5K 起", 584, 852, 34, "#8c2a12", 1000)}
    <rect x="538" y="906" width="360" height="78" rx="24" fill="#ffe3a4"/>
    ${text("提成上不封顶", 584, 958, 34, "#8c2a12", 1000)}
    ${text("销售派单员 / 城市负责人", 124, 1050, 36, "#2a170f", 1000)}
  </g>

  <g filter="url(#shadow)">
    ${roundedCard(70, 1168, 940, 280, "#fffaf0", "none", 48, 0.96)}
    ${text("福利氛围", 124, 1248, 42, "#d83a17", 1000)}
    ${lines(["饮料补给 · 节日礼品 · 生日红包", "小组聚餐 · 团队建设 · 年会奖励", "能力优秀、业绩突出者，每月有奖金激励"], 124, 1322, 34, "#503327", 850, 1.45)}
  </g>

  <g transform="translate(72 1526)">
    ${qrPlaceholder(0, 0, 256, "dark")}
    ${text("扫码进入招聘网页", 306, 74, 46, "#7d210e", 1000)}
    ${text("看岗位详情 / 工作内容 / 报名入口", 306, 134, 30, "#735044", 800)}
    ${text("150 7979 9923", 306, 212, 42, "#e9341f", 1000)}
  </g>
`, `
  <linearGradient id="p3bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff4dc"/>
    <stop offset="0.52" stop-color="#ffbd6a"/>
    <stop offset="1" stop-color="#e33b1c"/>
  </linearGradient>
  <linearGradient id="teamShade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#5f160c" stop-opacity="0.2"/>
    <stop offset="0.55" stop-color="#ad220f" stop-opacity="0.22"/>
    <stop offset="1" stop-color="#75190d" stop-opacity="0.76"/>
  </linearGradient>
`);

const posters = [
  ["poster-01-red-money.png", posterOne],
  ["poster-02-blue-growth.png", posterTwo],
  ["poster-03-team-trust.png", posterThree],
];

for (const [name, svg] of posters) {
  const file = path.join(OUT, name);
  await sharp(Buffer.from(svg)).png().toFile(file);
  console.log(file);
}
