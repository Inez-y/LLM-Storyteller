/**
 * 
 * A landing page that serves AI functionality.
 * For local testing, use lite-server
 * 
 * TODO
 * 1. dotenv bug
 * @param {*} text 
 * @returns 
 */

// require('dotenv').config();

async function getGPTResponse(text) {
    const key = "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";
    const url = "https://api.openai.com/v1/chat/completions";

    // console.log("OPENAI_KEY:", key); // Debugging
    // console.log("OPENAI_URL:", url); // Debugging

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: text }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("Error fetching GPT response:", error);
        return "Error retrieving response.";
    }
}

// Function to append messages to chat
function appendMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
    messageDiv.innerText = text;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
}

document.getElementById("submit-button").addEventListener("click", async (event) => {
    // Prevent form from refreshing
    event.preventDefault(); 

    const userMessageInput = document.getElementById("user-message");
    const userMessage = userMessageInput.value.trim();

    // Prevent empty messages
    if (userMessage === "") return; 

    console.log("User asked:", userMessage);

    // Display user message in chat
    appendMessage(userMessage, "user");

    // Clear input field
    userMessageInput.value = "";

    // Get GPT response
    getGPTResponse(userMessage).then(response => {
        console.log("GPT said:", response);
        appendMessage(response, "bot"); 
    });
});