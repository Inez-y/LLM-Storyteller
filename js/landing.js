// Page for ai chatbot (GPT)

require('dotenv').config();

async function getGPTResponse(text) {
    const key = process.env.OPENAI_KEY;
    const url = process.env.OPENAI_URL;

    console.log("OPENAI_KEY:", process.env.OPENAI_KEY); // Debugging
    console.log("OPENAI_URL:", process.env.OPENAI_URL); // Debugging

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
    const data = await response.json();
    return data.choices[0].message.content;
}


const submitButton = document.getElementById("submit-button");
const userMessage = document.getElementById("user-message").value;
const gptResponse = document.getElementById("gpt-respons");

submitButton.addEventListener("click", () =>{
    console.log("User asked: ", userMessage);
    getGPTResponse(userMessage).then(response => 
        console.log("Gpt said: ", response));
        gptResponse.innerText = response;
});