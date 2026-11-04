/*
=========================================================
quiz-engine-v2.js
Adds automatic subject quizzes WITHOUT modifying questions.

Requires:
    master-bank.js
    subject-index.js

index.html:

<script src="master-bank.js"></script>
<script src="subject-index.js"></script>
<script src="quiz-engine-v2.js"></script>

=========================================================
*/

let currentQuiz = [];
let timerInterval = null;
let secondsElapsed = 0;
let seenQuestions =
    new Set(
        JSON.parse(
            localStorage.getItem("seenQuestions") || "[]"
        )
    );

/* -----------------------------
    TIMER
----------------------------- */

function startTimer() {

    clearInterval(timerInterval);

    secondsElapsed = 0;

    updateTimer();

    timerInterval = setInterval(() => {

        secondsElapsed++;

        updateTimer();

    }, 1000);
}

function stopTimer() {

    clearInterval(timerInterval);
}

function updateTimer() {

    const timer =
        document.getElementById("timer");

    if (!timer) return;

    const mins =
        String(
            Math.floor(secondsElapsed / 60)
        ).padStart(2, "0");

    const secs =
        String(
            secondsElapsed % 60
        ).padStart(2, "0");

    timer.innerHTML =
        `Time: ${mins}:${secs}`;
}

/* -----------------------------
    UTILITIES
----------------------------- */

function shuffle(arr) {

    const copy = [...arr];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [copy[i], copy[j]] =
            [copy[j], copy[i]];
    }

    return copy;
}

function saveSeenQuestions() {

    localStorage.setItem(
        "seenQuestions",
        JSON.stringify([...seenQuestions])
    );
}

/* -----------------------------
    PROGRESS TRACKER
----------------------------- */

function updateProgressTracker() {

    const tracker =
        document.getElementById(
            "progressTracker"
        );

    if (!tracker) return;

    const total =
        masterBank.length;

    const seen =
        seenQuestions.size;

    const pct =
        Math.round(
            (seen / total) * 100
        );

    tracker.innerHTML =
        `Questions Seen: ${seen} / ${total} (${pct}% Complete)`;
}

function resetSeenQuestions() {

    seenQuestions.clear();

    saveSeenQuestions();

    updateProgressTracker();

    alert(
        "Question history reset."
    );
}

/* -----------------------------
    EXAM BUILDERS
----------------------------- */

function startExam(count) {

    let available =
        masterBank.filter(
            q => !seenQuestions.has(q.id)
        );

    if (
        available.length < count
    ) {

        seenQuestions.clear();

        available = [...masterBank];
    }

    currentQuiz =
        shuffle(available)
            .slice(0, count);

    currentQuiz.forEach(
        q => seenQuestions.add(q.id)
    );

    saveSeenQuestions();

    updateProgressTracker();

    startTimer();

    renderQuiz();
}

function startSubjectExam(
    subject,
    count = 5
) {

    if (
        !window.subjectBank ||
        !window.subjectBank[subject]
    ) {

        alert(
            `No questions for ${subject}`
        );

        return;
    }

    let bank =
        window.subjectBank[subject];

    let available =
        bank.filter(
            q => !seenQuestions.has(q.id)
        );

    if (
        available.length < count
    ) {

        available = bank;
    }

    currentQuiz =
        shuffle(available)
            .slice(0, count);

    currentQuiz.forEach(
        q => seenQuestions.add(q.id)
    );

    saveSeenQuestions();

    updateProgressTracker();

    startTimer();

    renderQuiz();
}

/* -----------------------------
    QUIZ RENDER
----------------------------- */

function renderQuiz() {

    const container =
        document.getElementById(
            "quizContainer"
        );

    const scoreDiv =
        document.getElementById(
            "score"
        );

    scoreDiv.innerHTML = "";

    container.innerHTML = "";

    currentQuiz.forEach(
        (q, index) => {

            const question =
                document.createElement(
                    "div"
                );

			question.className =
				"question";

			question.id =
				`question-${index}`;

            let html =
                `<h3>${index + 1}. ${q.prompt}</h3>`;

            const isCheckbox =
                Array.isArray(q.answer);

            q.options.forEach(
                option => {

                    html += `
                    <label>
                        <input
                            type="${
                                isCheckbox
                                    ? "checkbox"
                                    : "radio"
                            }"
                            name="question_${index}"
                            value="${option.id}">
                        ${option.id}. ${option.text}
                    </label>
                    <br>
                    `;
                }
            );

            question.innerHTML =
                html;

            container.appendChild(
                question
            );
        }
    );
}

/* -----------------------------
    GRADING
----------------------------- */

function gradeQuiz() {

    stopTimer();

    let score = 0;

    const scoreDiv =
        document.getElementById(
            "score"
        );

    scoreDiv.innerHTML = "";

    currentQuiz.forEach(
        (q, index) => {

            const box =
                document.querySelectorAll(
                    `[name="question_${index}"]`
                );

            const selected =
                [...box]
                    .filter(
                        x => x.checked
                    )
                    .map(
                        x => x.value
                    );

            let correct =
                false;

            if (
                Array.isArray(q.answer)
            ) {

                correct =
                    selected.length ===
                    q.answer.length &&
                    q.answer.every(
                        a =>
                            selected.includes(a)
                    );
            }
            else {

                correct =
                    selected[0] ===
                    q.answer;
            }

            if (correct) score++;

            const questionDiv =
    document.getElementById(
        `question-${index}`
    );
	questionDiv.classList.remove(
    "correct",
    "incorrect"
);

questionDiv.classList.add(
    correct
        ? "correct"
        : "incorrect"
);

const oldReview =
    questionDiv.querySelector(
        ".answer-review"
    );

if (oldReview) {
    oldReview.remove();
}

const review =
    document.createElement(
        "div"
    );

review.className =
    "answer-review";

review.style.marginTop =
    "10px";

review.innerHTML = `
    <strong>
        ${
            correct
                ? "✅ Correct"
                : "❌ Incorrect"
        }
    </strong>
    <br><br>

    <strong>
        Your Answer:
    </strong>
    ${
        selected.length
            ? selected.join(", ")
            : "No Answer"
    }

    <br><br>

    <strong>
        Correct Answer:
    </strong>
    ${
        Array.isArray(q.answer)
            ? q.answer.join(", ")
            : q.answer
    }

    <br><br>

    <strong>
        Explanation:
    </strong>
    <br>
    ${
        q.explain ||
        "No explanation."
    }
`;

questionDiv.appendChild(
    review
);
        }
    );

    const pct =
        (
            score /
            currentQuiz.length *
            100
        ).toFixed(1);

    scoreDiv.insertAdjacentHTML(
        "afterbegin",
        `
        <h2>
            Score:
            ${score}
            /
            ${currentQuiz.length}
            (${pct}%)
        </h2>
        `
    );
}

/* -----------------------------
    SUBJECT BUTTONS
----------------------------- */

function renderSubjectButtons() {

    const target =
        document.getElementById(
            "subjectButtons"
        );

    if (!target) return;

    target.innerHTML = `
        <h3>
            Subject Study Mode
        </h3>

        <p>
            Click a subject to launch a
            focused 5-question quiz.
        </p>
    `;

    Object.keys(subjectBank)
        .sort()
        .forEach(subject => {

            const btn =
                document.createElement(
                    "button"
                );

            btn.textContent =
                `${subject}
                (${subjectBank[subject].length})`;

            btn.onclick =
                () =>
                    startSubjectExam(
                        subject,
                        5
                    );

            target.appendChild(
                btn
            );
        });
}

/* -----------------------------
    INIT
----------------------------- */

window.onload = () => {

    updateProgressTracker();

    renderSubjectButtons();
};