# 魔橋 Online(1–4 人網上對戰)

網址:https://sam0610.github.io/rummikub/online/

## 玩法
1. 一人按「建立房間」,把 4 位代碼和網址傳給朋友(房主要保持頁面開著)。
2. 朋友開啟網址,輸入代碼加入。房主可加入電腦玩家後開始。

連線用 Firebase Realtime Database(匿名登入)中繼,不受 NAT/防火牆影響。房主頁面仍是遊戲的權威,需保持開著。資料庫規則見 `database.rules.json`。

## 智能建議
輪到你時按「智能建議」,由程式直接計算可出的牌和擺法,不使用任何外部 AI 服務,不需要金鑰。

## 開發
原始碼(logic / template / net)在建置流程中合併成單一 `index.html`。
