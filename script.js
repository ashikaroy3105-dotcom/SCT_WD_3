/* ---------- Questions (edit or add your own here) ----------
   single : one correct option      -> answer: index of the correct option
   multi  : several correct options -> answer: array of correct indexes
   fill   : typed answer            -> answer: array of accepted answers
------------------------------------------------------------ */
const QUESTIONS = [
  {
    type: "single",
    question: "Which HTML tag creates the largest heading?",
    options: ["<h1>", "<head>", "<heading>", "<h6>"],
    answer: 0
  },
  {
    type: "single",
    question: "Which CSS property changes the color of text?",
    options: ["font-color", "color", "text-color", "foreground"],
    answer: 1
  },
  {
    type: "single",
    question: "Which symbol is used to select a class in CSS?",
    options: [".", "#", "*", "&"],
    answer: 0
  },
  {
    type: "multi",
    question: "Which of these are data types in JavaScript?",
    options: ["String", "Boolean", "Float", "Undefined"],
    answer: [0, 1, 3]
  },
  {
    type: "fill",
    question: "In CSS, position: ____ keeps an element on the screen while the page scrolls, like the navbar in a fixed header.",
    answer: ["fixed"]
  },
  {
    type: "single",
    question: "Which array method adds an item to the end of an array in JavaScript?",
    options: ["pop()", "shift()", "push()", "add()"],
    answer: 2
  },
  {
    type: "multi",
    question: "Which keywords can declare a variable in modern JavaScript?",
    options: ["var", "let", "const", "int"],
    answer: [0, 1, 2]
  },
  {
    type: "fill",
    question: "Complete the code: document.____(\"navbar\") selects the element with the id navbar.",
    answer: ["getElementById"]
  },
  {
    type: "single",
    question: "Which CSS layout system is built for rows and columns together (two dimensions)?",
    options: ["Flexbox", "Float", "Grid", "Inline-block"],
    answer: 2
  },
  {
    type: "multi",
    question: "Which of these are semantic HTML elements?",
    options: ["<nav>", "<div>", "<footer>", "<article>"],
    answer: [0, 2, 3]
  }
];

/* ---------- Elements ---------- */
const $ = id => document.getElementById(id);
const screens = { start: $("start-screen"), quiz: $("quiz-screen"), result: $("result-screen") };
const counterEl = $("counter");
const scoreLiveEl = $("score-live");
const barEl = document.querySelector(".bar");
const barFill = $("bar-fill");
const questionEl = $("question");
const hintEl = $("type-hint");
const optionsEl = $("options");
const feedbackEl = $("feedback");
const submitBtn = $("submit-btn");
const nextBtn = $("next-btn");

/* ---------- State ---------- */
let order = [];      // questions in the order they are asked
let current = 0;
let score = 0;
let answered = false;
let answerLog = [];    // { q, given, ok } for the review list

/* ---------- Helpers ---------- */
function show(name) {
  Object.entries(screens).forEach(([key, el]) => { el.hidden = key !== name; });
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const normalize = s => s.trim().toLowerCase().replace(/\s+/g, "");

function correctText(q) {
  if (q.type === "single") return q.options[q.answer];
  if (q.type === "multi")  return q.answer.map(i => q.options[i]).join(", ");
  return q.answer[0];
}

function givenText(q, given) {
  if (q.type === "single") return given === null ? "No answer" : q.options[given];
  if (q.type === "multi")  return given.length ? given.map(i => q.options[i]).join(", ") : "No answer";
  return given.trim() || "(blank)";
}

function getGiven(q) {
  if (q.type === "fill") return $("fill-input").value;
  const checked = [...optionsEl.querySelectorAll("input:checked")].map(i => Number(i.value));
  return q.type === "single" ? (checked.length ? checked[0] : null) : checked;
}

function isCorrect(q, given) {
  if (q.type === "single") return given === q.answer;
  if (q.type === "multi") {
    const a = [...given].sort().join(",");
    const b = [...q.answer].sort().join(",");
    return a === b;
  }
  return q.answer.map(normalize).includes(normalize(given));
}

function hasAnswer() {
  const q = order[current];
  if (q.type === "fill") return $("fill-input").value.trim() !== "";
  return optionsEl.querySelector("input:checked") !== null;
}

/* ---------- Render a question ---------- */
function renderQuestion() {
  const q = order[current];
  answered = false;

  counterEl.textContent = `Question ${current + 1} of ${order.length}`;
  scoreLiveEl.textContent = `Score: ${score}`;
  const pct = Math.round((current / order.length) * 100);
  barFill.style.width = pct + "%";
  barEl.setAttribute("aria-valuenow", pct);

  questionEl.textContent = q.question;
  hintEl.textContent = {
    single: "Choose one answer.",
    multi: "Select all that apply.",
    fill: "Type your answer below."
  }[q.type];

  optionsEl.innerHTML = "";
  optionsEl.className = "options" + (q.type === "multi" ? " multi" : "");
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  if (q.type === "fill") {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "fill-input";
    input.className = "fill-input";
    input.placeholder = "Type your answer";
    input.setAttribute("aria-label", "Your answer");
    input.autocomplete = "off";
    input.spellcheck = false;
    optionsEl.appendChild(input);
  } else {
    q.options.forEach((text, i) => {
      const label = document.createElement("label");
      label.className = "option";
      const input = document.createElement("input");
      input.type = q.type === "multi" ? "checkbox" : "radio";
      input.name = "answer";
      input.value = i;
      const mark = document.createElement("span");
      mark.className = "mark";
      const span = document.createElement("span");
      span.textContent = text;
      label.append(input, mark, span);
      optionsEl.appendChild(label);
    });
  }

  submitBtn.hidden = false;
  submitBtn.disabled = true;
  nextBtn.hidden = true;
  nextBtn.textContent = current === order.length - 1 ? "See results" : "Next question";

  questionEl.focus();
}

/* ---------- Submit an answer ---------- */
function submitAnswer() {
  if (answered || !hasAnswer()) return;
  const q = order[current];
  const given = getGiven(q);
  const ok = isCorrect(q, given);

  answered = true;
  if (ok) score++;
  answerLog.push({ q, given, ok });
  scoreLiveEl.textContent = `Score: ${score}`;

  optionsEl.classList.add("locked");
  if (q.type === "fill") {
    const input = $("fill-input");
    input.disabled = true;
    input.classList.add(ok ? "correct" : "wrong");
  } else {
    const correctSet = q.type === "single" ? [q.answer] : q.answer;
    optionsEl.querySelectorAll(".option").forEach((label, i) => {
      const input = label.querySelector("input");
      input.disabled = true;
      const tag = document.createElement("span");
      tag.className = "tag";
      if (correctSet.includes(i)) {
        label.classList.add("correct");
        tag.textContent = "Correct answer";
        label.appendChild(tag);
      } else if (input.checked) {
        label.classList.add("wrong");
        tag.textContent = "Your answer";
        label.appendChild(tag);
      }
    });
  }

  feedbackEl.className = "feedback " + (ok ? "ok" : "bad");
  feedbackEl.textContent = ok ? "Correct!" : `Not quite. Correct answer: ${correctText(q)}`;

  submitBtn.hidden = true;
  nextBtn.hidden = false;
  nextBtn.focus();
}

function nextQuestion() {
  current++;
  if (current >= order.length) showResult();
  else renderQuestion();
}

/* ---------- Result screen ---------- */
function showResult() {
  show("result");
  const total = order.length;
  const percent = Math.round((score / total) * 100);

  $("final-score").textContent = `${score} / ${total}`;
  $("final-percent").textContent = `${percent}% correct`;
  $("final-message").textContent =
    percent >= 90 ? "Excellent work! You know your web fundamentals." :
    percent >= 70 ? "Great job! Just a few topics left to polish." :
    percent >= 50 ? "Good effort. Review the answers below and try again." :
                    "Keep practicing. Review the answers below and try again.";

  const list = $("review");
  list.innerHTML = "";
  answerLog.forEach((item, i) => {
    const li = document.createElement("li");

    const q = document.createElement("p");
    q.className = "q";
    q.textContent = `${i + 1}. ${item.q.question}`;

    const status = document.createElement("p");
    status.className = "status " + (item.ok ? "ok" : "bad");
    status.textContent = item.ok ? "Correct" : "Incorrect";

    const yours = document.createElement("p");
    yours.textContent = `Your answer: ${givenText(item.q, item.given)}`;

    li.append(q, status, yours);
    if (!item.ok) {
      const right = document.createElement("p");
      right.textContent = `Correct answer: ${correctText(item.q)}`;
      li.appendChild(right);
    }
    list.appendChild(li);
  });

  $("result-title").focus();
}

/* ---------- Start / restart ---------- */
function startQuiz() {
  order = shuffle(QUESTIONS);
  current = 0;
  score = 0;
  answerLog = [];
  show("quiz");
  renderQuestion();
}

/* ---------- Events ---------- */
$("start-btn").addEventListener("click", startQuiz);
$("restart-btn").addEventListener("click", startQuiz);
submitBtn.addEventListener("click", submitAnswer);
nextBtn.addEventListener("click", nextQuestion);

// Selecting options (or typing) enables the Submit button
optionsEl.addEventListener("change", () => {
  optionsEl.querySelectorAll(".option").forEach(label => {
    label.classList.toggle("selected", label.querySelector("input").checked);
  });
  submitBtn.disabled = !hasAnswer();
});
optionsEl.addEventListener("input", () => { submitBtn.disabled = !hasAnswer(); });

// Keyboard: 1-4 choose an option, Enter submits
document.addEventListener("keydown", e => {
  if (screens.quiz.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
  const q = order[current];
  const typing = e.target.matches && e.target.matches('input[type="text"]');

  if (e.key === "Enter") {
    if (e.target.tagName === "BUTTON") return;      // buttons already react to Enter
    if (!answered && !submitBtn.disabled) { e.preventDefault(); submitAnswer(); }
    return;
  }

  if (!typing && !answered && q.type !== "fill" && /^[1-9]$/.test(e.key)) {
    const input = optionsEl.querySelectorAll("input")[Number(e.key) - 1];
    if (input) input.click();
  }
});
