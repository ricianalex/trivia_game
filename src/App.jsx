import { useState, useEffect } from 'react'
import Question from "./components/Question"
import StartQuiz from "./components/StartQuiz"
import he from "he"
import { nanoid } from 'nanoid'

export default function App() {
  const [quiz, setQuiz] = useState()
  const [allChecked, setAllChecked] = useState(false)
  const [resetGame, setResetGame] = useState(false)
  const [startGame, setStartGame] = useState(false)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(0)

  useEffect(() => {
    async function getQuiz() {
      console.log("Fetching!")
      const url = "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple"
      const response = await fetch(url)
      const json = await response.json()
      const {results} = json
      const decodedResults = results.map((item) => {
        return {
          ...item,
          id: nanoid(),
          selectedAnswer: "",
          checkingAnswers: false,
          question: he.decode(item.question),
          correct_answer: he.decode(item.correct_answer),
          incorrect_answers: item.incorrect_answers.map(incorrect => he.decode(incorrect))
        }
      })
      setQuiz(decodedResults)
    }
    getQuiz()
  }, [resetGame])

  function quizLive() { 
    return quiz.map(element => {
        return <Question 
          key={element.id}
          question={element.question}
          correct_answer={element.correct_answer}
          incorrect_answers={element.incorrect_answers}
          selectedAnswer={element.selectedAnswer}
          id={element.id}
          onAnswerClick={onAnswerClick}
          checkingAnswers={element.checkingAnswers}
        />
      })}

    function onStartGame() {
      setStartGame(true)
    }

    function onAnswerClick(event, id) {
      setQuiz(oldQuiz => oldQuiz.map(quizElement => {
        if(quizElement.id === id) {
          return {...quizElement, selectedAnswer: event.target.innerText}
        } else { return quizElement}
      }))
      quiz.forEach(element => {
        if(element.selectedAnswer === element.correct_answer){ setAnsweredCorrectly(answeredCorrectly + 1)}
      })
    }

    function checkAnswers() {
      setQuiz(oldQuiz => oldQuiz.map(quizElement => {
        return {
          ...quizElement,
          checkingAnswers: !quizElement.checkingAnswers
        }
      }))
      setAllChecked(true)
    }

    function onResetGame() {
      setResetGame(prevState => !prevState)
      setAllChecked(false)
    }

    const correctAnswers = <span>You scored {answeredCorrectly}/5 correct answers</span> 

    const gameRunning = allChecked ? <button className='check--button' onClick={onResetGame}>Reset Game</button> : <button className='check--button' onClick={checkAnswers}>Check Answers</button>

  return (
    <div className='container'>
        {startGame ? quizLive() : <StartQuiz /> }
        <div className='finished-game'>
          {allChecked && correctAnswers}
          {startGame ? gameRunning : <button className='check--button' onClick={onStartGame}>Start Game</button>}
        </div>
    </div>
  )
}

