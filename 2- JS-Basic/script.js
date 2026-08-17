const display = document.querySelector(".display span")
const buttons = document.querySelectorAll(".keypad button")
const themeOptions = document.querySelectorAll(".numbers span")
const themeSwitch = document.querySelector(".theme-switch")

let currentInput = "";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;


buttons.forEach((button) =>{
    button.addEventListener("click",() => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            handleInput(value);
        }

        if (action !== undefined) {
            handleAction(action);
        }

    })
});

function handleInput(value){
    if(isNumber(value)){
        enterNumber(value);
        return;
    }
    
    if (value == "."){
        enterDecimal();
        return;
    }

    if(isOperator(value)){
        chooseOperator(value);
    }
}

function handleAction(action) {

    switch (action) {

        case "delete":
            deleteLast();
            break;

        case "reset":
            resetCalculator();
            break;

        case "calculate":
            calculate();
            break;
    }
}

function enterNumber(num){

    if(shouldResetDisplay){
        currentInput="",
        shouldResetDisplay = false
    }

    if (currentInput == "0"){
        currentInput = num;
    } else {
        currentInput += num
    }
    updateDisplay()
}

function enterDecimal(){
    if(shouldResetDisplay){
        currentInput="",
        shouldResetDisplay = false
    }

    if (currentInput.includes(".")){
        return
    }

    if (currentInput === "") {
        currentInput = "0.";
    } else {
        currentInput += ".";
    }
    updateDisplay()
}

function chooseOperator(nextOperator){

    if (currentInput === "" && previousInput === "") {
        return;
    }

    if (operator !== null && currentInput === "") {
        operator = nextOperator;
        return;
    }

    if (operator !== null && previousInput !== "") {
        calculate();
    }

    previousInput = currentInput;
    operator = nextOperator;

    currentInput = "";

}

function calculate() {

    if ( previousInput === "" || currentInput === "" || operator === null) {
        return;
    }

    const firstNumber = Number(previousInput);
    const secondNumber = Number(currentInput);

    let result;


    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;
        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {
                showError();
                return;
            }

            result = firstNumber / secondNumber;
            break;
    }

    result = roundResult(result);

    currentInput = String(result);

    previousInput = "";

    operator = null;

    shouldResetDisplay = true;

    updateDisplay();
}

function updateDisplay() {

    if (currentInput === "") {
        display.textContent = "0";
        return;
    }
    display.textContent = formatNumber(currentInput);
}

function formatNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "Error";
    }
    if (value.endsWith(".")) {
        return Number(value).toLocaleString("en-US") + ".";
    }

    return number.toLocaleString("en-US", {
        maximumFractionDigits: 10
    });
}

function deleteLast() {

    if (shouldResetDisplay) {
        return;
    }

    currentInput = currentInput.slice(0, -1);

    updateDisplay();
}

function resetCalculator() {

    currentInput = "";
    previousInput = "";
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function showError() {

    display.textContent = "Error";

    currentInput = "";
    previousInput = "";
    operator = null;

    shouldResetDisplay = true;
}

function showError() {

    display.textContent = "Error";

    currentInput = "";
    previousInput = "";
    operator = null;

    shouldResetDisplay = true;
}

function isNumber(value) {
    return /^[0-9]$/.test(value);
}


function isOperator(value) {
    return ( value === "+" || value === "-" || value === "*" || value === "/");
}


function roundResult(number) {
    return Number(
        Number(number).toPrecision(12)
    );
}

// Theme
let currentTheme = 1;


themeOptions.forEach((option) => {

    option.addEventListener("click", () => {

        const theme = Number(
            option.dataset.themeOption
        );

        setTheme(theme);
    });

});

themeSwitch.addEventListener("click", () => {

    currentTheme++;

    if (currentTheme > 3) {
        currentTheme = 1;
    }

    setTheme(currentTheme);
});

function setTheme(theme) {

    currentTheme = theme;

    document.body.dataset.theme = theme;

}



// support for using keyboard
document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (isNumber(key)) {
        enterNumber(key);
        return;
    }

    if (key === ".") {
        enterDecimal();
        return;
    }

    if ( key === "+" || key === "-" ||key === "*" ||key === "/") {
        chooseOperator(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        calculate();
        return;
    }

    if (key === "Backspace") {
        deleteLast();
        return;
    }

    if (key === "Escape") {
        resetCalculator();
    }

});