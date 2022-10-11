import { useState, useEffect } from 'react'
import Question from "./components/Question"
import StartQuiz from "./components/StartQuiz"
import he from "he"
import { nanoid } from 'nanoid'

export default function App() {
  const [quiz, setQuiz] = useState()
  const [allChecked, setAllChecked] = useState(false)
  const [startGame, setStartGame] = useState(false)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(0)
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")

  function updateCategory(event) {
    const updatedCatefory = event.target.value
    setCategory(updatedCatefory)
  }

  function updateDifficulty(event) {
    setDifficulty(event.target.value)
    console.log(difficulty)
  }

  const isCatAndDiffSelected = category !== "" && difficulty !== ""

  useEffect(() => {
    console.log("Fetching!")
    async function getQuiz() {
      try {
        const url = `https://opentdb.com/api.php?amount=5&category=${category}&difficulty=${difficulty}&type=multiple`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Something went wrong, server responded with ${response.status}.`)
        }

        const json = await response.json()
        const { response_code, results } = json

        if (response_code === 1) {
          throw new Error("Bad API request - no results!")
        } else if (response_code === 2) {
          throw new Error("Bad API request - invalid parameter")
        }

        const decodedResults = results.map((item) => {
          return {
            ...item,
            id: nanoid(),
            hasPickedAnswer: false,
            selectedAnswer: "",
            checkingAnswers: false,
            question: he.decode(item.question),
            correct_answer: he.decode(item.correct_answer),
            incorrect_answers: item.incorrect_answers.map(incorrect => he.decode(incorrect))
          }
        })
        setQuiz(decodedResults)
      } catch (err) {
        console.error(err)
      }
      
    }
    getQuiz()
  }, [ isCatAndDiffSelected ])

  function renderQuiz() { 
    return quiz.map(element => {
        return <Question 
          key={element.id}
          question={element.question}
          correct_answer={element.correct_answer}
          incorrect_answers={element.incorrect_answers}
          selectedAnswer={element.selectedAnswer}
          id={element.id}
          hasPickedAnswer={element.hasPickedAnswer}
          onAnswerClick={onAnswerClick}
          checkingAnswers={element.checkingAnswers}
        />
      })}

    function onStartGame() {
      if(category !== "" && difficulty !== "") {
      setStartGame(true)
    } else { alert ("You have not chosen a category/difficulty level")}
    }

    function onAnswerClick(event, id) {
      setQuiz(oldQuiz => oldQuiz.map(quizElement => {
        if(quizElement.id === id) {
          return {...quizElement, 
            hasPickedAnswer: !quizElement.hasPickedAnswer, 
            selectedAnswer: event.target.innerText
          }
        } else { return quizElement}
      }))
    }

    function checkAnswers() {
      const allAnswered = quiz.every(element => element.hasPickedAnswer)
      if(allAnswered) {
      quiz.forEach(element => {
        if(element.selectedAnswer === element.correct_answer){ 
          setAnsweredCorrectly(count => count + 1)}
      })
      setQuiz(oldQuiz => oldQuiz.map(quizElement => {
        return {
          ...quizElement,
          checkingAnswers: !quizElement.checkingAnswers
        }
      }))
      setAllChecked(true)} else ( alert ("Make a choice for all questions"))
    }

    function onPlayAgain() {
      setAllChecked(false)
      setAnsweredCorrectly(0)
      setStartGame(false)
      setCategory("")
      setDifficulty("")
    }

    const correctAnswers = <span className='answered-correctly'>You scored {answeredCorrectly}/5 correct answers</span> 

    const isGameRunning = allChecked ? <button className='button button--reset' onClick={onPlayAgain}>Play again</button> : <button className='button' onClick={checkAnswers}>Check Answers</button>

  return (
    <div className='container'>
        {startGame ? renderQuiz() : <StartQuiz difficulty={difficulty} category={category} updateCategory={updateCategory} updateDifficulty={updateDifficulty}/> }
        <div className='finished-game'>
          {allChecked && correctAnswers}
          {startGame ? isGameRunning : <button className='button button--startgame' onClick={onStartGame}>Start Game</button>}
        </div>
    </div>
  )
}

