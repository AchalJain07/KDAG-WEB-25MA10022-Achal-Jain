// Quiz data with questions, options, correct answers, and explanations
const quizData = [
    {
        question: "What does ETL stand for in data processing?",
        options: ["Extract, Transform, Load", "Evaluate, Test, Launch", "Export, Transfer, Link", "Execute, Track, Log"],
        correct: 0,
        explanation: "ETL stands for Extract, Transform, Load - the three main phases of moving data from source systems to a data warehouse or data lake."
    },
    {
        question: "Which statistical measure is most resistant to outliers?",
        options: ["Mean", "Standard Deviation", "Median", "Range"],
        correct: 2,
        explanation: "The median is most resistant to outliers because it represents the middle value when data is ordered, unlike the mean which can be heavily influenced by extreme values."
    },
    {
        question: "In machine learning, what does 'overfitting' mean?",
        options: ["Model performs well on training data but poorly on new data", "Model has too few parameters", "Training takes too long", "Data has too many features"],
        correct: 0,
        explanation: "Overfitting occurs when a model learns the training data too well, including noise and random fluctuations, making it perform poorly on new, unseen data."
    },
    {
        question: "Which type of chart is best for showing correlation between two continuous variables?",
        options: ["Bar Chart", "Pie Chart", "Scatter Plot", "Line Chart"],
        correct: 2,
        explanation: "A scatter plot is ideal for showing correlation between two continuous variables as it displays individual data points and reveals patterns, trends, and relationships."
    },
    {
        question: "What is the primary purpose of a data warehouse?",
        options: ["Real-time transaction processing", "Centralized storage for analytical reporting", "Web application hosting", "Email storage"],
        correct: 1,
        explanation: "A data warehouse is designed for centralized storage and analytical reporting, optimized for complex queries and historical data analysis rather than transaction processing."
    },
    {
        question: "In SQL, which clause is used to filter groups created by GROUP BY?",
        options: ["WHERE", "HAVING", "FILTER", "SELECT"],
        correct: 1,
        explanation: "HAVING is used to filter groups after GROUP BY operations, while WHERE filters individual rows before grouping occurs."
    },
    {
        question: "What does a p-value of 0.03 indicate in hypothesis testing?",
        options: ["3% chance the null hypothesis is true", "97% confidence in results", "3% probability of observing results if null hypothesis is true", "30% statistical power"],
        correct: 2,
        explanation: "A p-value of 0.03 means there's a 3% probability of observing the results (or more extreme) if the null hypothesis were true, not the probability that the null hypothesis is true."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let userAnswers = [];
let currentView = 'home';

// Show home page
function showHome() {
    currentView = 'home';
    document.getElementById('homeCard').style.display = 'block';
    document.getElementById('quizCard').style.display = 'none';
    document.getElementById('resultsCard').style.display = 'none';
    document.getElementById('pageTitle').textContent = 'Data & Analytics Quiz';
    
    // Update navigation
    document.getElementById('homeBtn').classList.add('active');
    document.getElementById('quizBtn').classList.remove('active');
    
    // Hide progress elements
    document.querySelector('.progress-container').style.display = 'none';
    document.getElementById('questionCounter').style.display = 'none';
}

// Show quiz
function showQuiz() {
    currentView = 'quiz';
    document.getElementById('homeCard').style.display = 'none';
    document.getElementById('resultsCard').style.display = 'none';
    document.getElementById('quizCard').style.display = 'block';
    document.getElementById('pageTitle').textContent = 'Data & Analytics Quiz Challenge';
    
    // Update navigation
    document.getElementById('homeBtn').classList.remove('active');
    document.getElementById('quizBtn').classList.add('active');
    
    // Show progress elements
    document.querySelector('.progress-container').style.display = 'block';
    document.getElementById('questionCounter').style.display = 'block';
    
    // Initialize or continue quiz
    if (currentQuestionIndex === 0 && userAnswers.length === 0) {
        initializeQuiz();
    } else {
        updateProgressBar();
        displayQuestion();
    }
}

// Initialize the quiz
function initializeQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    userAnswers = [];
    updateProgressBar();
    displayQuestion();
}

// Display current question
function displayQuestion() {
    const question = quizData[currentQuestionIndex];
    
    // Update question counter
    document.getElementById('questionCounter').textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    
    // Display question
    document.getElementById('questionText').textContent = question.question;
    
    // Display options
    const optionsSection = document.getElementById('optionsSection');
    optionsSection.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsSection.appendChild(button);
    });
    
    // Hide feedback section
    document.getElementById('feedbackSection').style.display = 'none';
}

// Handle answer selection
function selectAnswer(answerIndex) {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    selectedAnswer = answerIndex;
    const question = quizData[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // Disable all options and show results
    options.forEach((option, index) => {
        option.classList.add('disabled');
        
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && index !== question.correct) {
            option.classList.add('incorrect');
        }
        
        if (index === selectedAnswer) {
            option.classList.add('selected');
        }
    });
    
    // Update score and store user answer
    const isCorrect = selectedAnswer === question.correct;
    if (isCorrect) {
        score++;
    }
    
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        selectedAnswer: selectedAnswer,
        correct: isCorrect,
        correctAnswer: question.correct
    });
    
    // Show feedback
    showFeedback(isCorrect, question.explanation);
}

// Show feedback after answer selection
function showFeedback(isCorrect, explanation) {
    const feedbackSection = document.getElementById('feedbackSection');
    const feedbackContent = document.getElementById('feedbackContent');
    
    let feedbackHTML = '';
    if (isCorrect) {
        feedbackHTML = `
            <div style="color: #00FF00; font-weight: bold; margin-bottom: 10px;">✓ Correct!</div>
            <p>${explanation}</p>
        `;
    } else {
        const correctOption = quizData[currentQuestionIndex].options[quizData[currentQuestionIndex].correct];
        feedbackHTML = `
            <div style="color: #FF4444; font-weight: bold; margin-bottom: 10px;">✗ Incorrect</div>
            <p style="margin-bottom: 10px;"><strong>Correct answer:</strong> ${correctOption}</p>
            <p>${explanation}</p>
        `;
    }
    
    feedbackContent.innerHTML = feedbackHTML;
    feedbackSection.style.display = 'block';
    
    // Update next button text
    const nextBtn = document.getElementById('nextBtn');
    if (currentQuestionIndex === quizData.length - 1) {
        nextBtn.textContent = 'View Results';
    } else {
        nextBtn.textContent = 'Next Question';
    }
}

// Move to next question or show results
function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        selectedAnswer = null;
        updateProgressBar();
        displayQuestion();
    } else {
        showResults();
    }
}

// Update progress bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// Show final results
function showResults() {
    document.getElementById('quizCard').style.display = 'none';
    document.getElementById('resultsCard').style.display = 'block';
    
    // Display score
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.innerHTML = `
        <div style="font-size: 1.2rem; margin-bottom: 10px;">Your Final Score:</div>
        <div style="font-size: 2.5rem; font-weight: bold;">${score} out of ${quizData.length}</div>
        <div style="font-size: 1.1rem; margin-top: 10px; opacity: 0.9;">
            ${Math.round((score / quizData.length) * 100)}% Correct
        </div>
    `;
    
    // Show detailed breakdown
    showScoreBreakdown();
}

// Show detailed score breakdown
function showScoreBreakdown() {
    const scoreBreakdown = document.getElementById('scoreBreakdown');
    let breakdownHTML = '<h3>Answer Review:</h3>';
    
    quizData.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer.correct;
        const selectedOption = question.options[userAnswer.selectedAnswer];
        const correctOption = question.options[question.correct];
        
        breakdownHTML += `
            <div class="answer-review">
                <strong>Q${index + 1}:</strong> ${question.question}<br>
                <span style="color: #CCCCCC;">Your answer:</span> 
                <span class="${isCorrect ? 'correct-answer' : 'incorrect-answer'}">${selectedOption}</span>
                ${!isCorrect ? `<br><span style="color: #CCCCCC;">Correct answer:</span> <span class="correct-answer">${correctOption}</span>` : ''}
            </div>
        `;
    });
    
    scoreBreakdown.innerHTML = breakdownHTML;
}

// Restart quiz
function restartQuiz() {
    initializeQuiz();
}

// Start the quiz when page loads
document.addEventListener('DOMContentLoaded', function() {
    showHome();
});