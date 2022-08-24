import { useState, useEffect } from 'react'
import Question from "./components/Question"
import StartQuiz from "./components/StartQuiz"
import he from "he"
import { nanoid } from 'nanoid'

export default function App() {
  const [quiz, setQuiz] = useState()

  useEffect(() => {
    async function getQuiz() {
      console.log("Fetching!")
      const url = "https://opentdb.com/api.php?amount=5&category=9&type=multiple"
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
  }, [])

  function quizLive() { 
    console.log(quiz)
    return quiz.map(element => {
        return <Question 
          question={element.question}
          correct_answer={element.correct_answer}
          incorrect_answers={element.incorrect_answers}
          selectedAnswer={element.selectedAnswer}
          id={element.id}
          onAnswerClick={onAnswerClick}
          checkingAnswers={element.checkingAnswers}
        />
      })}

    function onAnswerClick(event, id) {
      setQuiz(oldQuiz => oldQuiz.map(quizElement => {
        if(quizElement.id === id) {
          return {...quizElement, selectedAnswer: event.target.innerText}
        } else { return quizElement}
      }))
    }

    function checkAnswers() {
      setQuiz(oldQuiz => oldQuiz.map(quizElement => {
        return {
          ...quizElement,
          checkingAnswers: !quizElement.checkingAnswers
        }
      }))
    }

  return (
    <div className='container'>
        {quiz ? quizLive() : <StartQuiz /> }
        <button className='check--button' onClick={checkAnswers}>Check Answers</button>
    </div>
  )
}

