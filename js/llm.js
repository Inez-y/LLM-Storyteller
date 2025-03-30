// API 호출 통계 변수
let totalApiCalls = 0;
let successfulRequests = 0;
let failedRequests = 0;
let hasShownWarning = false;

// Function to update api stats and count
const updateApiStats = () => {
    totalApiCalls = successfulRequests + failedRequests;
    
    document.getElementById("totalApiCalls").textContent = totalApiCalls;
    document.getElementById("successfulRequests").textContent = successfulRequests;
    document.getElementById("failedRequests").textContent = failedRequests;

    // Show warning if total calls reach 20
    if (totalApiCalls === 20 && !hasShownWarning) {
        alert("You've reached free 20 API calls. Feel free to continue, but just a heads-up!");
        hasShownWarning = true;
    }
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
        // Activate loading spinner after click the submit button
        document.getElementById("loadingSpinnerTranslate").style.display = 'block';
        document.getElementById("translationResult").textContent = '';

        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Translation failed');
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
    } catch (error) {
        console.error('Error:', error);
        // Hide spinner and show result
        document.getElementById("loadingSpinnerTranslate").style.display = 'none';
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
    //console.log(input, prompt)
    try {
        // Activate loading spinner after click the submit button
        document.getElementById("loadingSpinnerTeacher").style.display = 'block';
        document.getElementById("translationResult").textContent = '';


        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Question request failed');
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
    } catch (error) {
        console.error('Error:', error);

        // Hide spinner and show result
        document.getElementById("loadingSpinnerTeacher").style.display = 'none';
        document.getElementById("questionResult").textContent = 'Error getting answer.';

        failedRequests++;
        updateApiStats();
    }
};

// Function to clean and parse response from LLM server
const cleanText = (text) => {
    if (text.includes('<unk>' || '</unk>')) {
        return 'Oops! I\'m not familiar with that language...';
    } else return text.replace(/<pad>/g, '').replace(/<\/s>/g, '').trim();
};

