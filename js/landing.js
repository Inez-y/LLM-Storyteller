/**
 * 
 * A landing page that serves AI functionality.
 * For local testing, use lite-server
 * 
 * TODO
 * 1. Read users' voice input dynamically
 
 */

// Fetch GPT response from backend
async function getGPTResponse(prompt) {
    try {
        const response = await fetch("https://storyteller-server-yrha7.ondigitalocean.app/landing", {  
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }) 
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Server Response:", data);

        const botReply = data.response || "No response received.";
        appendMessage(botReply, "bot");

        if (data.audio) {
            playAudio(data.audio);
        }

        return botReply;
    } catch (error) {
        console.error("Fetch error:", error);
        appendMessage("Error connecting to AI.", "bot");
        return "Error connecting to AI.";
    }
}


document.getElementById("submit-button").addEventListener("click", async (event) => {
    event.preventDefault(); 

    const userMessageInput = document.getElementById("user-message");
    const userMessage = userMessageInput.value.trim();

    if (userMessage === "") return; 

    console.log("User asked:", userMessage);

    appendMessage(userMessage, "user");
    userMessageInput.value = "";

    try {
        const response = await getGPTResponse(userMessage);
        console.log("GPT says: ", response);
        appendMessage(response, "bot"); 
    } catch (error) {
        console.error("Failed to get GPT response:", error);
        appendMessage("Sorry, there was an issue fetching the response.", "bot");
    }
});

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

// Function to play base64 audio 
function playAudio(base64Audio) {
    // Decode base64 string to binary data
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Convert to a Blob and play
    const audioBlob = new Blob([bytes], { type: "audio/wav" });
    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    audio.play();
}
