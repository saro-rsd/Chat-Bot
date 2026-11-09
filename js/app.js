
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


