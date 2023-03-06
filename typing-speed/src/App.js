
import randomWords from 'random-words'
import {useState} from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Profile from "./Profile.js";

const words_num = 150
const time = "Ready"
function App() {

  const [button, setButton] = useState("Start")
  const [text, setText] = useState([])
  const [timer, setTimer] = useState(time)
  const [timerClass, setTimerClass] = useState("timerB")
  const [read, setRead] = useState( true)
  const [running, setRun] = useState( false)
  const [correct, setCorrect ] = useState(Array(150))
  const [userWords, setUserWords ] = useState(Array(150))
  const [finished, setFinished] = useState(false)
  const [correctNum, setCorrectNum] = useState(-1)
  const [inter, setInter] = useState("")

  const [currWord, setCurrWord] = useState(0);
  const [charInWord, setCharInWord] = useState(0)

  const [wordIn, setWordIn] = useState("")

  const [results, setResults] = useState("resultDisabled")
  const [resultTextWPM, setResultTextWPM] = useState("")
  const [resultTextA, setResultTextA] = useState("")

  const [accuracy, setAccuracy] = useState(false)



  function textGenerator ()
  {
    return new Array(words_num).fill(null).map(() => randomWords())
  }




  //test runner
  async function startTest() {

    //resets vars and interval and clears user input
    if (button === "Restart") {
      setButton("Start")
      setText([])
      setUserWords(Array(150))
      setTimer("Ready")
      setTimerClass("timerB")
      setRead(true)
      setRun(false)
      setCorrect(Array(150))
      setFinished(false)
      setCorrectNum(-1)
      setCharInWord(0)
      setCurrWord(0)
      setWordIn("")
      setResults("resultDisabled")
      clearInterval(inter)
      document.querySelector("textarea").value = ""

      return;
    }

    //setups text and focus users on text box

    await new Promise(resolve => setTimeout(resolve, 500))
    setTimer("Set")
    await new Promise(resolve => setTimeout(resolve, 1100))
    setTimer("Go")
    await new Promise(resolve => setTimeout(resolve, 700))
    setTimer(60)


    setCorrectNum(0)
    setText(textGenerator())
    setButton('Restart')
    setRead(false)
    setRun(true)
    setCursor()

    //timer
    let interval = setInterval(() => {
      setTimer((current) => {
        if (current > 0) {
          if (current < 11) {
            setTimerClass("timerRS")
          } else if (current < 40) {
            setTimerClass("timerY")
          } else {
            setTimerClass("timerG")
          }
          return current - 1;
        }
        //finish get results and displays
        else {


          setRead(true)
          setTimerClass("timerB")
          clearInterval(interval)
          setCorrectNum(wordPerMin())
          if (correctNum > 38) {
            setResultTextWPM("resultTextG")
          } else {
            setResultTextWPM("resultTextY")
          }


          setRun(false)
          setFinished(true)
          setResults("results")
          getAccuracy()
          return "Finished"
        }

      })
    }, 1000)
    setInter(interval)


  }








  //this function focus users on textbox
  function setCursor()
  {

    document.querySelector("textarea").focus();
    document.querySelector("textarea").setSelectionRange(0,0);

  }

  //checks the user input for buttons like back space
  function inputHandler ({keyCode, key})
  {
    if(read)
    {
      return;
    }
    let userWord = wordIn.split(" ");

    //backspace
    if(keyCode === 8)
    {

      //if at start of a word go back
      if(charInWord <= 0)
      {
        //if user word is same size as actual
        if(userWord[currWord-1].length === text[currWord-1].length)
        {
          setCharInWord(text[currWord-1].length -1)
          setCurrWord(currWord-1)
        }
        //user word bigger than actual
        else if(userWord[currWord-1].length > text[currWord-1].length)
        {
          setCharInWord
          (text[currWord-1].length  +(userWord[currWord-1].length - text[currWord-1].length ))
          setCurrWord(currWord-1)
        }
        //user word smaller than actual
        else if(userWord[currWord-1].length < text[currWord-1].length)
        {
          setCharInWord
          (text[currWord-1].length -(text[currWord-1].length -userWord[currWord-1].length))
          setCurrWord(currWord-1)
        }

      }
      else
      {
        setCharInWord(charInWord -1)
      }


    }
    //space bar move to next word
    else if (keyCode === 32)
    {
      if(charInWord != 0)
      {
        setCurrWord(currWord +1)
        setCharInWord(0)
      }
      else
      {

        let newIn = wordIn.substring(0, wordIn.length -1)
        setWordIn(newIn)
      }

    }
    else
    {

      setCharInWord(charInWord+1)

    }


  }


  //compares the characters inputted to actually to color text as well as determine number of correct
  function charCompare( wordI, char,charI)
  {
    const userWord = wordIn.split(" ");

    if(wordI === currWord && charI === charInWord){
      return"greenChar"
    }
    else if( wordI < currWord || ( wordI === currWord && userWord[wordI] === text[wordI]))
    {
      if(text[wordI] === userWord[wordI])
      {
        correct[wordI] = 1;
        return "blueChar"
      }
      else
      {
        correct[wordI] = 0;
        return "redChar"
      }
    }
    else if(wordI === currWord && charI < charInWord )
    {
      if(userWord[wordI][charI] === text[wordI][charI])
      {
        return"blueChar"
      }
      else
      {
        return "redChar"
      }
    }

  }


  function wordPerMin()
  {
    let count = 0;
    for( let i = 0; i < correct.length; i++)
    {
      if(correct[i])
      {
        count++;
      }
    }
    return  count;
  }

  function getAccuracy()
  {
    if(!finished || accuracy)
    {
      return "";
    }


    if((Math.round((correctNum/(currWord+1))*10000)/100) >70)
    {
      setResultTextA("resultTextG")
    }
    else
    {
      setResultTextA("resultTextY")
    }
    setAccuracy(true)

    //color of wpm
    if (correctNum > 38) {
      setResultTextWPM("resultTextG")
    } else {
      setResultTextWPM("resultTextY")
    }
    return "";
  }

  return (
      <div className="App">
        <header className="App-header">
          <h1>Typing Speed Test </h1>
          <div className="headerContainer">
            <div className ={results}>
              <h5> Words Per Min</h5>
              <h3 className={resultTextWPM}> {correctNum}</h3>
            </div>
            <h2 className={timerClass}>{timer}</h2>
            <div className ={results}>
              <h5>Accuracy</h5>
              {charInWord != 0 &&(    <h3 className={resultTextA}> {Math.round((correctNum/(currWord+1))*10000)/100+"% "} {getAccuracy()}</h3>)}
              {charInWord == 0 &&(    <h3 className={resultTextA}> {Math.round((correctNum/(currWord))*10000)/100+"% "} {getAccuracy()}</h3>)}
            </div>
          </div>

        </header>
        {running && (
            <div className="UserContainer" id="currWord">
          <label className="content" >{ wordIn.split(" ")[currWord]}</label>
        </div>)}
        {running  && (
            <div className="container">
              <div className="content">
                {text.map((word, i) => (
                    <>
                            <span>
                             {word.split("").map((char, iChar) =>
                                 (
                                     <span className={charCompare(i, char, iChar)}>{char}</span>
                                 ) )}
                           </span>
                      <span> </span>
                    </>

                ))}
              </div>


            </div>
        )
        }
        {!running && (

            <div className="container">
              {finished && (

                  <div className="content">
                    {text.map((word, i) => (
                        <>
                            <span>
                             {word.split("").map((char, iChar) =>
                                 (
                                     <span className={charCompare(i, char, iChar)}>{char}</span>
                                 ) )}
                            </span>
                          <span> </span>
                        </>

                    ))}
                  </div>)}

              <div className="content">
                { correctNum === -1 &&
                ("Press Start When Ever Ready") }

              </div>
            </div>

        )}

        <div className="section">
          <button className="startButton" id="button" onClick={startTest}>{button}</button>

        </div>
        <div className="userInActive">
          <form >
                   <textarea  spellCheck={"false"} readOnly={read} onKeyDown={inputHandler} onChange={(e) => setWordIn(e.target.value)} value={wordIn}>

                   </textarea>
          </form>


        </div>



      </div>
  );
}

export default App;
