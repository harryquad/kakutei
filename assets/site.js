// 副業・フリーランスの確定申告サイトのツール一覧（このサイト専用。ほかのサイトとは別管理）
const TOOLS = [
  { path: "/kakutei/", name: "副業の確定申告 必要？判定", desc: "20万円ルールと住民税の申告を、質問に答えるだけで判定" },
  { path: "/kakutei/fukugyo-zei/", name: "副業の税金・手取り 計算", desc: "副業でいくら稼ぐと、税金がいくら増えて手元にいくら残るか" },
  { path: "/kakutei/jigyo-zei/", name: "個人事業主・フリーランスの税金 計算", desc: "所得税・住民税・個人事業税・国保・年金をまとめて計算" },
  { path: "/kakutei/aoiro/", name: "青色申告の節税額 計算", desc: "白色申告と比べて、青色申告でいくら税金が安くなるか" },
  { path: "/kakutei/anbun/", name: "家事按分 計算", desc: "家賃・電気代・通信費のうち、経費にできる金額を計算" },
  { path: "/kakutei/genka/", name: "減価償却 計算", desc: "パソコンや車などの経費を、耐用年数から年ごとに計算" },
  { path: "/kakutei/gensen/", name: "報酬の源泉徴収 計算", desc: "請求書の源泉徴収税額と、手取りからの逆算" },
  { path: "/kakutei/invoice/", name: "消費税 計算（2割特例・3割特例・簡易課税）", desc: "インボイス登録後の消費税を、方法ごとに比べる" },
  { path: "/kakutei/kaigyo/", name: "開業届 出すべき？判定", desc: "開業届と青色申告のメリット・注意点と、提出期限を確認" },
];

const yen = n => Math.round(n).toLocaleString("ja-JP") + "円";

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("related");
  if (!el) return;
  const here = location.pathname.replace(/index\.html$/, "");
  el.innerHTML = `<h2>ほかのツール</h2><ul class="tools">${TOOLS.filter(t => t.path !== here)
    .map(t => `<li><a href="${t.path}"><b>${t.name}</b><span>${t.desc}</span></a></li>`).join("")}</ul>`;
});
