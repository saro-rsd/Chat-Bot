const apiKey = CONFIG.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

const rightSection = document.getElementById("right-section");
const chats = document.getElementById("chats");
const userInput = document.getElementById("user-input");
const send = document.getElementById("send-btn");
const voice = document.getElementById("voice-btn");
const newChat = document.getElementById("chat-btn");
const welcomeSection = document.getElementById("welcome-section");
const suggestions = document.getElementById("suggesions");
const botNameBtn = document.getElementById("name-btn");

let history = [];

function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = "msg " + who;
    div.textContent = text;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
    return div;
}

async function askChat() {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({contents:history})
        });

        const data = await res.json();
        console.log(data);
        return data.candidate?.[0]?.content?.parts?.[0]?.text;

    } catch (error) {
        throw new Error(data.error?.message || "Request failed");
    }
}

async function sendMessage() {
    const text = document.getElementById("user-input").value.trim();
    if (text === "") return;

    welcomeSection.classList.add("hidden");
    rightSection.classList.add("chat-started");
    suggestions.classList.add("hidden");
    addMessage(text, "user");
    history.push({ role: "user", parts: [{ text: text }] });
    userInput.value = "";
    toggleButtons();

    const typing = addMessage("...", "bot");
    typing.classList.add("typing");
    typing.innerHTML="<span></span><span></span><span></span>";

    try {
        const reply = await askChat(text);
        typing.classList.remove("typing");
        typing.textContent = reply;
        history.push({ role: "user", parts: [{ text: text }] });
    } catch (error) {
        typing.textContent = "Error: " + error.message;
        history.pop();
    }

    chats.scrollTop = chats.scrollHeight;
}

send.addEventListener("click", () => sendMessage());

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

userInput.addEventListener("input", toggleButtons);
botNameBtn.addEventListener("click", () => {
    newChat.click();
});

newChat.addEventListener("click", () => {
    welcomeSection.classList.remove("hidden");
    rightSection.classList.remove("chat-started");
    suggestions.classList.add("hidden");
    chats.innerHTML = "";
    history = [];
    userInput.value = "";
    toggleButtons();
    console.log(rightSection.className);
});

function toggleButtons() {
    const hasText = userInput.value.trim() !== "";
    send.classList.toggle("hidden", !hasText);
}
toggleButtons();

