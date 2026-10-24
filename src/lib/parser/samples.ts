export const SAMPLE_QUIZZES = [
  {
    id: "tech-web",
    name: "Web & JavaScript Essentials (5 Questions)",
    data: [
      {
        id: "q1",
        question: "Which of the following HTTP status codes indicates that a resource was successfully created?",
        options: ["200 OK", "201 Created", "204 No Content", "301 Moved Permanently"],
        correctIndex: 1,
        explanation: "201 Created indicates that the request succeeded and led to the creation of a resource."
      },
      {
        id: "q2",
        question: "What is the primary difference between 'let' and 'var' in modern JavaScript?",
        options: [
          "'let' is block-scoped, while 'var' is function-scoped",
          "'var' prevents reassignment, while 'let' allows it",
          "'let' is hoisted to the global object, 'var' is not",
          "There is no difference in ES6"
        ],
        correctIndex: 0,
        explanation: "'let' and 'const' have block scope, whereas 'var' variables are function-scoped or globally scoped."
      },
      {
        id: "q3",
        question: "In React, what hook is used to perform side effects like subscriptions or manual DOM manipulations?",
        options: ["useReducer", "useCallback", "useEffect", "useMemo"],
        correctIndex: 2,
        explanation: "useEffect lets you synchronize a component with an external system and execute side effects."
      },
      {
        id: "q4",
        question: "Which CSS property is used to create a flexbox container?",
        options: ["position: flex", "display: flex", "flex-direction: row", "align-items: center"],
        correctIndex: 1,
        explanation: "Setting 'display: flex' or 'display: inline-flex' establishes a flex formatting context for child elements."
      },
      {
        id: "q5",
        question: "What will 'typeof null' return in standard JavaScript?",
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        correctIndex: 2,
        explanation: "'typeof null' returns 'object', which is a historical bug in JavaScript from its first implementation."
      }
    ]
  },
  {
    id: "science-general",
    name: "General Science Trivia (4 Questions)",
    data: [
      {
        id: "sci_1",
        question: "What is the most abundant gas in Earth's atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
        correctIndex: 1,
        explanation: "Nitrogen makes up approximately 78% of Earth's atmosphere."
      },
      {
        id: "sci_2",
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Fe", "Au", "Pb"],
        correctIndex: 2,
        explanation: "Au comes from the Latin word 'aurum', meaning shining dawn or gold."
      },
      {
        id: "sci_3",
        question: "Which organelle is widely known as the powerhouse of the eukaryotic cell?",
        options: ["Ribosome", "Endoplasmic Reticulum", "Mitochondria", "Golgi Apparatus"],
        correctIndex: 2,
        explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions (ATP)."
      },
      {
        id: "sci_4",
        question: "At what temperature Celsius does pure water freeze at standard atmospheric pressure?",
        options: ["-10°C", "0°C", "32°C", "100°C"],
        correctIndex: 1,
        explanation: "Pure water freezes at 0 degrees Celsius (32 degrees Fahrenheit) at 1 atm."
      }
    ]
  },
  {
    id: "single-question",
    name: "Single Question Quiz (Edge Case Test)",
    data: [
      {
        id: "solo_1",
        question: "Is MyQuizGPT alternative 100% free with no limits or logins?",
        options: ["No, it requires a credit card", "No, it requires an API key", "Yes, completely free and browser-based", "Only for 3 questions"],
        correctIndex: 2,
        explanation: "This application is 100% client-side, free, and does not require any login or payment."
      }
    ]
  }
];
