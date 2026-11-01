let currentQuiz = [];
let timerInterval = null;
let secondsElapsed = 0;
let seenQuestions = new Set();

console.log("quiz-engine loaded");

function shuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [arr[i], arr[j]] =
        [arr[j], arr[i]];
    }

    return arr;
}

function updateProgressTracker() {

    const tracker =
        document.getElementById(
            "progressTracker"
        );

    if (!tracker) return;

    const percent = Math.round(
        (seenQuestions.size / masterBank.length) * 100
    );

    tracker.innerHTML =
        `Questions Seen: ${seenQuestions.size} / ${masterBank.length} (${percent}% Complete)`;
}

function startTimer() {

    clearInterval(timerInterval);

    secondsElapsed = 0;

    const timerDiv =
        document.getElementById(
            "timer"
        );

    if (timerDiv) {

        timerDiv.textContent =
            "Time: 00:00";
    }

    timerInterval = setInterval(() => {

        secondsElapsed++;

        const minutes =
            Math.floor(
                secondsElapsed / 60
            );

        const seconds =
            secondsElapsed % 60;

        if (timerDiv) {

            timerDiv.textContent =
                `Time: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }

    }, 1000);
}

function stopTimer() {

    clearInterval(timerInterval);
}

function resetSeenQuestions() {

    seenQuestions.clear();

    updateProgressTracker();
}

function startExam(count) {

    startTimer();

    const unseen =
        window.masterBank.filter(
            q => !seenQuestions.has(q.id)
        );

    currentQuiz = shuffle(
        unseen.length
            ? unseen
            : window.masterBank
    ).slice(0, count);

    currentQuiz.forEach(q =>
        seenQuestions.add(q.id)
    );

    updateProgressTracker();

    const quizContainer =
        document.getElementById(
            "quizContainer"
        );

    const scoreDiv =
        document.getElementById(
            "score"
        );

    quizContainer.innerHTML = "";
    scoreDiv.innerHTML = "";

    currentQuiz.forEach(
        (q, index) => {

            const questionDiv =
                document.createElement(
                    "div"
                );

            questionDiv.className =
                "question";

            questionDiv.id =
                "question-" + index;

            questionDiv.innerHTML = `
                <h3>
                    ${index + 1}. ${q.prompt}
                </h3>

                ${q.options.map(opt => `
                    <label>
                        <input
                            type="radio"
                            name="question_${index}"
                            value="${opt.id}">
                        ${opt.id}. ${opt.text}
                    </label>
                    <br>
                `).join("")}
            `;

            quizContainer.appendChild(
                questionDiv
            );
        }
    );
}

function gradeQuiz() {

    if (!currentQuiz.length) {

        alert(
            "Start an exam first."
        );

        return;
    }

    stopTimer();

    let correct = 0;

    currentQuiz.forEach(
        (q, index) => {

            const selected =
                document.querySelector(
                    `input[name="question_${index}"]:checked`
                );

            const questionDiv =
                document.getElementById(
                    "question-" + index
                );

            questionDiv.classList.remove(
                "correct",
                "incorrect"
            );

            const oldReview =
                questionDiv.querySelector(
                    ".answer-review"
                );

            if (oldReview) {
                oldReview.remove();
            }

            const userAnswer =
                selected
                    ? selected.value
                    : null;

            const answers =
                Array.isArray(q.answer)
                    ? q.answer
                    : [q.answer];

            const isCorrect =
                userAnswer &&
                answers.includes(
                    userAnswer
                );

            const correctAnswer =
                answers[0];

            const correctOption =
                q.options.find(
                    o =>
                    o.id === correctAnswer
                );

            const userOption =
                q.options.find(
                    o =>
                    o.id === userAnswer
                );

            if (isCorrect) {

                correct++;

                questionDiv.classList.add(
                    "correct"
                );

            } else {

                questionDiv.classList.add(
                    "incorrect"
                );
            }

            const review =
                document.createElement(
                    "div"
                );

            review.className =
                "answer-review";

            review.innerHTML = `
                <hr>

                <p>
                    <strong>Your Answer:</strong>
                    ${
                        userAnswer
                        ? `${userAnswer} - ${userOption?.text || ""}`
                        : "No Answer"
                    }
                </p>

                <p>
                    <strong>Correct Answer:</strong>
                    ${correctAnswer}
                    -
                    ${correctOption?.text || ""}
                </p>

                <p>
                    <strong>Explanation:</strong>
                    ${
                        q.explain ||
                        "No explanation provided."
                    }
                </p>
            `;

            questionDiv.appendChild(
                review
            );
        }
    );

    const total =
        currentQuiz.length;

    const missed =
        total - correct;

    const percent =
        Math.round(
            (correct / total) * 100
        );

    const minutes =
        Math.floor(
            secondsElapsed / 60
        );

    const seconds =
        secondsElapsed % 60;

    document.getElementById(
        "score"
    ).innerHTML = `
        <h2>Results</h2>

        <p>
            <strong>Score:</strong>
            ${correct}/${total}
            (${percent}%)
        </p>

        <p>
            <strong>Correct:</strong>
            ${correct}
        </p>

        <p>
            <strong>Missed:</strong>
            ${missed}
        </p>

        <p>
            <strong>Time:</strong>
            ${minutes}m ${seconds}s
        </p>

        <h2 style="
            color:
            ${
                percent >= 70
                ? "green"
                : "red"
            };
        ">
            ${
                percent >= 70
                ? "PASS ✅"
                : "FAIL ❌"
            }
        </h2>
    `;

    document
        .getElementById(
            "score"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}

document.addEventListener(
    "DOMContentLoaded",
    updateProgressTracker
);