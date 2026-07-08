const homeScreen = document.getElementById("home-screen");
const addScreen = document.getElementById("add-screen");

const homeBtn = document.getElementById("home-btn");
const addBtn = document.getElementById("add-btn");

homeBtn.addEventListener("click", () => {
    homeScreen.style.display = "block";
    addScreen.style.display = "none";
});

addBtn.addEventListener("click", () => {
    homeScreen.style.display = "none";
    addScreen.style.display = "block";
});

// 保存ボタン
document.getElementById("save-btn").addEventListener("click", () => {

    const eventName = document.getElementById("event-name").value;
    const groupName = document.getElementById("group-name").value;
    const memberName = document.getElementById("member-name").value;

    if (!eventName || !groupName || !memberName) {
        alert("全部入力してね😊");
        return;
    }

    const live = {
        eventName,
        groupName,
        memberName,
        createdAt: new Date().toISOString()
    };

    // 今まで保存したデータ
    const lives = JSON.parse(localStorage.getItem("lives") || "[]");

    // 追加
    lives.push(live);

    // 保存
    localStorage.setItem("lives", JSON.stringify(lives));

    alert("保存したよ🎉");

    // 入力欄クリア
    document.getElementById("event-name").value = "";
    document.getElementById("group-name").value = "";
    document.getElementById("member-name").value = "";

    // ホームへ戻る
    homeBtn.click();

});