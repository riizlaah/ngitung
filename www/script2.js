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
period_type_opt = getElement("#period-opt");

const TYPE_SAVE = 0,
TYPE_LOAN = 1;


let base_money = 0,
base_type = 0,
interest = 0,
interest_type = 0,
interest_period = 0,
period = 0,
period_type = 0;

base_money_inp.onchange = () => {
  base_money = parseInt(base_money_inp.value.replace(',', '').replace('.', ''));
};
interest_inp.onchange = () => {
  interest = parseInt(interest_inp.value.replace(',', '.'));
};
period_inp.onchange = () => {
  period = parseInt(period_inp.value.replace(',', '.'));
};
// base_type_opt.onchange = ()