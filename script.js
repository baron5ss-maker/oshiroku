// =====================================
// 推し録 v1.0
// Part1
// =====================================

const STORAGE_KEY = "oshiroku_memories";

const screens = {

    home: document.getElementById("home-screen"),

    add: document.getElementById("add-screen"),

    history: document.getElementById("history-screen"),

    member: document.getElementById("member-screen"),

    settings: document.getElementById("settings-screen")

};

const navButtons = {

    home: document.getElementById("home-btn"),

    add: document.getElementById("add-btn"),

    history: document.getElementById("history-btn"),

    member: document.getElementById("member-btn"),

    settings: document.getElementById("settings-btn")

};

init();

function init(){

    bindNavigation();

    updateHome();

}

function bindNavigation(){

    navButtons.home.onclick = ()=>showScreen("home");

    navButtons.add.onclick = ()=>showScreen("add");

    navButtons.history.onclick = ()=>{

        showScreen("history");

        renderHistory();

    };

    navButtons.member.onclick = ()=>{

        showScreen("member");

        renderMember();

    };

    navButtons.settings.onclick = ()=>{

        showScreen("settings");

    };

}

function showScreen(name){

    Object.values(screens).forEach(screen=>{

        screen.classList.remove("active");

    });

    Object.values(navButtons).forEach(btn=>{

        btn.classList.remove("active");

    });

    screens[name].classList.add("active");

    if(navButtons[name]){

        navButtons[name].classList.add("active");

    }

}

function getMemories(){

    return JSON.parse(

        localStorage.getItem(STORAGE_KEY)

        ||

        "[]"

    );

}

function saveMemories(data){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}
// =====================================
// 保存
// =====================================

document

.getElementById("save-btn")

.addEventListener(

    "click",

    saveMemory

);

function saveMemory(){

    const memory={

        date:getValue("event-date"),

        title:getValue("event-name"),

        group:getValue("group-name"),

        member:getValue("member-name"),

        place:getValue("venue-name"),

        cheki:Number(

            getValue("cheki-count-input") || 0

        ),

        setlist:getValue("setlist"),

        memo:getValue("memo"),

        createdAt:Date.now()

    };

    if(

        !memory.date ||

        !memory.title ||

        !memory.group

    ){

        alert(

            "日付・イベント名・グループは入力してね😊"

        );

        return;

    }

    const memories=getMemories();

    memories.push(memory);

    memories.sort(

        (a,b)=>

        new Date(a.date)-new Date(b.date)

    );

    saveMemories(memories);

    clearForm();

    updateHome();

    showToast("💖 思い出を保存しました！");

    showScreen("home");

}

// =====================================
// Home
// =====================================

function updateHome(){

    const memories=getMemories();

    updateStats(memories);

    updateNextEvent(memories);

    renderRecent(memories);

}

function updateStats(memories){

    document.getElementById(

        "live-count"

    ).textContent=

        memories.length;

    const totalCheki=

        memories.reduce(

            (sum,m)=>

                sum+

                Number(m.cheki),

            0

        );

    document.getElementById(

        "cheki-count"

    ).textContent=

        totalCheki;

}

function updateNextEvent(memories){

    if(

        memories.length===0

    ){

        return;

    }

    const future=

        [...memories]

        .filter(

            m=>

            new Date(m.date)>=new Date()

        )

        .sort(

            (a,b)=>

            new Date(a.date)-

            new Date(b.date)

        );

    const target=

        future[0]

        ||

        memories[memories.length-1];

    document.getElementById(

        "next-event-name"

    ).textContent=

        target.title;

    document.getElementById(

        "next-group"

    ).textContent=

        target.group;

    document.getElementById(

        "next-date"

    ).textContent=

        formatDate(

            target.date

        );

    document.getElementById(

        "next-place"

    ).textContent=

        target.place;

    updateCountdown(

        target.date

    );

}

function updateCountdown(date){

    const today=

        new Date();

    const target=

        new Date(date);

    const diff=

        Math.ceil(

            (target-today)

            /

            (1000*60*60*24)

        );

    document.getElementById(

        "countdown"

    ).textContent=

        diff>=0

        ?

        `あと${diff}日`

        :

        "開催済み";

}

// =====================================
// Recent Memories
// =====================================

function renderRecent(memories){

    const list=

        document.getElementById(

            "recent-list"

        );

    list.innerHTML="";

    const recent=

        [...memories]

        .sort(

            (a,b)=>

                b.createdAt-a.createdAt

        )

        .slice(0,5);

    recent.forEach(memory=>{

        const card=

            document.createElement("div");

        card.className=

            "recent-card";

        card.innerHTML=`

            <div class="recent-image"></div>

            <div class="recent-body">

                <div class="recent-title">

                    ${memory.title}

                </div>

                <div class="recent-sub">

                    ${memory.group}

                </div>

                <div class="recent-sub">

                    ${formatDate(memory.date)}

                </div>

            </div>

        `;

        list.appendChild(card);

    });

}

// =====================================
// History
// =====================================

function renderHistory(){

    const list=

        document.getElementById(

            "history-list"

        );

    list.innerHTML="";

    const memories=

        [...getMemories()]

        .sort(

            (a,b)=>

                new Date(b.date)-

                new Date(a.date)

        );

    memories.forEach(memory=>{

        const card=

            document.createElement("div");

        card.className=

            "history-card";

        card.innerHTML=`

            <div class="history-top">

                <div>

                    <div class="history-group">

                        ${memory.group}

                    </div>

                    <div class="history-date">

                        ${formatDate(memory.date)}

                    </div>

                </div>

            </div>

            <div class="history-title">

                ${memory.title}

            </div>

            <div class="history-footer">

                <span>

                    📍 ${memory.place}

                </span>

                <span>

                    📸 ${memory.cheki}枚

                </span>

            </div>

        `;

        list.appendChild(card);

    });

}

// =====================================
// Member
// =====================================

function renderMember(){

    const memories=

        getMemories();

    if(memories.length===0){

        return;

    }

    const latest=

        memories[memories.length-1];

    document.getElementById(

        "member-profile-name"

    ).textContent=

        latest.member || "未設定";

    document.getElementById(

        "member-profile-group"

    ).textContent=

        latest.group;

    document.getElementById(

        "member-live-count"

    ).textContent=

        memories.length;

    document.getElementById(

        "member-cheki-count"

    ).textContent=

        memories.reduce(

            (sum,m)=>

                sum+

                Number(m.cheki),

            0

        );

    document.getElementById(

        "member-photo-count"

    ).textContent=

        0;

    document.getElementById(

        "first-live-date"

    ).textContent=

        formatDate(

            memories[0].date

        );

    document.getElementById(

        "last-live-date"

    ).textContent=

        formatDate(

            latest.date

        );

}

// =====================================
// Utility
// =====================================

function getValue(id){

    return document

        .getElementById(id)

        .value

        .trim();

}

function clearForm(){

    [

        "event-date",

        "event-name",

        "group-name",

        "member-name",

        "venue-name",

        "cheki-count-input",

        "setlist",

        "memo"

    ].forEach(id=>{

        const element=

            document.getElementById(id);

        if(element){

            element.value="";

        }

    });

}

function formatDate(date){

    if(!date){

        return "-";

    }

    return new Date(date)

        .toLocaleDateString(

            "ja-JP",

            {

                year:"numeric",

                month:"short",

                day:"numeric"

            }

        );

}

// =====================================
// Toast
// =====================================

function showToast(message){

    const toast=

        document.getElementById("toast");

    toast.textContent=

        message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

// =====================================
// Calendar
// （v1.0 仮実装）
// =====================================

document

.getElementById("calendar-button")

?.addEventListener(

    "click",

    ()=>{

        showToast(

            "📅 カレンダー連携は近日追加予定！"

        );

    }

);

// =====================================
// First Load
// =====================================

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        showScreen("home");

        updateHome();

    }

);

// =====================================
// History List
// =====================================

const historySearch =
    document.getElementById("history-search");

const historySort =
    document.getElementById("history-sort");

historySearch?.addEventListener(

    "input",

    renderHistory

);

historySort?.addEventListener(

    "change",

    renderHistory

);

function renderHistory(){

    const list =
        document.getElementById("history-list");

    list.innerHTML = "";

    let memories = [...getMemories()];

    // -----------------------
    // 検索
    // -----------------------

    const keyword =
        historySearch.value
        .trim()
        .toLowerCase();

    if(keyword){

        memories =
            memories.filter(memory=>{

                return (

                    memory.title
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    memory.group
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    memory.member
                    .toLowerCase()
                    .includes(keyword)

                );

            });

    }

    // -----------------------
    // 並び替え
    // -----------------------

    switch(historySort.value){

        case "old":

            memories.sort(

                (a,b)=>

                new Date(a.date)
                -
                new Date(b.date)

            );

            break;

        case "cheki":

            memories.sort(

                (a,b)=>

                b.cheki-a.cheki

            );

            break;

        default:

            memories.sort(

                (a,b)=>

                new Date(b.date)
                -
                new Date(a.date)

            );

    }

    // -----------------------
    // 描画
    // -----------------------

    memories.forEach((memory,index)=>{

        const card =
            document.createElement("div");

        card.className =
            "history-card";

        card.dataset.index =
            index;

        card.innerHTML = `

            <h3>

                ${memory.title}

            </h3>

            <p>

                💖 ${memory.group}

            </p>

            <p>

                👤 ${memory.member}

            </p>

            <p>

                📅 ${formatDate(memory.date)}

            </p>

            <div class="history-footer">

                <span>

                    📸 ${memory.cheki}枚

                </span>

                <span>

                    ＞

                </span>

            </div>

        `;

        card.addEventListener(

            "click",

            ()=>{

                openDetail(memory);

            }

        );

        list.appendChild(card);

    });

}
// =====================================
// Detail Modal
// =====================================

let selectedMemory = null;

const detailModal =
    document.getElementById("detail-modal");

document
    .getElementById("close-detail")
    ?.addEventListener(

        "click",

        closeDetail

    );

function openDetail(memory){

    selectedMemory = memory;

    document.getElementById(

        "detail-title"

    ).textContent =

        memory.title;

    document.getElementById(

        "detail-group"

    ).textContent =

        "💖 " + memory.group;

    document.getElementById(

        "detail-date"

    ).textContent =

        "📅 " + formatDate(memory.date);

    document.getElementById(

        "detail-place"

    ).textContent =

        "📍 " + memory.place;

    document.getElementById(

        "detail-setlist"

    ).textContent =

        memory.setlist ||

        "未登録";

    document.getElementById(

        "detail-memo"

    ).textContent =

        memory.memo ||

        "メモはありません";

    detailModal.classList.remove(

        "hidden"

    );

}

function closeDetail(){

    detailModal.classList.add(

        "hidden"

    );

}

detailModal?.addEventListener(

    "click",

    e=>{

        if(

            e.target === detailModal

        ){

            closeDetail();

        }

    }

);
// =====================================
// Delete
// =====================================

document

.getElementById("delete-memory")

.addEventListener(

    "click",

    deleteMemory

);

function deleteMemory(){

    if(!selectedMemory){

        return;

    }

    const ok=

        confirm(

            "この思い出を削除しますか？"

        );

    if(!ok){

        return;

    }

    const memories=

        getMemories();

    const index=

        memories.findIndex(

            memory=>

                memory.createdAt===selectedMemory.createdAt

        );

    if(index!==-1){

        memories.splice(

            index,

            1

        );

        saveMemories(

            memories

        );

    }

    closeDetail();

    updateHome();

    renderHistory();

    renderMember();

    showToast(

        "🗑 思い出を削除しました"

    );

}

// =====================================
// Edit
// =====================================

document

.getElementById("edit-memory")

.addEventListener(

    "click",

    editMemory

);

function editMemory(){

    if(!selectedMemory){

        return;

    }

    showScreen("add");

    document.getElementById(

        "event-date"

    ).value=

        selectedMemory.date;

    document.getElementById(

        "event-name"

    ).value=

        selectedMemory.title;

    document.getElementById(

        "group-name"

    ).value=

        selectedMemory.group;

    document.getElementById(

        "member-name"

    ).value=

        selectedMemory.member;

    document.getElementById(

        "venue-name"

    ).value=

        selectedMemory.place;

    document.getElementById(

        "cheki-count-input"

    ).value=

        selectedMemory.cheki;

    document.getElementById(

        "setlist"

    ).value=

        selectedMemory.setlist;

    document.getElementById(

        "memo"

    ).value=

        selectedMemory.memo;

    deleteMemoryWithoutToast();

    closeDetail();

}

function deleteMemoryWithoutToast(){

    const memories=

        getMemories();

    const index=

        memories.findIndex(

            memory=>

                memory.createdAt===selectedMemory.createdAt

        );

    if(index!==-1){

        memories.splice(

            index,

            1

        );

        saveMemories(

            memories

        );

    }

}
// =====================================
// History Empty State
// =====================================

function renderHistory(){

    const list =
        document.getElementById("history-list");

    list.innerHTML = "";

    let memories = [...getMemories()];

    const keyword =
        historySearch.value
        .trim()
        .toLowerCase();

    if(keyword){

        memories = memories.filter(memory=>{

            return (

                memory.title.toLowerCase().includes(keyword)

                ||

                memory.group.toLowerCase().includes(keyword)

                ||

                memory.member.toLowerCase().includes(keyword)

            );

        });

    }

    switch(historySort.value){

        case "old":

            memories.sort(

                (a,b)=>

                new Date(a.date)-new Date(b.date)

            );

            break;

        case "cheki":

            memories.sort(

                (a,b)=>

                b.cheki-a.cheki

            );

            break;

        default:

            memories.sort(

                (a,b)=>

                new Date(b.date)-new Date(a.date)

            );

    }

    // -------------------------
    // Empty State
    // -------------------------

    if(memories.length===0){

        list.innerHTML=`

            <div class="card empty-card">

                <h2>

                    📭

                </h2>

                <h3>

                    思い出がありません

                </h3>

                <p>

                    ライブを登録すると
                    ここに表示されます😊

                </p>

            </div>

        `;

        return;

    }

    memories.forEach(memory=>{

        const card =
            document.createElement("div");

        card.className="history-card";

        card.innerHTML=`

            <h3>${memory.title}</h3>

            <p>💖 ${memory.group}</p>

            <p>👤 ${memory.member}</p>

            <p>📅 ${formatDate(memory.date)}</p>

            <div class="history-footer">

                <span>

                    📸 ${memory.cheki}枚

                </span>

                <span>

                    ＞

                </span>

            </div>

        `;

        card.onclick=()=>{

            openDetail(memory);

        };

        list.appendChild(card);

    });

}

// =====================================
// Refresh
// =====================================

function refreshApp(){

    updateHome();

    renderHistory();

    renderMember();

}

// =====================================
// Initial Render
// =====================================

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        refreshApp();

    }

);
function openDetail(memory){

    alert(memory.title);

}
