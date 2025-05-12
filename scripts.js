const mainScreen = document.querySelector(".main-display");
const topScreen = document.querySelector(".upper-display");
const numButtons = document.querySelectorAll(".btn-num");
const equalButton = document.querySelector(".equal");
const opButtons = document.querySelectorAll(".btn.operator");
const clearButtons = document.querySelectorAll(".clear");
const plusMinus = document.querySelector(".plus-minus");
const percent = document.querySelector(".percent");
const dec = document.querySelector(".point");



let inOps = false;
let isEval = false;

function displayEval() {
    let calc = new Calculator;
    let result = 0

    if (topScreen.textContent === "0" || !inOps) {
        result = calc.calculate(mainScreen.textContent);
    } else {
        topScreen.textContent += mainScreen.textContent;
        result = calc.calculate(topScreen.textContent);
    }

    mainScreen.textContent = result;
    inOps = false;
    isEval = true;
}

function displayNum() {
    if (mainScreen.textContent == "0" || isEval) {
        mainScreen.textContent = this.textContent;
    } else if (mainScreen.textContent.length < 10) {
        mainScreen.textContent += this.textContent;
    }

    if (isEval) {
        topScreen.textContent = "";
    }

    isEval = false;
}

function displayOperator() {
    let result = 0
    let operator = this.textContent;

    if (operator == "-" && (isNaN(mainScreen.textContent) || mainScreen.textContent == "0")) {
        changeSign();
        return;
    }

    if (topScreen.textContent == "" || !inOps) {
        topScreen.textContent = mainScreen.textContent + " " + this.textContent + " "; 
    } else {
        let calc = new Calculator;

        topScreen.textContent += mainScreen.textContent;
        result = calc.calculate(topScreen.textContent);

        topScreen.textContent = result + " " + this.textContent + " ";
    }

    mainScreen.textContent = 0;
    inOps = true;
    isEval = false;
}

function clear() {
        mainScreen.textContent = "0";
        topScreen.textContent = "";
}

function changeSign() {
    let num = mainScreen.textContent;

    if (num === "0") {
        mainScreen.textContent = "-";
    } else if (num === "-") {
        mainScreen.textContent = "0";
    } else if (num.startsWith("-")) {
        mainScreen.textContent = num.substring(1);
    } else {
        mainScreen.textContent = `-${num}`;
    }
}

function getPercent() {
    let num = mainScreen.textContent;
    if (num === "0") {
        // console.log('error percent');
    } else {
        mainScreen.textContent = num / 100;
    }
    topScreen.textContent = `${num}%`
}

function getDecimal() {
    let num = mainScreen.textContent;
    if (num === "0") {
        mainScreen.textContent = ".";
    } else {
        mainScreen.textContent = `${num}.`
    }
}


// ==========================================================

function addDecimals(a, b) {
    a = String(a);
    b = String(b);

    const adec = (a.split(".")[1] || "").length;
    const bdec = (b.split(".")[1] || "").length;
    const maxDec = Math.max(adec, bdec);
    let divdec = "1";
    divdec = divdec.padEnd(maxDec, "0");

    return ((+a * divdec + +b * divdec) / divdec).toFixed(maxDec); 
}


function multiplyDecimals(a, b) {
    a = String(a);
    b = String(b);

    const adec = (a.split(".")[1] || "").length;
    const bdec = (b.split(".")[1] || "").length;
    const totalDec = adec + bdec;
    
    return (a * b).toFixed(totalDec)
}


function divideDecimals(a, b) {
    a = String(a);
    b = String(b);

    const adec = (a.split(".")[1] || "").length;
    const bdec = (b.split(".")[1] || "").length;
    const maxDec = Math.max(adec, bdec);
    const divisor = Math.pow(10, maxDec);
   
    return(a * divisor) / (b * divisor);
}

function formatResult(result) {
    const resultStr = result.toString();
    const maxLength = 9; 
    
    if (resultStr.length > maxLength) {
        expoResult =  parseFloat(result).toExponential(maxLength - 6);
        return expoResult;
    } 

    return result;
}

function Calculator(str) {
    isEval = true;
    
    this.methods = {
        "−": (a, b) => addDecimals(a, -b),
        "+": (a, b) => addDecimals(a, b), 
        "÷": (a, b) => divideDecimals(a, b),
        "×": (a, b) => multiplyDecimals(a, b)
    };

    this.calculate = function(str) {
        let parts = str.split(" ");
        a = +parts[0];
        op = parts[1];
        b = +parts[2];


        if ((a || a == "0") && !op && !b) {
            return formatResult(a);
        }
        if (isNaN(a) || isNaN(b)) {
            return NaN;
        }
        if (!this.methods[op]) {
            return "Operation not supported."
        }

        let result = this.methods[op](a, b);
        return formatResult(result);
    };
}

// ==================================================================

numButtons.forEach((button) => {
    button.addEventListener("click", displayNum);
});
opButtons.forEach((button) => {
    button.addEventListener("click", displayOperator);
});
clearButtons.forEach((button) => {
    button.addEventListener("click", clear);
});
equalButton.addEventListener("click", displayEval);
plusMinus.addEventListener("click", changeSign);
percent.addEventListener("click", getPercent);
dec.addEventListener("click", getDecimal);
