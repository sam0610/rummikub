# 魔橋助手

Rummikub(魔橋)計分同回合計時的手機網頁,單一 `index.html`,冇 build、冇 server。

- 計分:2 至 6 位玩家可自訂姓名。每局先揀贏家(固定 0 點),輸家直接打餘牌點數,或者逐塊揀剩低嘅牌(1 至 13、Joker 30 點)自動計總數。
- 計時:每回合 30 / 60 / 90 / 120 秒倒數,最後 5 秒有提示音,記每位累計用時。
- 資料只存在使用者瀏覽器的 localStorage。

## GitHub Pages

Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`。
網址:`https://sam0610.github.io/rummikub/moqiao/`

本機試:直接用瀏覽器開 `index.html`。
