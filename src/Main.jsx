import { languages } from './languages.js';
import { getFarewellText } from './untils.js'
import { getRandomWord } from './untils.js'
import React from 'react'
import Confetti from 'react-confetti'

export default function Main() {

    const [LanguagesObjectArray, setLanguages] = React.useState(languages);
    const [CurrentWord, setCurrentWord] = React.useState(() => getRandomWord().toLowerCase());
    const [GuessedArray, setGuessed] = React.useState([]);
    const [CorrectLetters, setCorrectLetters] = React.useState([]);
    const [IncorrectGuessCount, setIncorrectGuessCount] = React.useState(0);
    const [IsGameOver, setGameOver] = React.useState({end: false, status: "null"})
    const [LastLanguageLost, setLanguageLost] = React.useState("")

    const SplitCurrentWord = CurrentWord.split("");
    const AlphabetArray = "abcdefghijklmnopqrstuvwxyz".split("");

    function HandleLetterButtonClick(Letter) {
        setGuessed(prevGuessed => {
            if (prevGuessed.includes(Letter)) return prevGuessed;
            
            const newGuessed = [...prevGuessed, Letter];
            CompareGuessed(newGuessed);
            return newGuessed;
        });
    }

    function ResetGame(){
        setLanguages(languages)
        setCurrentWord(() => getRandomWord().toLowerCase())
        setGuessed([])
        setCorrectLetters([])
        setIncorrectGuessCount(0)
        setGameOver({end: false, status: "null"})
        setLanguageLost("")
    }

    function CompareGuessed(updatedGuessedArray) {
        setCorrectLetters(prevCorr => {
            const newCorrectLetters = SplitCurrentWord.filter(letter => updatedGuessedArray.includes(letter));
            const newCorrectToReturn = [...new Set([...prevCorr, ...newCorrectLetters])]
            setLanguageLost("")
            if(newCorrectLetters.length == SplitCurrentWord.length){
                setGameOver({end: true, status: "won"})
            }
            return newCorrectToReturn;
        });
    }

    React.useEffect(() => {
        setIncorrectGuessCount(GuessedArray.length - CorrectLetters.length);
    }, [GuessedArray, CorrectLetters]);

    React.useEffect(() => {
        if (IncorrectGuessCount > 0) {
            setLanguages(prevLang => {
                setLanguageLost(prevLang[0].name)
                let temp = prevLang.slice(1)
                if(temp.length <= 0){
                    setGameOver({end: true, status: "lost"})
                }
                return temp
            });
        }
    }, [IncorrectGuessCount]);



    const WordDisplay = SplitCurrentWord.map((prevWord, index) => {
        if(IsGameOver.status == "lost"){
            if(CorrectLetters.includes(prevWord)){
                return(
                    <span key={index} style={{color: "rgb(54, 167, 54)"}} className='Letters'>
                        {prevWord.toUpperCase()}
                    </span>
                )
            }
            else{
                return(
                    <span key={index} style={{color: "#D02B2B"}} className='Letters'>
                        {prevWord.toUpperCase()}
                    </span>
                )
            }
        }
        else if(IsGameOver.status == "won"){
                return(
                    <span key={index} style={{color: "rgb(54, 167, 54)"}} className='Letters'>
                        {prevWord.toUpperCase()}
                    </span>
                )
            }
        else if(CorrectLetters.includes(prevWord)){
            return (
                <span key={index} className='Letters'>
                    {CorrectLetters.includes(prevWord) ? prevWord.toUpperCase() : ""}
                </span>
            )
        }
        else{
            return (
                <span key={index} className='Letters'>

                </span>
            )
        }
    });

    const AlphabetButtons = AlphabetArray.map(preAlph => (
        <button 
            key={preAlph} 
            style={{
                backgroundColor: CorrectLetters.includes(preAlph) 
                    ? "rgb(54, 167, 54)" 
                    : GuessedArray.includes(preAlph) 
                        ? "#D02B2B" 
                        : ""
            }} 
            onClick={() => HandleLetterButtonClick(preAlph)}
            disabled={IsGameOver.end}
            className='AlphabetLetters'
        >
            {preAlph.toUpperCase()}
        </button>
    ));

    const LanguagesDisplay = LanguagesObjectArray.map(prevLang => (
        <h2 
            key={prevLang.name} 
            className="Languages" 
            style={{ backgroundColor: prevLang.backgroundColor, color: prevLang.color }}
        >
            {prevLang.name}
        </h2>
    ));

    function GameResultSection(){
        if(IsGameOver.status == "won"){
            return (
                <div className="GameResultStatusWon">
                    <h2>You Win!</h2>
                    <p>🎉Congratulations🎉</p>
                </div>)
        }
        else if(IsGameOver.status == "lost"){
            return (
                <div className="GameResultStatusLost">
                    <h2>You Lost!</h2>
                    <p>Try Again</p>
                </div>
            )
        }
        else if(!IsGameOver.end && LastLanguageLost != ""){
            return (
                <div className="LanguageLost">
                    <h2>{getFarewellText(LastLanguageLost)}</h2>
                </div>
            )
        }
    }

    return (
        <main>
            {GameResultSection()}
            <div className="LanguagesCollection">
                {LanguagesDisplay}
            </div>
            <div className='WordToGuess'>
                {WordDisplay}
            </div>
            <div className='AlphabetButtons'>
                {AlphabetButtons}
            </div>
                    {IsGameOver.end ? <button onClick={ResetGame} className='NewGameButton'>New Game</button>: null}
                    {IsGameOver.status == "won" ? <Confetti/> : null}
        </main>
    );
}
