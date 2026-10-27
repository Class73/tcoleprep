let currentQuiz = [];

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

function startExam(count) {

    currentQuiz =
        shuffle(window.masterBank)
        .slice(0, count);

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

    currentQuiz.forEach((q, index) => {

        const questionDiv =
            document.createElement("div");

        questionDiv.className =
            "question";

        questionDiv.id =
            "question-" + q.id;

        questionDiv.innerHTML = `
            <h3>
                ${index + 1}. ${q.prompt}
            </h3>

            ${q.options.map(opt => `
                <label>
                    <input
                        type="radio"
                        name="${q.id}"
                        value="${opt.id}">
                    ${opt.id}. ${opt.text}
                </label>
                <br>
            `).join("")}
        `;

        quizContainer.appendChild(
            questionDiv
        );
    });
}

function gradeQuiz() {

    if (!currentQuiz.length) {
        alert(
            "Start an exam first."
        );
        return;
    }

    let correct = 0;

    currentQuiz.forEach(q => {

        const selected =
            document.querySelector(
                `input[name="${q.id}"]:checked`
            );

        const questionDiv =
            document.getElementById(
                "question-" + q.id
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

        const isCorrect =
            userAnswer &&
            q.answer.includes(
                userAnswer
            );

        const correctAnswer =
            q.answer[0];

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
                <strong>
                    Your Answer:
                </strong>
                ${
                    userAnswer
                    ? `${userAnswer} - ${userOption?.text || ""}`
                    : "No Answer"
                }
            </p>

            <p>
                <strong>
                    Correct Answer:
                </strong>
                ${correctAnswer}
                -
                ${correctOption?.text || ""}
            </p>

            <p>
                <strong>
                    Explanation:
                </strong>
                ${
                    q.explain ||
                    "No explanation provided."
                }
            </p>
        `;

        questionDiv.appendChild(
            review
        );
    });

    const total =
        currentQuiz.length;

    const missed =
        total - correct;

    const percent =
        Math.round(
            (correct / total) * 100
        );

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
        .getElementById("score")
        .scrollIntoView({
            behavior: "smooth"
        });
}