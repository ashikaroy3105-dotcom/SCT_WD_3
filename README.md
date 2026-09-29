# Quiz Game Application

An interactive quiz game built with plain HTML, CSS and JavaScript. It displays questions one at a time, collects answers, gives instant feedback and shows a final score with a full answer review.

Built as **Task 03** of the Web Development Internship at SkillCraft Technology.

## Task Requirements

| Requirement | How it is done |
|---|---|
| Display questions | One question per screen, with a question counter and progress bar |
| Collect answers | Radio options, checkbox options, or a text box, depending on the question type |
| Provide a score at the end | Result screen with score, percentage, a message and a review of every answer |
| Different question types (optional) | Single select, multi select and fill in the blank |

## Features

- 10 questions on HTML, CSS and JavaScript
- Three question types: **single select**, **multi select** (all correct options needed) and **fill in the blank** (not case sensitive)
- Question order is shuffled on every play
- Instant feedback after each answer, with the correct answer shown when wrong
- Correct and wrong answers are marked with color and a text label
- Live score and progress bar
- Result screen with score, percentage and a review of all answers
- Play again button
- Keyboard support: `1`-`4` to choose an option, `Enter` to submit and continue
- Responsive layout for phones, tablets and desktops
- Visible focus outlines, screen reader friendly feedback and reduced-motion support

## Technologies Used

- **HTML5** for structure
- **CSS3** for styling (Flexbox, Grid, CSS variables, media queries)
- **JavaScript (ES6)** for quiz logic, scoring and DOM updates
- **Google Fonts** (Bricolage Grotesque and Figtree)

## Project Structure

```
quiz/
├── index.html    # Start, quiz and result screens
├── style.css     # Styles and responsive rules
├── script.js     # Questions, quiz logic, scoring, keyboard support
└── README.md     # Project documentation
```

## How to Run

1. Download or clone this repository.
2. Open the folder in **VS Code**.
3. Install the **Live Server** extension.
4. Right-click `index.html` and choose **Open with Live Server**.

You can also open `index.html` directly in a modern browser.

## How to Add Your Own Questions

All questions are stored in the `QUESTIONS` list at the top of `script.js`. Copy one of the existing objects and change it:

```js
// Single select: answer is the index of the correct option (starts at 0)
{ type: "single", question: "Your question?", options: ["A", "B", "C", "D"], answer: 1 }

// Multi select: answer is a list of correct indexes
{ type: "multi", question: "Pick all that apply.", options: ["A", "B", "C", "D"], answer: [0, 2] }

// Fill in the blank: answer is a list of accepted answers
{ type: "fill", question: "The tag for a link is ____.", answer: ["a", "<a>"] }
```

The quiz length, progress bar and score update automatically.

## How It Works

**State:** the app keeps track of the shuffled question order, the current question, the score, and a log of every answer.

**Checking answers:** single select compares the chosen index with the correct index. Multi select sorts both lists and compares them, so every correct option is required and no wrong option is allowed. Fill in the blank ignores capital letters and spaces.

**Screens:** the start, quiz and result screens are three sections. The `show()` function displays one and hides the others.

## Testing Checklist

- [ ] Start button opens the first question
- [ ] Submit stays disabled until an answer is chosen or typed
- [ ] Single select accepts only one option
- [ ] Multi select accepts several options and needs all correct ones
- [ ] Fill in the blank accepts the answer in any letter case
- [ ] Feedback shows correct or wrong with the right answer
- [ ] Score and progress bar update after each question
- [ ] Result screen shows the score, percentage and review list
- [ ] Play again restarts with a new question order
- [ ] Keys 1-4 and Enter work
- [ ] Layout looks correct on a phone-size screen

