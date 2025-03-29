const handleTranslate = async () => {
    const prompt = document.getElementById("translateInput").value;
    const url = `https://storyteller-server-yrha7.ondigitalocean.app/t2t?prompt=${encodeURIComponent(prompt)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const result = await response.json();
        const cleanedText = cleanText(result.translatedText); 

        document.getElementById("translationResult").textContent = 'Translated Text: ' + cleanedText;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("translationResult").textContent = 'Error during translation.';
    }
};

const handleQuestion = async () => {
    const prompt = document.getElementById("questionInput").value;
    const url = `https://storyteller-server-yrha7.ondigitalocean.app/t2t?prompt=${encodeURIComponent(prompt)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Question request failed');
        }

        const result = await response.json();
        const cleanedText = cleanText(result.translatedText);

        document.getElementById("questionResult").textContent = 'Answer: ' + cleanedText;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("questionResult").textContent = 'Error getting answer.';
    }
};


// 정제 함수
const cleanText = (text) => {
    return text.replace(/<pad>/g, '').replace(/<\/s>/g, '').trim();
};

