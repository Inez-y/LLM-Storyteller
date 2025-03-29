// API 호출 통계 변수
let totalApiCalls = 0;
let successfulRequests = 0;
let failedRequests = 0;

const updateApiStats = () => {
    document.getElementById("totalApiCalls").textContent = totalApiCalls;
    document.getElementById("successfulRequests").textContent = successfulRequests;
    document.getElementById("failedRequests").textContent = failedRequests;
};

const handleTranslate = async () => {
    const prompt = document.getElementById("translateInput").value;
    const url = `https://storyteller-server-yrha7.ondigitalocean.app/t2t?prompt=${encodeURIComponent(prompt)}`;    totalApiCalls++; 
    updateApiStats();

    try {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const result = await response.json();
        const cleanedText = cleanText(result.translatedText);

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

const handleQuestion = async () => {
    const prompt = document.getElementById("questionInput").value;
    const url = `https://storyteller-server-yrha7.ondigitalocean.app/t2t?prompt=${encodeURIComponent(prompt)}`;    totalApiCalls++;
    updateApiStats();

    try {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Question request failed');
        }

        const result = await response.json();
        const cleanedText = cleanText(result.translatedText);

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
