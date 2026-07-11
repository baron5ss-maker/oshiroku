// ============================
// 推し録 v0.8
// Home
// ============================

const STORAGE_KEY = "oshiroku_memories";

const sampleData = [
    {
        title: "夏染",
        group: "MAGICAL SPEC",
        date: "2026-07-20",
        place: "幕張公園",
        cheki: 4,
        memo: "AIKAと夏祭りトーク😊"
    },
    {
        title: "定期公演",
        group: "MAGICAL SPEC",
        date: "2026-06-30",
        place: "Zepp Haneda",
        cheki: 2,
        memo: "最前列！"
    }
];

init();

function init(){

    if(!localStorage.getItem(STORAGE_KEY)){
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(sampleData)
        );
    }

    loadHome();

}

function loadHome(){

    const memories = getMemories();

    updateStats(memories);

    updateNextEvent(memories);

    updateRecent(memories);

}

function getMemories(){

    return JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];

}

function updateStats(memories){

    document.getElementById("live-count").textContent =
        memories.length;

    const totalCheki =
        memories.reduce(
            (sum,m)=>sum + Number(m.cheki),
            0
        );

    document.getElementById("cheki-count").textContent =
        totalCheki;

}

function updateNextEvent(memories){

    if(memories.length===0) return;

    const next = memories[0];

    document.getElementById("event-name").textContent =
        next.title;

    document.getElementById("group-name").textContent =
        next.group;

    document.getElementById("event-date").textContent =
        formatDate(next.date);

    document.getElementById("event-place").textContent =
        next.place;

    updateCountdown(next.date);

}

function updateCountdown(date){

    const today = new Date();

    const target = new Date(date);

    const diff =
        Math.ceil(
            (target - today)
            /
            (1000*60*60*24)
        );

    document.getElementById("countdown").textContent =
        "あと " + diff + " 日";

}

function updateRecent(memories){

    const area =
        document.getElementById("recent-list");

    area.innerHTML = "";

    memories
        .slice(0,5)
        .forEach(memory=>{

            const card =
                document.createElement("div");

            card.className =
                "recent-card";

            card.innerHTML = `
                <div class="recent-photo"></div>

                <div>

                    <h4>${memory.title}</h4>

                    <p>${memory.group}</p>

                    <small>${formatDate(memory.date)}</small>

                </div>
            `;

            area.appendChild(card);

        });

}

function formatDate(date){

    const d =
        new Date(date);

    return d.toLocaleDateString(
        "ja-JP",
        {
            year:"numeric",
            month:"short",
            day:"numeric"
        }
    );

}