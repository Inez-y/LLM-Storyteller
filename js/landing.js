// Page for ai chatbot (GPT)

// require('dotenv').config();
console.log(OPENAI_KEY);
console.log(OPENAI_URL);

async function getGPTResponse(text) {
    // const key = process.env.OPENAI_KEY;
    // const url = process.env.OPENAI_URL;
    const key = OPENAI_KEY;
    const url = OPENAI_URL;

    console.log("OPENAI_KEY:", key); // Debugging
    console.log("OPENAI_URL:", url); // Debugging

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

document.getElementById("submit-button").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form from refreshing

    const userMessage = document.getElementById("user-message").value;
    const gptResponse = document.getElementById("gpt-response");

    console.log("User asked:", userMessage);

    getGPTResponse(userMessage).then(response => {
        console.log("GPT said:", response);
        gptResponse.innerText = response; // Now correctly updates the page
    });
});
