// ===== 提示網站：搜尋 → 列出問題 → 點進去逐步顯示提示 =====
// 這個檔案是純邏輯，不用改；要改內容請編輯 hints-data.js

function normalizeKey(input) {
  return input.trim();
}

function lookupEntries(rawInput) {
  const key = normalizeKey(rawInput);
  if (!key) return null;

  const candidates = [key, ALIASES[key], key.toUpperCase(), ALIASES[key.toUpperCase()]];
  for (const c of candidates) {
    if (c && HINTS_DB[c]) return HINTS_DB[c];
  }
  return null;
}

// 把 \n 換成 <br>，讓提示可以換行
function toHtml(text) {
  return text.replace(/\n/g, "<br>");
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("hintSearchInput");
  const btn = document.getElementById("hintSearchBtn");
  const results = document.getElementById("hintResults");
  if (!input || !btn || !results) return;

  function renderQuestion(entry, idx) {
    const wrap = document.createElement("div");
    wrap.className = "q-item";

    const head = document.createElement("button");
    head.className = "q-head";
    head.textContent = entry.question;

    const body = document.createElement("div");
    body.className = "q-body";
    body.style.display = "none";

    let shown = 0;

    const revealBtn = document.createElement("button");
    revealBtn.className = "q-reveal-btn";

    function updateRevealBtn() {
      if (shown >= entry.hints.length) {
        revealBtn.style.display = "none";
      } else {
        revealBtn.textContent = shown === 0 ? "顯示提示 1" : `顯示提示 ${shown + 1}`;
      }
    }

    function revealNext() {
      if (shown >= entry.hints.length) return;
      const h = document.createElement("div");
      h.className = "q-hint";
      h.innerHTML = `<p class="q-hint-label">提示 ${shown + 1}</p><p class="q-hint-text">${toHtml(entry.hints[shown])}</p>`;
      body.insertBefore(h, revealBtn);
      shown++;
      updateRevealBtn();
    }

    revealBtn.addEventListener("click", revealNext);
    body.appendChild(revealBtn);
    updateRevealBtn();

    head.addEventListener("click", () => {
      const open = body.style.display !== "none";
      body.style.display = open ? "none" : "";
      wrap.classList.toggle("open", !open);
    });

    wrap.appendChild(head);
    wrap.appendChild(body);
    return wrap;
  }

  function runSearch() {
    const entries = lookupEntries(input.value);
    results.innerHTML = "";
    if (!entries) {
      results.innerHTML = `<p class="no-result">查無「${input.value.trim()}」相關的提示，確認一下是不是打錯字，或者這個關鍵字可能還沒遇到。</p>`;
      return;
    }
    entries.forEach((entry, idx) => {
      results.appendChild(renderQuestion(entry, idx));
    });
  }

  btn.addEventListener("click", runSearch);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
});
