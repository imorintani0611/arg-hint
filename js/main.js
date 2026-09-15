// ===== 提示網站：關鍵字搜尋邏輯 =====
// 支援兩種關鍵字：人名、案件代碼。搜尋不分大小寫、會自動去除頭尾空白。

const HINTS_DB = {
  "劉育豪": [
    {
      title: "卡在「忘記密碼」那邊",
      text: "三個安全問題裡，只有一個問題目前查得到答案，其他兩個沒有線索可查，選那個查得到答案的。答案本身要交叉比對兩篇不同的資訊才拼得出完整日期。"
    },
    {
      title: "遲遲等不到他的下一封信",
      text: "有個工廠的名字一直在案件周邊反覆出現，你調查過那個工廠了嗎？除了工廠本身，前一封坦白信裡的連結、還有幾個案件代碼，都要查過一輪，新的信才會出現。"
    }
  ],
  "永豐機械工廠": [
    {
      title: "跟工廠有關的信件卡住了",
      text: "光是搜到工廠的新聞還不夠。往前想想坦白信裡有兩個可以點的連結，加上跟工廠有關的案件代碼，總共要湊齊好幾個地方都查過，信才會出現。"
    }
  ],
  "蘇": [
    {
      title: "傳訊息完全沒有回應",
      text: "這個對話要先滿足兩個條件才會理你：一個跟你在某封信裡選擇的回覆方式有關，另一個跟你有沒有拿到更高的系統權限有關。兩個都要達成才會有回應。"
    },
    {
      title: "第一題答不出來（車牌號碼）",
      text: "有個地方的照片裡藏著車牌號碼，要自己放大看清楚，答案不是用文字寫出來的。"
    },
    {
      title: "第二題答不出來（同車的人是誰）",
      text: "去找找看跟這起事故的當事人有關的社群帳號，裡面有一篇貼文預設是看不到的，換一種排序方式就會跑出來。"
    },
    {
      title: "第三題答不出來（那個人的身分）",
      text: "找到名字之後，拿這個名字去搜尋看看，會找到一則相關新聞，可以確認這個人過去真正的職位。"
    }
  ],
  "陳文昌": [
    {
      title: "想知道這個名字是怎麼查到的",
      text: "去找找看跟事故當事人有關的社群帳號，裡面有一篇貼文預設是看不到的，換一種排序方式就會跑出來。留言裡也可能藏著能認出這個名字的線索。"
    }
  ],
  "沈國樑": [
    {
      title: "找不到署級系統的入口",
      text: "有個帳號如果拿去一般系統登入，會顯示已經停用，訊息裡應該會提示你接下來該去哪裡。"
    },
    {
      title: "找到入口了，但卡在登入",
      text: "帳號是他的警員編號，去查查看跟人事異動有關的文件。密碼則是某次對話裡有人親口告訴過你邏輯——是對他來說意義重大的一個日期。"
    }
  ],
  "TR04092020": [
    {
      title: "這組代碼要怎麼用",
      text: "這是劉育豪自己的調職紀錄。回信的時候要選代表「繼續查下去」的那句話，搭配這組代碼一起送出。"
    }
  ],
  "TR10092020": [
    {
      title: "這組代碼是什麼",
      text: "這是另一個人的調職紀錄，不是劉育豪本人的。如果要選「繼續查下去」，要搭配的代碼不是這一組。"
    }
  ],
  "TA18062014": [
    {
      title: "查得到案件，但內容打不開",
      text: "這個案子的附件是鎖住的，需要先取得更高的系統權限，才能看到裡面的東西。"
    }
  ]
};

// 別名 -> 共用同一組提示
const ALIASES = {
  "前妻": "蘇",
  "永豐": "永豐機械工廠",
  "永豐工廠": "永豐機械工廠",
  "永豐機械": "永豐機械工廠"
};

function normalizeKey(input) {
  return input.trim();
}

function lookupHints(rawInput) {
  const key = normalizeKey(rawInput);
  if (!key) return null;

  // 先試試看原字串、別名、大寫（案件代碼常見大寫格式）
  const candidates = [key, ALIASES[key], key.toUpperCase(), ALIASES[key.toUpperCase()]];
  for (const c of candidates) {
    if (c && HINTS_DB[c]) return HINTS_DB[c];
  }
  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("hintSearchInput");
  const btn = document.getElementById("hintSearchBtn");
  const results = document.getElementById("hintResults");
  if (!input || !btn || !results) return;

  function runSearch() {
    const hints = lookupHints(input.value);
    if (!hints) {
      results.innerHTML = `<p class="no-result">查無「${input.value.trim()}」相關的提示，確認一下是不是打錯字，或者這個關鍵字可能還沒遇到。</p>`;
      return;
    }
    results.innerHTML = hints.map(h => `
      <div class="hint-card">
        <p class="hint-card-title">${h.title}</p>
        <p class="hint-card-text">${h.text}</p>
      </div>
    `).join("");
  }

  btn.addEventListener("click", runSearch);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
});
