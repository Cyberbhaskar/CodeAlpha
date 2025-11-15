import React, { useState } from 'react';

const quizQuestions = [
    {
        question: "You receive an email from 'Your Bank' asking you to click a link to verify your account details due to a security alert. The link looks like 'yourbank.security.com'. What should you do?",
        options: [
            "Click the link immediately to secure your account.",
            "Hover over the link to see the real destination URL, and if it's suspicious, delete the email.",
            "Reply to the email with your account details for verification.",
            "Call the phone number provided in the email to confirm."
        ],
        correctAnswer: 1,
        explanation: "Never click links directly. Hovering can reveal the true, often malicious, destination. Always go to your bank's official website manually or use a trusted app."
    },
    {
        question: "An email with an attachment named 'Invoice.pdf.exe' arrives from a supplier you rarely work with. The email body is generic. What is the biggest risk?",
        options: [
            "The PDF invoice might be incorrect.",
            "The '.exe' extension means it's an executable file, likely malware.",
            "Your computer might not be able to open the file.",
            "It's safe to open as it's a PDF."
        ],
        correctAnswer: 1,
        explanation: "Attackers often disguise malware with double extensions. An '.exe' file can install viruses, ransomware, or spyware on your system."
    },
    {
        question: "What is a common tactic used in phishing emails to create a sense of urgency?",
        options: [
            "Using polite and formal language.",
            "Offering a prize or a large sum of money.",
            "Threatening to close your account or claiming your account has been compromised.",
            "Sending the email late at night."
        ],
        correctAnswer: 2,
        explanation: "Attackers create urgency (e.g., 'account suspension imminent') to make you panic and act without thinking, bypassing normal security checks."
    }
];

const PhishingTraining: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const handleAnswerSelect = (index: number) => {
        if (showResult) return;
        setSelectedAnswer(index);
    };

    const handleCheckAnswer = () => {
        if (selectedAnswer === null) return;
        setShowResult(true);
    };

    const handleNextQuestion = () => {
        setShowResult(false);
        setSelectedAnswer(null);
        setCurrentQuestionIndex((prev) => (prev + 1) % quizQuestions.length);
    };
    
    const isCorrect = selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer;

    return (
        <div className="space-y-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h1 className="text-2xl font-bold text-blue-300">Task 2: Phishing Awareness Training</h1>
                <p className="text-sm text-gray-400 mt-1">This module provides essential information to help you recognize and avoid phishing attacks, a common social engineering tactic.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-yellow-300">How to Recognize Phishing</h2>
                    <ul className="space-y-3 list-disc list-inside text-gray-300">
                        <li><span className="font-semibold">Sense of Urgency:</span> Language that pressures you to act immediately ("account will be suspended").</li>
                        <li><span className="font-semibold">Suspicious Links/Attachments:</span> Unexpected attachments or links to unfamiliar URLs. Hover before you click!</li>
                        <li><span className="font-semibold">Poor Grammar/Spelling:</span> Professional companies usually proofread their emails.</li>
                        <li><span className="font-semibold">Generic Greetings:</span> Vague greetings like "Dear Valued Customer" can be a red flag.</li>
                         <li><span className="font-semibold">Unusual Sender Address:</span> The email address doesn't match the company it claims to be from (e.g., `info@paypal.security-update.com`).</li>
                    </ul>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-green-300">Best Practices to Stay Safe</h2>
                     <ul className="space-y-3 list-disc list-inside text-gray-300">
                        <li><span className="font-semibold">Think Before You Click:</span> Be wary of any link or attachment you weren't expecting.</li>
                        <li><span className="font-semibold">Verify Independently:</span> If an email seems suspicious, contact the company through their official website or phone number, not the information in the email.</li>
                        <li><span className="font-semibold">Use Multi-Factor Authentication (MFA):</span> This adds an extra layer of security, even if your password is stolen.</li>
                        <li><span className="font-semibold">Keep Software Updated:</span> This helps patch security holes that attackers might exploit.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-blue-300">Test Your Knowledge</h2>
                <div>
                    <p className="text-gray-300 mb-4">{quizQuestions[currentQuestionIndex].question}</p>
                    <div className="space-y-3">
                        {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                             <div 
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    showResult && index === quizQuestions[currentQuestionIndex].correctAnswer ? 'bg-green-500/20 border-green-500' :
                                    showResult && index === selectedAnswer && !isCorrect ? 'bg-red-500/20 border-red-500' :
                                    selectedAnswer === index ? 'bg-blue-500/20 border-blue-500' : 'border-gray-600 hover:bg-gray-700'
                                }`}
                            >
                                {option}
                            </div>
                        ))}
                    </div>

                    {showResult && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                           <p className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
                           <p>{quizQuestions[currentQuestionIndex].explanation}</p>
                        </div>
                    )}

                    <div className="mt-6">
                        {showResult ? (
                            <button onClick={handleNextQuestion} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                                Next Question
                            </button>
                        ) : (
                             <button onClick={handleCheckAnswer} disabled={selectedAnswer === null} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed">
                                Check Answer
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhishingTraining;
