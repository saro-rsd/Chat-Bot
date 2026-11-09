const apiKey = CONFIG.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

const rightSection = document.getElementById("right-section");
const chats = document.getElementById("chats");
const userInput = document.getElementById("user-input");
const send = document.getElementById("send-btn");
const voice = document.getElementById("voice-btn");
const newChat = document.getElementById(".new-chat-btn");

let history = [];

function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = "msg" + who;
    div.textContent = text;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
    return div;
}

async function askChat(text) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: text
                                }
                            ]
                        }
                    ]
                }
            )
        });

        const data = await res.json();

        console.log(data.candidate?.[0]?.content?.parts?.[0]?.text || "Sorry");
        return data.candidate?.[0]?.content?.parts?.[0]?.text;

    } catch (error) {
        new Error(error);
    }
}

function sendMessage() {
    const text = document.getElementById("user-input").value.trim();
    if (text === "") return;

    rightSection.classList.add("chat-started")
    addMessage(text, "user");
    history.push({ role: "user", content: text });
    userInput.value = "";

    const typing = addMessage(text, "user");

    try {
        const reply = askChat(text);
        typing.textContent = reply;
        history.push({ role: "assistant", content: reply });
    } catch (error) {
        typing.textContent = "Error: " + err.message;
        history.pop();
    }

    chats.scrollTop = chats.scrollHeight;
}

send.addEventListener("click",() => sendMessage());

userInput.addEventListener("keydown",(e) =>{
    if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        sendMessage();
    }
});

