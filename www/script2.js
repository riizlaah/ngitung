function getElement(s) {
  return document.querySelector(s);
}

const result = getElement("#result"),
base_type_opt = getElement("#base-type"),
base_money_inp = getElement("#base-money"),
interest_period_opt = getElement("#interest-period"),
interest_type_opt = getElement("#interest-type"),
interest_inp = getElement("#interest"),
period_inp = getElement("#period"),
period_type_opt = getElement("#period-type"),
calc_btn = getElement("#calc");

const TYPE_SAVE = 0,
TYPE_LOAN = 1,
INTR_CONST = 0,
INTR_EXPO = 1,
PERIOD_MONTH = 0,
PERIOD_YEAR = 1;


let base_money = 0,
base_type = TYPE_SAVE,
interest = 0,
interest_type = INTR_CONST,
interest_period = PERIOD_MONTH,
period = 0,
period_type = PERIOD_MONTH;

base_money_inp.onchange = () => {
  updateCalcBtn();
  base_money = parseInt(base_money_inp.value.replace(/,/g, '').replace(/\./g, ''));
};
interest_inp.onchange = () => {
  updateCalcBtn();
  if(interest_inp.value.split('.').length - 1 > 1) return;
  interest = parseInt(interest_inp.value.replace(',', '.'));
};
period_inp.onchange = () => {
  updateCalcBtn();
  if(period_inp.value.split('.').length - 1 > 1) return;
  period = parseInt(period_inp.value.replace(',', '.'));
};
base_type_opt.onchange = () => {
  base_type = parseInt(base_type_opt.value);
}
interest_type_opt.onchange = () => {
  interest_type = parseInt(interest_type_opt.value);
}
interest_period_opt.onchange = () => {
  interest_period = parseInt(interest_period_opt.value);
}
period_type_opt.onchange = () => {
  period_type = parseInt(period_type_opt.value);
}
calc_btn.onclick = () => {
  calc();
}

updateCalcBtn();

function isValid() {
  return base_money_inp.value.replace(',', '').replace('.', '').length > 0 
   && (interest_inp.value.split('.').length - 1 <= 1 && interest_inp.value.replace(',', '.').length > 0)
   && (period_inp.value.split('.').length - 1 <= 1 && period_inp.value.replace(',', '.').length > 0);
}

function updateCalcBtn() {
  if(isValid()) {
    calc_btn.innerText = "Hitung";
    calc_btn.disabled = false;
  }
  else {
    calc_btn.innerText = "Hitung (tidak valid)"
    calc_btn.disabled = true;
  }
}

function calc() {
  let n = period,
  res = 0;
  if(period_type == PERIOD_MONTH && interest_period == PERIOD_YEAR) {
    n = period / 12;
  } else if(period_type == PERIOD_YEAR && interest_period == PERIOD_MONTH) {
    n = period * 12;
  }
  // SAVE & LOAN CALC IS SAME
  if(interest_type === INTR_CONST) {// constant
    res = base_money * (1 + (n * (interest/100.)));
  } else {// exponential/multiple
    res = base_money * Math.pow(1 + interest/100., n);
  }
  // if(base_type === TYPE_SAVE) {
  // } else {// LOAN
  //   if(interest_type === INTR_CONST) {// constant
  //     res = base_money * (1 + (n * (interest/100.)));
  //   } else {// exponential/multiple
  //     res = base_money * Math.pow(1 + interest/100., n);
  //   }
  // }
  result.innerText = `Total Saat Ini: ${addSplitter(Math.floor(res).toString())}`;
}

function addSplitter(s) {
  let n = "",
  j = 3;
  for(let i = 0; i < s.length; i++) {
    n += s[(s.length - 1) - i];
    j -= 1;
    if(j === 0 && i !== (s.length - 1)) {
      n += ".";
      j = 3;
    }
  }
  m = "";
  for(let i = 0; i < n.length; i++) {
    m += n[(n.length - 1) - i];
  }
  return m;
}
