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

// require('dotenv').config();
// import fs from "fs";
// import path from "path";
// import OpenAI from "openai";


async function getGPTResponse(text) {
    const key = OPENAI_KEY || process.env.OPENAI_KEY;
    const url = OPENAI_URL || process.env.OPENAI_URL; 

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
        console.log(response);
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

    // Get GPT response
    getGPTResponse(userMessage).then(response => {
        console.log("GPT said:", response);
        appendMessage(response, "bot"); 
        // speakAloud(response);
    });
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