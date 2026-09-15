// ===== 提示網站互動邏輯 =====
document.addEventListener("DOMContentLoaded", () => {

  const picker = document.getElementById("diagPicker");
  const flows = document.querySelectorAll(".diag-flow");
  const intro = document.getElementById("diagIntro");

  // 選擇卡點分類 -> 顯示對應流程
  document.querySelectorAll(".diag-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const flowId = btn.dataset.flow;
      picker.style.display = "none";
      intro.style.display = "none";
      document.getElementById(flowId).classList.add("active");
    });
  });

  // 每個流程裡的「返回」按鈕
  document.querySelectorAll(".diag-back").forEach(btn => {
    btn.addEventListener("click", () => {
      flows.forEach(f => f.classList.remove("active"));
      // 同時把這個流程內已經展開的提示跟子問題都收起來，下次重新點還原成初始狀態
      const flow = btn.closest(".diag-flow");
      flow.querySelectorAll(".diag-hint").forEach(h => h.classList.remove("active"));
      flow.querySelectorAll(".diag-substep").forEach(s => s.style.display = "none");
      flow.querySelectorAll(".diag-step1").forEach(s => s.style.display = "");
      picker.style.display = "grid";
      intro.style.display = "block";
    });
  });

  // 選項按鈕：顯示對應提示，或進到下一層子問題
  document.querySelectorAll(".diag-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const showHint = btn.dataset.hint;
      const showStep = btn.dataset.next;
      const hideStep = btn.dataset.hide;

      if (showHint) {
        document.getElementById(showHint).classList.add("active");
      }
      if (hideStep) {
        document.getElementById(hideStep).style.display = "none";
      }
      if (showStep) {
        document.getElementById(showStep).style.display = "";
      }
    });
  });

});
