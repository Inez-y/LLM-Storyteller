import * as messages from "../lang/messages/en/userMSG.js";

let totalApiCalls = 0;
let successfulRequests = 0;
let failedRequests = 0;
let hasShownWarning = false;
document.getElementById("translateBtn").addEventListener("click", handleTranslate);
document.getElementById("askBtn").addEventListener("click", handleQuestion);


// Function to update api stats and count
const updateApiStats = () => {
    totalApiCalls = successfulRequests + failedRequests;

    document.getElementById("totalApiCalls").textContent = totalApiCalls;
    document.getElementById("successfulRequests").textContent = successfulRequests;
    document.getElementById("failedRequests").textContent = failedRequests;

    // Show warning if total calls reach 20
    if (totalApiCalls === 20 && !hasShownWarning) {
        alert(messages.over20Calls);
        hasShownWarning = true;
    }
};

// [Translation]: The first text box
const handleTranslate = async () => {
    const targetLang = document.getElementById("translateLanguageInput").value;
    const input = document.getElementById("translateInput").value;
    const prompt = `Translate to ${targetLang}: ${input}`;
    console.log(targetLang, input, prompt);
    const url = `https://storyteller-server-yrha7.ondigitalocean.app/t2t?prompt=${encodeURIComponent(prompt)}`; totalApiCalls++;
    updateApiStats();

    try {
        // Activate loading spinner after click the submit button
        document.getElementById("loadingSpinnerTranslate").style.display = 'block';
        document.getElementById("translationResult").textContent = '';

        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error(messages.trFail);
        }

        const result = await response.json();
        console.log(result);

        const cleanedText = cleanText(result.translatedText);

        console.log('cleanedText:', cleanedText);

        // Hide spinner and show result
        document.getElementById("loadingSpinnerTranslate").style.display = 'none';
        document.getElementById("translationResult").textContent = 'Translated Text: ' + cleanedText;

        successfulRequests++;
        updateApiStats();
        await updateServerUsage(true);
    } catch (error) {
        console.error('Error:', error);
        // Hide spinner and show result
        document.getElementById("loadingSpinnerTranslate").style.display = 'none';
        document.getElementById("translationResult").textContent = messages.trErr;

        failedRequests++;
        updateApiStats();
        await updateServerUsage(false);
    }
};

// [Ask Teacher]: The second text box
const handleQuestion = async () => {
    const input = document.getElementById("questionInput").value;
    const prompt = `Please answer to the following question. ${input}`;
    const url = `https://storyteller-server-yrha7.ondigitalocean.app/t2t?prompt=${encodeURIComponent(prompt)}`; totalApiCalls++;
    updateApiStats();
    //console.log(input, prompt)
    try {
        // Activate loading spinner after click the submit button
        document.getElementById("loadingSpinnerTeacher").style.display = 'block';
        document.getElementById("translationResult").textContent = '';


        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error(messages.qFail);
        }

        const result = await response.json();
        //console.log(result);
        const cleanedText = cleanText(result.translatedText);
        //console.log('cleanedTExt:', cleanedText);

        // Hide spinner and show result
        document.getElementById("loadingSpinnerTeacher").style.display = 'none';
        document.getElementById("questionResult").textContent = 'Answer: ' + cleanedText;

        successfulRequests++;
        updateApiStats();
        await updateServerUsage(true);
    } catch (error) {
        console.error('Error:', error);

        // Hide spinner and show result
        document.getElementById("loadingSpinnerTeacher").style.display = 'none';
        document.getElementById("questionResult").textContent = messages.aErr;

        failedRequests++;
        updateApiStats();
        await updateServerUsage(false);
    }
};

// Function to clean and parse response from LLM server
const cleanText = (text) => {
    if (text.includes('<unk>' || '</unk>')) {
        return messages.unk
    } else return text.replace(/<pad>/g, '').replace(/<\/s>/g, '').trim();
};

// Update API usage to the server
const updateServerUsage = async (isSuccess) => {
    try {
        await fetch('https://storyteller-server-yrha7.ondigitalocean.app/update-user-usage', {
            method: 'POST',
            credentials: 'include', // server reads the user from the cookie automatically. for JWT
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isSuccess })
        });
    } catch (error) {
        console.error('Error updating server usage:', error);
    }
};
