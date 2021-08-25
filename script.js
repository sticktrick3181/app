'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Sarah Bhatia',
  movements: [430, 1000, 453, 50, 90],
  interestRate: 1,
  pin: 5555,
};

const arr = [account1, account2, account3, account4, account5];
// console.log(arr.slice(-1));
// console.log(account1.movements.slice(-1));

const uNames = [];

//names could have first name and last name
for (const { owner } of arr) {
  uNames.push(owner);
}
// console.log(uNames);

//we create a loginUser object from a given array ( uNames) that will giveus all the req. credentials for the login process.

// console.log(arr);

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//password and username setter for the Bankify customers
const loginUser = uNames.map(function (name, i) {
  const arr = name.split(' ');
  if (arr.length <= 2 && arr.length != 1) {
    const cred = {
      user: name,
      username: arr[0][0].toLocaleLowerCase() + arr[1][0].toLowerCase(),
      passcode: String(i + 1).repeat(4),
    };
    return cred;
  } else {
    const cred = {
      user: name,
      username:
        arr[0][0].toLocaleLowerCase() +
        arr[1][0].toLowerCase() +
        arr[2][0].toLowerCase(),
      passcode: String(i + 1).repeat(4),
    };
    return cred;
  }
});

//rather than separate object arrays here i have created only one single array

loginUser.forEach(function (user, index) {
  user.movementsForUser = arr[index].movements;
  user.interestForUser = arr[index].interestRate;
});

//current persons details after login
let currUser = '';
let currUsersAmount = 0;
let currAccount = {};

//login

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const un = document.querySelector('.login__input--user').value;
  const pin = document.querySelector('.login__input--pin').value;
  document.querySelector('.login__input--user').value = document.querySelector(
    '.login__input--pin'
  ).value = '';

  currAccount = arr[Number(pin[0]) - 1];
  currAccount.userId = un;
  const unCheck = [];
  const pinCheck = [];

  for (const { username: unOriginal, passcode: pinOriginal } of loginUser) {
    unCheck.push(unOriginal);
    pinCheck.push(pinOriginal);
  }
  const indexUserName = unCheck.indexOf(un);

  if (unCheck.includes(un) && pin == pinCheck[indexUserName]) {
    console.log('User loged In!');
    currUser = uNames[unCheck.indexOf(un)];
    labelWelcome.textContent = `Welcome ${currUser}`;

    containerApp.style.opacity = 100;
  } else {
    ////opacity changer
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Try Again Please!😢`;
  }

  for (const {
    user: owner,
    movementsForUser: movements,
    interestForUser: interestRate,
  } of loginUser) {
    if (currUser == owner) {
      let interestForCurrOwner = 0;
      let balance = 0;
      let out = 0;

      document.querySelector('.movements').innerHTML = '';
      movements.forEach(function (mov, index) {
        balance = balance + mov;
        if (mov < 0) out = out + mov;
        interestForCurrOwner = (balance * interestRate) / 100;

        const status = mov < 0 ? 'withdrawal' : 'deposit';
        const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${status}">${
          index + 1
        } ${status}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
        </div>
        `;

        currUsersAmount = balance;
        labelBalance.textContent = balance + '€';
        labelSumIn.textContent = balance - out + '€';
        labelSumOut.textContent = Math.abs(out) + '€';
        labelSumInterest.textContent = interestForCurrOwner + '€';
        document
          .querySelector('.movements')
          .insertAdjacentHTML('afterbegin', html);
      });
    }
  }
});

//sort button

// btnSort.addEventListener('click', function () {
//   console.log(` This is to be sorted ${currAccount.movements}`);
//   currAccount.movements.sort();
//   console.log(currAccount.movements);

//   document.querySelector('.movements').innerHTML = '';

// });

//transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const sendTo = inputTransferTo.value;
  const sendAmount = inputTransferAmount.value;
  for (const {
    user: owner,
    username,
    movementsForUser: movements,
    interestForUser: interestRate,
  } of loginUser) {
    {
      if (
        sendTo == owner ||
        (sendTo == username &&
          sendAmount <= currUsersAmount &&
          Number(sendAmount) > 0)
      ) {
        // console.log('Ready to transfer! ');

        movements.push(Number(sendAmount));
        currAccount.movements.push(-Number(sendAmount));

        const htmlForDeductionMovement = `
        <div class="movements__row">
        <div class="movements__type movements__type--withdrawal">${
          currAccount.movements.length
        } TRANSFER</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${currAccount.movements.slice(-1)}€</div>
        </div>
        `;

        document
          .querySelector('.movements')
          .insertAdjacentHTML('afterbegin', htmlForDeductionMovement);
        let interestForCurrOwner = 0;
        let balance = 0;
        let out = 0;
        inputTransferTo.value = inputTransferAmount.value = '';
        currAccount.movements.forEach(function (mov) {
          balance = balance + mov;
          if (mov < 0) out = out + mov;
        });
        currUsersAmount = balance;
        interestForCurrOwner = (balance * interestRate) / 100;
        labelBalance.textContent = balance + '€';
        labelSumIn.textContent = balance - out + '€';
        labelSumOut.textContent = Math.abs(out) + '€';
        labelSumInterest.textContent = interestForCurrOwner + '€';
      }
    }
  }
});

//request loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Pressed!');

  const loanValue = inputLoanAmount.value;

  if (
    currAccount.movements.some(mov => mov > (10 / 100) * Number(loanValue)) &&
    Number(loanValue) != 0 &&
    Number(loanValue) > 0
  ) {
    {
      console.log('user eligible for gettin a loan ');
      currAccount.movements.push(Number(loanValue));
    }
    const htmlForLoanMovement = `
      <div class="movements__row">
      <div class="movements__type movements__type--deposit">${
        currAccount.movements.length
      } LOAN RECIEVED</div>
      <div class="movements__date">3 days ago</div>
        <div class="movements__value">${currAccount.movements.slice(-1)}€</div>
        </div>
        `;

    document
      .querySelector('.movements')
      .insertAdjacentHTML('afterbegin', htmlForLoanMovement);
    let interestForCurrOwner = 0;
    let balance = 0;
    let out = 0;
    currAccount.movements.forEach(function (mov) {
      balance = balance + mov;
      if (mov < 0) out = out + mov;
    });
    currUsersAmount = balance;
    interestForCurrOwner = (balance * currAccount.interestForUser) / 100;
    labelBalance.textContent = balance + '€';
    labelSumIn.textContent = balance - out + '€';
    labelSumOut.textContent = Math.abs(out) + '€';
    labelSumInterest.textContent = interestForCurrOwner + '€';
  } else {
    console.log('User not eligible for a loan');
  }
});

//close
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(currAccount);

  const un = inputCloseUsername.value;
  const pin = inputClosePin.value;

  if (currAccount.userId == un && currAccount.pin == pin) {
    console.log('User loged Out!');
    // currUser = uNames[unCheck.indexOf(un)];
    labelWelcome.textContent = `Account Closed!🙂\nEnter the details to login again!`;

    containerApp.style.opacity = 0;
  } else {
    //opacity changer
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Incorrect Credentials!😢`;
  }
});

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// console.log(currencies.entries());
// console.log(currencies);

// for (const [type, fullform] of currencies.entries()) {
//   console.log(`Currency is ${type} and has a fullform ${fullform}`);
// }

// function currenciesCallBack(value, i, arr) {
//   console.log(value); //yeh hame key value pair me ses sirf value dega
//   console.log(arr); //yeh hame current map dega
//   console.log(i); // yeh  hame key dega corresponding order mai current value ki
// }

//forEach() working on a set
// const setExample = new Set(['raman', 'simran', 'riya', 'priya', 'deepika']);
// function callBackForASet(a, b, c) {
//   console.log(a);
//   console.log(b);
//   console.log(c);
// }
// setExample.forEach(callBackForASet);

// currencies.forEach(currenciesCallBack);

// const ishaan = 'Ishaan';
// console.log(ishaan.slice(0));
// console.log(String(movements[0]).slice(0));

// FOROF METHOD FOR ARRAY ITERATION
// for (const [i, movement] of movements.entries()) {
//   console.log(`${i + 1} :: ${movement}`);
// }
//FOR EACH METHOD FOR ARRAY ITERATION
// function callBack(m, i) {
//   console.log(`${i + 1} :: ${m}`);

//   // {
//   //   if (m < 0) console.log(`Money withdrawn !! :: $${String(m).slice(1)}`);
//   //   else console.log(`Money added !! :: $${String(m)}`);
//   // }
// }
// movements.forEach(callBack);

// for (const m of movements) {
//   // console.log(m);
//   if (m < 0) console.log(`Money withdrawn !! :: $${String(m).slice(1)}`);
//   else console.log(`Money added !! :: $${String(m)}`);
// }

// const a = ['a', 'b', 'c', 'd', 'e'];

// const b = ['f', 'g', 'h', 'i', 'j'];

// const letters = a.concat(b);
// letters.reverse();
// console.log(letters);
// console.log(letters.join('-'));
// console.log(typeof letters.join('-'));
// console.log(letters.join('-').split('-'));

/////////////////////////////////////////////////

// const juliaDogs = [3, 5, 2, 12, 7];
// // console.log(juliaDogs.slice(0, 3));
// const kateDogs = [4, 1, 15, 8, 3];
// const checkDogs = function (a, b) {
//   const juliaImproved = a.slice(0, 3);
//   const ab = [...juliaImproved, ...b];
//   console.log(ab);

//   ab.forEach(function (value, i) {
//     const result = value <= 3 ? 'Puppy🐶' : 'Adult🐕';
//     console.log(`Dog number ${i + 1} is a ${result}! `);
//   });
// };
// checkDogs(juliaDogs, kateDogs);

// function dac(dogAge) {
//   if (dogAge <= 2) return 2 * dogAge;
//   else return 16 + dogAge * 4;
// }
// const juliaDogsHumanAge = juliaDogs.map(dac);
// const kateDogsHumanAgekateDogs = kateDogs.map(dac);
// console.log(juliaDogsHumanAge);
// console.log(kateDogsHumanAgekateDogs);

// const com = [...kateDogsHumanAgekateDogs, ...juliaDogsHumanAge];
// console.log(com);
// const filteredDogs = com.filter(function (age) {
//   if (age > 18) return age;
// });
// console.log(filteredDogs);
// const avg = function (arr) {
//   let sum = 0;
//   for (const a of arr) {
//     sum += a;
//   }
//   return sum / arr.length;
// };
// console.log(avg(filteredDogs));
//coding callenge number 2

// //using map method
// console.log(movements);
// const eurotoUsd = 1.1;
// const movementsUsd = movements.map(function (mov) {
//   return mov * eurotoUsd;
// });
// console.log(movementsUsd);
