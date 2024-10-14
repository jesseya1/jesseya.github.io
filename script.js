// Smooth Scrolling for Links
$(document).ready(function () {
    $('a.nav-link, a.btn').on('click', function (event) {
        if (this.hash !== "") {
            if ($(this.hash).length) {
                event.preventDefault();
                var hash = this.hash;
                $('html, body').animate({
                    scrollTop: $(hash).offset().top - 70
                }, 800);
            }
        }
    });
});

// Chatbot Integration with OpenAI API
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let userInput = e.target.value;
        let chatOutput = document.getElementById('chat-output');

        // Display user's message
        let userMessage = document.createElement('p');
        userMessage.textContent = 'You: ' + userInput;
        userMessage.className = 'user-message';
        chatOutput.appendChild(userMessage);

        // Clear input field
        e.target.value = '';

        // Call the OpenAI API
        getBotResponse(userInput)
            .then(botReply => {
                let botMessage = document.createElement('p');
                botMessage.textContent = 'Bot: ' + botReply;
                botMessage.className = 'bot-message';
                chatOutput.appendChild(botMessage);
                chatOutput.scrollTop = chatOutput.scrollHeight;
            })
            .catch(error => {
                console.error('Error:', error);
                let botMessage = document.createElement('p');
                botMessage.textContent = 'Bot: Sorry, I am having trouble processing your request.';
                botMessage.className = 'bot-message';
                chatOutput.appendChild(botMessage);
                chatOutput.scrollTop = chatOutput.scrollHeight;
            });
    }
});

async function getBotResponse(userInput) {
    // Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
    const apiKey = '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';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are an AI assistant for ThriveAI, specializing in AI automation and consulting services for businesses. Only answer questions related to AI automation, AI agents, consulting services, and how ThriveAI can help businesses grow. If asked about anything else, politely inform the user that you can only discuss topics related to ThriveAI\'s services.' },
                { role: 'user', content: userInput }
            ],
            max_tokens: 150,
            n: 1,
            stop: null,
            temperature: 0.7
        })
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
    } else {
        throw new Error('No response from OpenAI API');
    }
}

// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect form data
    let formData = {
        'name': document.getElementById('name').value,
        'email': document.getElementById('email').value,
        'message': document.getElementById('message').value
    };

    // Send data to Google Sheets via a Google Apps Script Web App
    fetch('https://script.google.com/macros/s/AKfycbxWuAr1Ec9DobjLi3q11wd9_dRJ-UO5UIKyjZHFmupzmDNUbo_gEhpvIRogiOBgVlG7_w/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Ensure the header is set
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                // Display success message
                document.getElementById('form-messages').textContent = 'Thank you for reaching out! We\'ll get back to you soon.';
                // Clear the form
                document.getElementById('contact-form').reset();
            } else {
                document.getElementById('form-messages').textContent = 'Oops! Something went wrong. Please try again.';
            }
        })
        .catch(function (error) {
            console.error('Error!', error.message);
            document.getElementById('form-messages').textContent = 'Error submitting form.';
        });
});