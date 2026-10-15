# 魔橋 Online(1–4 人網上對戰)

網址:https://sam0610.github.io/rummikub/online/

## 玩法
1. 一人按「建立房間」,把 4 位代碼和網址傳給朋友(房主要保持頁面開著)。
2. 朋友開啟網址,輸入代碼加入。房主可加入電腦玩家後開始。

連線用 WebRTC(PeerJS)點對點,不需要自己的伺服器。沒有 TURN 中繼,少數嚴格防火牆/行動網路可能連不上。

## 智能建議的 Gemini AI
- 在遊戲內「AI 設定」貼上自己的 Gemini API 金鑰;金鑰只存在該瀏覽器的 localStorage,**不會**進到這個 repo。
- 預設模型 `gemini-3-flash-preview`,失敗時退回 `gemini-2.5-flash`,也可自訂。
- 建議到 Google AI Studio 把金鑰的「網站限制(HTTP referrer)」設為 `https://sam0610.github.io/*`。
- 沒有金鑰仍可使用智能建議,只是沒有 AI 口語說明。

## 開發
原始碼(logic / template / net)在建置流程中合併成單一 `index.html`。
