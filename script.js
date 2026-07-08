// ==========================
// 推し録 v1.0
// ==========================

const screens = {
    home: document.getElementById("home-screen"),
    add: document.getElementById("add-screen"),
    history: document.getElementById("history-screen"),
    stats: document.getElementById("stats-screen")
};

// タブ
document.getElementById("home-btn").addEventListener("click", () => showScreen("home"));
document.getElementById("add-btn").addEventListener("click", () => showScreen("add"));

function showScreen(screen) {

    Object.values(screens).forEach(s => s.style.display = "none");

    screens[screen].style.display = "block";

}

// 初期表示
showScreen("home");

// ==========================
// 保存
// ==========================

document
.getElementById("save-btn")
.addEventListener("click", saveLive);

function saveLive(){

    const live={

        date:getValue("event-date"),

        group:getValue("group-name"),

        event:getValue("event-name"),

        venue:getValue("venue-name"),

        member:getValue("member-name"),

        cheki:Number(
            getValue("cheki-count-input") || 0
        ),

        setlist:getValue("setlist"),

        memo:getValue("memo"),

        createdAt:Date.now()

    };

    if(
        !live.group ||
        !live.event
    ){

        alert("グループとイベント名は入力してね😊");
        return;

    }

    const lives=loadLives();

    lives.push(live);

    saveLives(lives);

    clearForm();

    updateHome();

    showScreen("home");

    alert("💖 思い出を追加しました！");

}

// ==========================
// Home更新
// ==========================

function updateHome(){

    const lives=loadLives();

    document.getElementById("live-count").textContent=lives.length;

    const totalCheki=lives.reduce(
        (sum,live)=>sum+live.cheki,
        0
    );

    document.getElementById("cheki-count").textContent=totalCheki;

    const next=document.getElementById("next-live");

    if(lives.length===0){

        next.textContent="まだ登録されていません";

        return;

    }

    const latest=lives[lives.length-1];

    next.innerHTML=`

        <strong>${latest.group}</strong><br>

        ${latest.event}<br>

        📍 ${latest.venue || "-"}

    `;

}

// ==========================
// LocalStorage
// ==========================

function loadLives(){

    return JSON.parse(
        localStorage.getItem("lives") || "[]"
    );

}

function saveLives(data){

    localStorage.setItem(
        "lives",
        JSON.stringify(data)
    );

}

// ==========================
// Utility
// ==========================

function getValue(id){

    return document
        .getElementById(id)
        .value
        .trim();

}

function clearForm(){

    [
        "event-date",
        "group-name",
        "event-name",
        "venue-name",
        "member-name",
        "cheki-count-input",
        "setlist",
        "memo"
    ].forEach(id=>{

        document.getElementById(id).value="";

    });

}

// 初回表示
updateHome();