let quizarea, answers, submit, countdown, resultsContainer;
let curent =0;
let rightAnswer =0;
let countdowninterval;
document.getElementById("html-quiz").addEventListener("click", function() {
    startQuiz('html');
});
document.getElementById("Css-quiz").addEventListener("click", function() {
    startQuiz('Css');
});

document.getElementById("javascript-quiz").addEventListener("click", function() {
    startQuiz('javascript');
});
function startQuiz(category) {
    document.querySelector(".start-screen").style.display = "none";
    createQuizElements();
    document.querySelector(".category span").textContent = category.toUpperCase() ;

    getOusttions(category); 
}
function createQuizElements() {
    const quizApp = document.createElement("div");
    quizApp.className = "quiz-app";
    
    quizApp.innerHTML = `
        <div class="quiz-info">
            <div class="category">Category: <span></span></div>
            <div class="count">Questions Count: <span></span></div>
        </div>
        <div class="quiz-area"></div>
        <div class="answers-area"></div>
        <button class="submit-button">Submit Answer</button>
        <div class="bullets">
            <div class="spans"></div>
            <div class="countdown"></div>
        </div>
        <div class="results"></div>
    `;
    
    document.body.appendChild(quizApp);
     count = document.querySelector(".count span");
     bulletsSpanContainer  = document.querySelector(".bullets .spans");
     quizarea = document.querySelector(".quiz-area");
     answers = document.querySelector(".answers-area");
     submit = document.querySelector(".submit-button");
     bullets = document.querySelector(".bullets");
     resultsContainer = document.querySelector(".results");
     countdown = document.querySelector(".countdown");
}
function getOusttions() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
        let questionsObject = JSON.parse(this.responseText);
        console.log(questionsObject);
        countandcreatebolets(questionsObject.length)
        // let qCount = questionsObject.length;
        addQustion(questionsObject[curent], questionsObject.length);
        countDown(150,questionsObject.length);
        submit.onclick= ()=>{
            let rightanswer = questionsObject[curent].right_answer;
            //console.log(rightanswer);
            curent++;
            checkAnswer(rightanswer ,questionsObject.length);
            quizarea.innerHTML='';
            answers.innerHTML='';
            addQustion(questionsObject[curent], questionsObject.length);
            handleBullets();
            clearInterval(countdowninterval);
            countDown(150,questionsObject.length);
            showresult(questionsObject.length)
        };
        }
        
    };
    request.open("get","html_questions.json");
    request.send();
}
getOusttions()

function countandcreatebolets (num){
    count.innerHTML=num
    for (let i = 0; i < num; i++) {
       
        let createboletes = document.createElement('span');
        if (i===0) {
            createboletes.className= "on"
        }
        bulletsSpanContainer .appendChild(createboletes)
    }
}
function addQustion(obj,count) {
    if(curent<count){

        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(obj.title);
        questionTitle.appendChild(questionText);
        quizarea.appendChild(questionTitle);
    
        //answer area 
        for (let i = 1; i <= 4; i++) {
            
            let maindiv = document.createElement('div');
            maindiv.className='answer';
            let radioinput = document.createElement('input');
            radioinput.type='radio';
            radioinput.name='question';
            radioinput.id=`answer_${i}`;
            radioinput.dataset.answer =obj[`answer_${i}`];
            let thelabel = document.createElement('label');
            thelabel.htmlFor=`answer_${i}`
            thelabel.textContent=obj[`answer_${i}`]
            maindiv.appendChild(radioinput);
            maindiv.appendChild(thelabel);
            answers.appendChild(maindiv);
            
        }
    }
        
}

function checkAnswer(rightanswer , length){
    let answers = document.getElementsByName("question");
    let thechosen;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            thechosen = answers[i].dataset.answer;
        }
    }
    if (rightanswer===thechosen) {
        rightAnswer++
    }
   
}
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
      if (curent === index) {
        span.className = "on";
      }
    });
}
function showresult(count){
    let theResults ;
    if (curent=== count) {
        quizarea.remove();
        answers.remove();
        submit.remove()
        bullets.remove()
        if (rightAnswer > count / 2 && rightAnswer < count) {
            theResults = `<span class="good">Good</span> , ${rightAnswer} From ${count}`;
        } else if (rightAnswer === count) {
            theResults = `<span class="perfect">Perfect</span> , ${rightAnswer} From ${count}`;
        } else {
            theResults = `<span class="bad">Bad</span> , ${rightAnswer} From ${count}`;
        }
    
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }
}
function countDown(duration , count) {
    if (curent<count) {
        let minutes , second ;
        countdowninterval =setInterval(()=>{
            minutes = parseInt(duration/60);
            second = parseInt(duration%60);
            minutes = minutes < 10 ? `0${minutes}`: minutes;
            second = second < 10 ? `0${second}`: second;
            countdown.innerHTML=`${minutes}:${second}`
            if (--duration<0) {
                clearInterval(countdowninterval);
                submit.click();
                console.log(`finshed`);
                
            }
        },1000)
    }
    
}