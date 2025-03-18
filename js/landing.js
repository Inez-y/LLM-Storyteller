/**
 * 
 * A landing page that serves AI functionality.
 * For local testing, use lite-server
 * 
 * TODO
 * 1. dotenv bug
 * 2. Implement LLM model and turn into mp3 file 
 *      - GPT can read "files", not random text formats
 *      - https://platform.openai.com/docs/guides/text-to-speech

 */

// Fetch GPT response from backend
async function getGPTResponse(prompt) {
    try {
        const response = await fetch("https://storyteller-server-yrha7.ondigitalocean.app/landing", {  // Corrected API URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }) 
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Server Response:", data);  

        // return data.response || "No response received."; 
    } catch (error) {
        console.error("Fetch error:", error);
        return "Error connecting to AI.";
    }
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

    // Wait for GPT response before proceeding
    try {
        const response = await getGPTResponse(userMessage);
        console.log("GPT says: ", response);

        // Play the audio if available
        if (data.audio ) {
            playAudio(data.audio);
        }

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
    // the base64-encoded audio 
    const audioBlob = new Blob([new Uint8Array(atob(base64Audio).split("").map(c => c.charCodeAt(0)))], { type: "audio/wav" });

    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    audio.play();
}
