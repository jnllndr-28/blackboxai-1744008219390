// Global variables
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// DOM elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const quizForm = document.getElementById('quiz-form');
const currentQuestionDisplay = document.getElementById('current-question');
const totalQuestionsDisplay = document.getElementById('total-questions');
const finalScoreDisplay = document.getElementById('final-score');
const scoreMessage = document.getElementById('score-message');
const resultsContainer = document.getElementById('results-container');

// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        totalQuestionsDisplay.textContent = questions.length;
        
        // If on quiz page, load first question
        if (window.location.pathname.includes('quiz.html')) {
            showQuestion(currentQuestionIndex);
        }
        
        // If on results page, show results
        if (window.location.pathname.includes('results.html')) {
            showResults();
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback questions if JSON fails to load
        questions = [
            {
                "question": "Which era is known as the 'Age of Dinosaurs'?",
                "options": ["Paleozoic", "Mesozoic", "Cenozoic", "Proterozoic"],
                "answer": "Mesozoic",
                "explanation": "The Mesozoic Era spanned 252 to 66 million years ago, dominated by dinosaurs."
            }
        ];
    }
}

// Display current question
function showQuestion(index) {
    if (index >= questions.length) {
        // Quiz completed, redirect to results
        localStorage.setItem('score', score);
        localStorage.setItem('totalQuestions', questions.length);
        window.location.href = 'results.html';
        return;
    }

    const question = questions[index];
    questionText.textContent = question.question;
    currentQuestionDisplay.textContent = index + 1;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create new options
    question.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'flex items-center';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `option-${i}`;
        input.name = 'answer';
        input.value = option;
        input.className = 'h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300';
        
        const label = document.createElement('label');
        label.htmlFor = `option-${i}`;
        label.className = 'ml-2 block text-gray-700';
        label.textContent = option;
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
    });
}

// Handle form submission
if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (!selectedOption) {
            alert('Please select an answer!');
            return;
        }
        
        // Check answer
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption.value === currentQuestion.answer) {
            score++;
        }
        
        // Store user answer for results page
        currentQuestion.userAnswer = selectedOption.value;
        
        // Move to next question
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    });
}

// Show results on results page
function showResults() {
    const storedScore = localStorage.getItem('score');
    const storedTotal = localStorage.getItem('totalQuestions');
    
    if (storedScore && storedTotal) {
        score = parseInt(storedScore);
        const total = parseInt(storedTotal);
        finalScoreDisplay.textContent = `${score}/${total}`;
        
        // Set score message
        if (score === total) {
            scoreMessage.textContent = 'Perfect! You know your geologic history!';
        } else if (score >= total * 0.7) {
            scoreMessage.textContent = 'Great job! You have solid geologic knowledge!';
        } else if (score >= total * 0.5) {
            scoreMessage.textContent = 'Good effort! Keep learning about Earth\'s history!';
        } else {
            scoreMessage.textContent = 'Keep studying! The geologic timescale is fascinating!';
        }
        
        // Show detailed results if questions are loaded
        if (questions.length > 0) {
            questions.forEach((question, index) => {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'bg-gray-50 p-4 rounded-lg';
                
                const questionText = document.createElement('h3');
                questionText.className = 'font-bold text-gray-800';
                questionText.textContent = `Question ${index + 1}: ${question.question}`;
                
                const userAnswer = document.createElement('p');
                userAnswer.className = question.userAnswer === question.answer ? 
                    'text-green-600' : 'text-red-600';
                userAnswer.textContent = `Your answer: ${question.userAnswer || 'Not answered'}`;
                
                const correctAnswer = document.createElement('p');
                correctAnswer.className = 'text-gray-700';
                correctAnswer.textContent = `Correct answer: ${question.answer}`;
                
                const explanation = document.createElement('p');
                explanation.className = 'text-gray-600 italic mt-2';
                explanation.textContent = question.explanation;
                
                resultDiv.appendChild(questionText);
                resultDiv.appendChild(userAnswer);
                resultDiv.appendChild(correctAnswer);
                resultDiv.appendChild(explanation);
                
                resultsContainer.appendChild(resultDiv);
            });
        }
    } else {
        // No results found, redirect to home
        window.location.href = 'index.html';
    }
}

// Initialize the quiz when page loads
document.addEventListener('DOMContentLoaded', loadQuestions);