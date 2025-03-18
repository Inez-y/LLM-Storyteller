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
 * @param {*} text 
 * @returns 
 */

async function getGPTResponse(text) {
    const url = "https://api.openai.com/v1/chat/completions";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: text }]
            })
        });

        console.log("DEBUG: Raw Response ->", response);

        // Wait for full response before proceeding
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error Response from OpenAI:", errorData);
            throw new Error(`HTTP error! Status: ${response.status} - ${errorData.error?.message || "Unknown error"}`);
        }

        const data = await response.json();
        console.log("DEBUG: Parsed GPT Response ->", data);
        
        return data.choices?.[0]?.message?.content || "No response from GPT.";

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

    // Speak bot response (temp)
    if (sender === "bot") {
        speakText(text);
    }
}

// Function to speak
// async function speakAloud(response) {
//     const openai = new OpenAI();
//     const speechFile = path.resolve("./speech.mp3");
//     const mp3 = await openai.audio.speech.create(
//         model="tts-1",
//         voice="onyx",
//         input=response,
//     )

//     const buffer = Buffer.from(await mp3.arrayBuffer());
//     await fs.promises.writeFile(speechFile, buffer);
// };

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
        console.log("GPT said:", response);
        appendMessage(response, "bot"); 
    } catch (error) {
        console.error("Failed to get GPT response:", error);
        appendMessage("Sorry, there was an issue fetching the response.", "bot");
    }
});


// A temp function to convert text to speech
function speakText(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Adjust for other languages if needed
    utterance.rate = 1; // Speed (1 is normal, 0.5 is slow, 2 is fast)
    utterance.pitch = 1; // Pitch (1 is normal, 0.5 is deep, 2 is high)
    
    synth.speak(utterance);
}