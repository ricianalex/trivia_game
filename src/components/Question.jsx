import { useState, useEffect } from "react"


export default function Question({question, correct_answer, incorrect_answers, id, selectedAnswer, onAnswerClick, checkingAnswers, hasPickedAnswer}) {
    const allAnswers = [correct_answer, ...incorrect_answers]

    function shuffle(array) {
        const shuffledArray = [...array]
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const swapIndex = Math.floor(Math.random() * (i + 1))
            const temp = shuffledArray[i]
            shuffledArray[i] = shuffledArray[swapIndex]
            shuffledArray[swapIndex] = temp
        }
        return shuffledArray
    }

    const [shuffledAnswers] = useState(() => shuffle(allAnswers))

    return (
        <div className="question-container">
            <h2>{question}</h2>
            <div className="answers-container">
                {shuffledAnswers.map(answer => {
                    let className = "answer"
                    if(selectedAnswer === answer){
                        className += " selected-answer"
                    }
                    if (checkingAnswers) {
                        if(correct_answer === answer){
                            className += " correct-answer"
                        } else if(selectedAnswer === answer && selectedAnswer !== correct_answer) {
                            className += " selected-wrong-answer transparent-answer"
                        } else { className += " transparent-answer"}
                    } 
                    return <button className={className} onClick={(event) => onAnswerClick(event, id, answer)} disabled={hasPickedAnswer}>{answer}</button>})}
            </div>
        </div>
    )
}

