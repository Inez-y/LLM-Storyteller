// API 호출 통계 변수
let totalApiCalls = 0;
let successfulRequests = 0;
let failedRequests = 0;

const updateApiStats = () => {
    document.getElementById("totalApiCalls").textContent = totalApiCalls;
    document.getElementById("successfulRequests").textContent = successfulRequests;
    document.getElementById("failedRequests").textContent = failedRequests;
};

// [Translation]: The first text box
const handleTranslate = async () => {
    const targetLang = document.getElementById("translateLanguageInput").value;
    const input = document.getElementById("translateInput").value;
    const prompt = `Translate to ${targetLang}: ${input}`;
    console.log(targetLang, input, prompt);
    const url = `https://storyteller-server-yrha7.ondigitalocean.app/t2t?prompt=${encodeURIComponent(prompt)}`;    totalApiCalls++; 
    updateApiStats();

    try {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const result = await response.json();
        console.log('result:', result);
        const cleanedText = cleanText(result.translatedText);
        console.log('cleanedText:', cleanedText);

        document.getElementById("translationResult").textContent = 'Translated Text: ' + cleanedText;

        successfulRequests++;
        updateApiStats();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("translationResult").textContent = 'Error during translation.';

        failedRequests++;
        updateApiStats();
    }
};

// [Ask Teacher]: The second text box
const handleQuestion = async () => {
    const input = document.getElementById("questionInput").value;
    const prompt = `Please answer to the following question. ${input}`;
    const url = `https://storyteller-server-yrha7.ondigitalocean.app/t2t?prompt=${encodeURIComponent(prompt)}`;    totalApiCalls++;
    updateApiStats();
    console.log(input, prompt)
    try {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Question request failed');
        }

        const result = await response.json();
        console.log('result:', result);
        const cleanedText = cleanText(result.translatedText);
        console.log('cleanedTExt:', cleanedText);

        document.getElementById("questionResult").textContent = 'Answer: ' + cleanedText;

        successfulRequests++;
        updateApiStats();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("questionResult").textContent = 'Error getting answer.';

        failedRequests++;
        updateApiStats();
    }
};

const cleanText = (text) => {
    return text.replace(/<pad>/g, '').replace(/<\/s>/g, '').trim();
};
