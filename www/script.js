// Helper functions
function gete(s) {
  return document.querySelector(s);
}
function getes(s) {
  return document.querySelectorAll(s);
}

// DOM Elements
const formula = gete("#formula");
const clearBtn = gete("#clear");
const undoBtn = gete("#undo");
const redoBtn = gete("#redo");
const historyBtn = gete("#history");
const eqBtn = gete("#eq");
const ch_ext = gete("#ch_ext");
const buttons1 = getes("#a button");
const btns_a = gete("#a");
const backspace_btn = gete("#backspace");
const closeHistory = gete("#closeHistory");
const historyLines = gete("#history-lines");
const historyPanel = gete(".history-panel");

// State management
let calculationHistory = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
let historyIndex = -1;
let undoStack = [];
let redoStack = [];
let extra_visible = false;
// Initialize
updateButtons();

// Event Listeners
buttons1.forEach(btn => btn.onclick = handleButtonClick);
backspace_btn.onclick = backspace;
clearBtn.onclick = clearFormula;
eqBtn.onclick = calculate;
undoBtn.onclick = undo;
redoBtn.onclick = redo;
historyBtn.onclick = showHistory;
closeHistory.onclick = () => {historyPanel.style.display = "none"};
// ch_ext.onclick = () => {
//   extra_visible = !extra_visible
//   if(extra_visible) {
//     btns_a.style.display = 'none';
//     btns_b.style.display = 'grid';
//   } else {
//     btns_a.style.display = 'grid';
//     btns_b.style.display = 'none';
//   }
// };

// Main Functions
function handleButtonClick(e) {
  const char = e.target.textContent;
  const currentFormula = formula.textContent;
  // Validate input
  if (!isValidInput(currentFormula, char)) {
    return;
  }
  // Save state for undo/redo
  saveState(currentFormula);
  // Handle special characters
  formula.textContent += char;
  updateButtons();
}

function isValidInput(currentFormula, char) {
  if(formula.textContent == "Error") formula.textContent = "";
  const lastChar = currentFormula.slice(-1);
  const operators = ['+', '-', '×', '/', '^'];
  // Prevent consecutive operators
  if (operators.includes(lastChar) && operators.includes(char)) {
    return false;
  }
  // Prevent operator at start (except minus)
  if (currentFormula === '' && operators.includes(char) && char !== '-') {
    return false;
  }
  if(lastChar === "%" && (char === '%' || !operators.includes(char))) return false;
  // Handle decimal point
  if (char === '.') {
    // Check if current number already has a decimal point
    const parts = currentFormula.split(/[\+\-x\/\^]/);
    const lastNumber = parts[parts.length - 1];
    if (lastNumber.includes('.')) {
      return false;
    }
  }
  return true;
}

function calculate() {
  let expr = formula.textContent;
  let friendlyExpr = expr;
  saveState(formula.textContent)
  // Replace display symbols with math symbols
  expr = expr.replace(/×/g, '*').replace(/√/g, 'Math.sqrt').replace(/([0-9a-zA-Z\+-\/\*\^]+)\^([0-9a-zA-Z\+-\/\*\^]+)/g, 'Math.pow($1, $2)');
  try {
    // Handle parentheses
    const openCount = (expr.match(/\(/g) || []).length;
    const closeCount = (expr.match(/\)/g) || []).length;
    if (openCount !== closeCount) {
      throw new Error("Unbalanced parentheses");
    }
    // Handle percentage
    expr = expr.replace(/([0-9]+)%/g, '($1/100)');
    // Evaluate safely
    const result = Function(`"use strict"; return (${expr})`)();
    // Save to history
    calculationHistory.push(`${friendlyExpr} = ${result}`);
    localStorage.setItem('history', JSON.stringify(calculationHistory));
    historyIndex = calculationHistory.length - 1;
    // Update formula with result
    formula.textContent = result.toString();
  } catch (error) {
    formula.textContent = "Error";
    console.error("Calculation error:", error);
  }
  
  updateButtons();
}

function clearFormula() {
  saveState(formula.textContent);
  formula.textContent = "";
  updateButtons();
}

function undo() {
  if (undoStack.length > 0) {
    const current = formula.textContent;
    redoStack.push(current);
    formula.textContent = undoStack.pop();
    updateButtons();
  }
}

function redo() {
  if (redoStack.length > 0) {
    const current = formula.textContent;
    undoStack.push(current);
    formula.textContent = redoStack.pop();
    updateButtons();
  }
}

function showHistory() {
  historyPanel.style.display = "block";
  historyLines.innerHTML = calculationHistory.join("<br>")
}

function saveState(currentState) {
  undoStack.push(currentState);
  redoStack = []; // Clear redo stack when new action is performed
}

function updateButtons() {
  // Enable/disable undo/redo based on stack state
  undoBtn.disabled = undoStack.length === 0;
  redoBtn.disabled = redoStack.length === 0;
  historyBtn.disabled = calculationHistory.length === 0;
}

function backspace() {
  const currentFormula = formula.textContent;
  if (currentFormula.length > 0) {
    // Save state for undo/redo
    saveState(currentFormula);
    
    // Handle special cases like "√(" which should be treated as single unit
    if(currentFormula == "Error") {
      formula.textContent = "";
    } else if (currentFormula.endsWith('√(')) {
      formula.textContent = currentFormula.slice(0, -2);
    } else {
      formula.textContent = currentFormula.slice(0, -1);
    }
    
    updateButtons();
  }
}