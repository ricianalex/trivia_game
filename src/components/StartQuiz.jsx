
export default function StartQuiz({difficulty, category, updateCategory, updateDifficulty}) {

    return (
        <div className="start-quizz">
            <h1>Quizzical</h1>
            <p>Test your knowledge!</p>
            <p>Before you start, chose a category and a difficulty level</p>
            <select
                    value={category}
                    onChange={(event) => updateCategory(event)}
                >
                    <option value="">category</option>
                    <option value="9">General Knowledgde</option>
                    <option value="15">Video Games</option>
                    <option value="17">Science and nature</option>
                    <option value="18">Computers</option>
                    <option value="22">Geography</option>
                    <option value="23">History</option>
            </select> 
            <select 
                    value={difficulty}
                    onChange={(event) => updateDifficulty(event)}
                    className="select--difficulty"
                >
                    <option value="">difficulty level</option>
                    <option value="easy">easy</option>
                    <option value="medium">medium</option>
                    <option value="hard">hard</option>
            </select> 
        </div>
    )
}
