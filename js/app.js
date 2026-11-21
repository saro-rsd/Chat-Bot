const apiKey = CONFIG.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

const rightSection = document.getElementById("right-section");
const chats = document.getElementById("chats");
const userInput = document.getElementById("user-input");
const send = document.getElementById("send-btn");
const voice = document.getElementById("voice-btn");
const newChat = document.getElementById("chat-btn");
const welcomeSection = document.getElementById("welcome-section");
const suggestions = document.getElementById("suggestions");
const botNameBtn = document.getElementById("name-btn");
const theme = document.getElementById("theme-btn-id");
const lng = document.getElementById("change-lng");

let history = [];
const suggestionsCards = [
    {
        "Learn common sinhala phrases": "Share a quick guide with common everyday Sinhala conversational phrases and their English translations. Open with a brief 1-sentence tip on Sinhala greetings in under two short paragraphs, and end by asking me what scenario I want phrases for."
    },
    {
        "Design a phone wallpaper for me": "Design a phone wallpaper for me"
    },
    {
        "Find healthy dinner reciepes": "Provide five dinner recipes that take under 30 minutes, use fewer than 10 ingredients, and are toddler approved. Include nutritional highlights for each meal, focusing on protein and hidden vegetables."
    },
    {
        "About Software engineering": "About software engineering."
    },
    {
        "Recommend Sri Lankan dishes": "Highlight popular traditional dishes to try when exploring Sri Lankan cuisine. Open with a brief description of key regional flavors in under two paragraphs, and end by asking me if I prefer vegetarian or seafood options.    "
    }
];

let tempSuggestionCards = [...suggestionsCards];

//Add Message function

function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = "msg " + who;
    div.textContent = text;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
    return div;
}


//API connect function

async function askChat() {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ contents: history })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error?.message || `Server Error: ${res.status}`);
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No responsive received!";

    } catch (error) {
        throw new Error(error.message || "Request failed");
    }
}

//Send Message function

async function sendMessage(message = "") {
    const cleanMessage = typeof message === "string" ? message.trim() : "";
    const text = cleanMessage || userInput.value.trim();

    if (text === "") return;

    welcomeSection.classList.add("hidden");
    rightSection.classList.add("chat-started");
    suggestions.classList.add("hidden");
    addMessage(text, "user");
    history.push({ role: "user", parts: [{ text: text }] });
    // addToHistory(text);
    userInput.value = "";
    autoResizeTextArea();
    toggleButtons();

    const typing = addMessage("...", "bot");
    typing.classList.add("typing");
    typing.innerHTML = "<span></span><span></span><span></span>";

    try {
        const reply = await askChat();
        typing.classList.remove("typing");
        typing.textContent = reply;
        history.push({ role: "model", parts: [{ text: reply }] });
    } catch (error) {
        typing.classList.remove("typing");
        typing.textContent = "Error: " + error.message;
        history.pop();
    }

    chats.scrollTop = chats.scrollHeight;
}

send.addEventListener("click", () => sendMessage());

//Enter button scence for User Input

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

userInput.addEventListener("input", () => {
    suggestions.classList.add("hidden");
    toggleButtons();
    autoResizeTextArea();
});


botNameBtn.addEventListener("click", () => {
    newChat.click();
});

//New Chat button function

newChat.addEventListener("click", () => {
    welcomeSection.classList.remove("hidden");
    rightSection.classList.remove("chat-started");
    suggestions.classList.remove("hidden");
    chats.innerHTML = "";
    history = [];
    userInput.value = "";
    toggleButtons();
    tempSuggestionCards = [...suggestionsCards];
    loadSuggestions();
});

//Send button toggle

function toggleButtons() {
    const hasText = userInput.value.trim() !== "";
    send.classList.toggle("hidden", !hasText);
}

toggleButtons();

//Change theme & apply theme

theme.addEventListener("click", () => {
    const now = document.documentElement.getAttribute("data-theme");
    applyTheme(now === "dark" ? "light" : "dark");
});

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

applyTheme(localStorage.getItem("theme") || "dark");


//Change language & set language

const moreOption = document.getElementById("more-opton");
const headerBtns = document.querySelector(".header-btns-container");

moreOption.addEventListener("click", () => {
    headerBtns?.classList.toggle("hidden");
});



const langbtn = document.getElementById("languages");
let isCreated = false;

lng.addEventListener("click", () => {
    if (!isCreated) {
        setLanguages();
        changeLanguage();
        isCreated = true;
    }

    if (langbtn.style.display === "flex") {
        langbtn.style.display = "none";
    } else {
        langbtn.style.display = "flex";
    }

});

function setLanguages() {
    const languages = [
        { name: "English", id: "english" },
        { name: "Sinhala", id: "sinhala" },
        { name: "Tamil", id: "tamil" }
    ];

    languages.forEach(lang => {
        const btn = document.createElement("button");
        btn.classList.add("lan-btn");
        btn.id = lang.id;
        btn.textContent = lang.name;
        langbtn.appendChild(btn);
    });
}

function changeLanguage() {
    const english = document.getElementById("english");
    const sinhala = document.getElementById("sinhala");
    const tamil = document.getElementById("tamil");

    english.addEventListener("click", () => {
        document.querySelector(".new-chat-txt").textContent = "New Chat";
        document.querySelector(".welcome-txt").textContent = "Welcome buddy, where should we start ?";
        langbtn.style.display = "none";
    });

    sinhala.addEventListener("click", () => {
        document.querySelector(".new-chat-txt").textContent = "නව සංවාදය";
        document.querySelector(".welcome-txt").textContent = "සාදරයෙන් පිළිගන්නවා යාළුවා, අපි කොහෙන්ද පටන් ගන්න ඕන?";
        langbtn.style.display = "none";
    });

    tamil.addEventListener("click", () => {
        document.querySelector(".new-chat-txt").textContent = "புதிய உரையாடல்";
        document.querySelector(".welcome-txt").textContent = "வரவேற்கிறேன் நண்பா, நாம் எங்கிருந்து தொடங்கலாம்?";
        langbtn.style.display = "none";
    });
}

//Voice button function - get voice and send response

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;

voice.addEventListener("click", () => {
    if (!recognition) {
        alert("This browser do not support voice");
        return;
    }
    if (listening) {
        recognition.stop();
    } else {
        recognition.start();
    }
});

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
        listening = true;
        voice.classList.add("listening");
    };

    recognition.onend = () => {
        listening = false;
        voice.classList.remove("listening");
    };

    recognition.onresult = (event) => {
        let text = "";
        for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
        }
        userInput.value = text;
        toggleButtons();

        if (event.results[0].isFinal) {
            sendMessage();
        }
    };

    recognition.onerror = (event) => {
        console.log("Voice error:", event.error);
    };
}

//Side panel - open & close

const closeSideBarBtn = document.getElementById("close-sidebar");
const leftSection = document.getElementById("left-section");
const openSideBarBtn = document.getElementById("chat-bot-icon");

if (closeSideBarBtn && leftSection) {
    closeSideBarBtn.addEventListener("click", () => {
        leftSection.classList.toggle("closed");
    });
}

if (openSideBarBtn && leftSection) {
    openSideBarBtn.addEventListener("click", () => {
        leftSection.classList.remove("closed");
    });
}


//Load Suggestion cards

function loadSuggestions() {
    if (!suggestionsCards) return;

    const visibleCards = tempSuggestionCards.slice(0, 3);
    suggestions.innerHTML = "";

    visibleCards.forEach((suggestCard, index) => {
        const containerDiv = document.createElement("div");
        const containerButton = document.createElement("button");
        const closeButton = document.createElement("button");
        const closeIcon = document.createElement("i");
        closeIcon.setAttribute("data-lucide", "letter-x");

        containerDiv.classList.add("suggestion-card");
        containerButton.classList.add("suggestion-card-btn");
        closeButton.classList.add("close-btn");
        closeIcon.classList.add("icon-close");

        const key = Object.keys(suggestCard)[0];
        containerButton.textContent = key;

        containerButton.addEventListener("click", () => {
            const text = Object.values(suggestCard)[0];
            sendMessage(text);
            toggleButtons();
        });

        closeButton.addEventListener("click", () => {
            tempSuggestionCards.splice(index, 1);
            loadSuggestions();
        });

        closeButton.appendChild(closeIcon);
        containerDiv.appendChild(containerButton);
        containerDiv.appendChild(closeButton);
        suggestions.appendChild(containerDiv);
    });

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

loadSuggestions();

//Auto Resize text area function

function autoResizeTextArea() {
    if (!userInput) return;

    const maxHeight = 160;
    userInput.style.height = "auto";
    userInput.style.height = Math.min(userInput.scrollHeight, maxHeight) + "px";
    userInput.style.overflowY = userInput.scrollHeight > maxHeight ? "auto" : "hidden";
}

autoResizeTextArea();


//History button function

const historyButton = document.getElementById("history-button");
const historyContainer = document.getElementById("history-chats");

if (historyButton && historyContainer) {
    historyButton.addEventListener("click", () => {
        const isHidden = historyContainer.classList.toggle("hidden");
        const historyIcon = document.querySelector(".history-icon");
        if (historyIcon) {
            historyIcon.classList.toggle("rotated", !isHidden);
        }
    });
}

//History chats function

// function addToHistory(promptText) {
//     if (!promptText || !historyContainer) return;

//     const historyChatList = document.createElement("button");
//     historyChatList.classList.add("history-chats");

//     const historyChatListIcon = document.createElement("i");
//     historyChatListIcon.setAttribute("data-lucide", "arrow-right");
//     historyChatListIcon.classList.add("history-array-icon");

//     const historyLabel = document.createElement("span");
//     // historyLabel.className.add();

//     historyLabel.textContent = promptText;

//     historyChatList.append(historyChatListIcon, historyLabel);
//     historyContainer.appendChild(historyChatList);

//     if (typeof lucide !== "undefined") {
//         lucide.createIcons();
//     }

// }