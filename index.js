// main process: form submission with addEventListener()
document.querySelector('#ewallet-form').addEventListener('submit', (e) => {
  e.preventDefault()
  const type = document.querySelector('.add__type').value
  const desc = document.querySelector('.add__description').value
  const value = document.querySelector('.add__value').value
  if (desc && value) {
    addItems(type, desc, value) 
    resetForm()
  } 
})

// main process: Call function
showItems()
showTotalBalance()
showTotalIncome()
showTotalExpanse()

// UI: Clear form data
function resetForm() {
  document.querySelector('.add__type').value = '+'
  document.querySelector('.add__description').value = ''
  document.querySelector('.add__value').value = ''
}  

// UI: Show items from 'Local Stogare'
function showItems() {
  let items = getItemsFromLS()
  const collection = document.querySelector('.collection');

  for (let item of items) {
    const newHtml = `
    <div class="item">
      <div class="item-description-time">
          <div class="item-description">
              <p>${item.desc}</p>
          </div>
          <div class="item-time">
              <p>${item.time}</p>
          </div>
      </div>
      <div class="item-amount ${item.type === '+' ? 'income-amount' : 'expense-amount'}">
          <p>৳ ${sep(item.value)}</p>
      </div>
    </div>
  `
    collection.insertAdjacentHTML('afterbegin', newHtml);
  }
}

// UI: Add items to the 'Local Stogare' given by user through form submission 
function addItems(type, desc, value) {
  const time = getFormettedTime()
  const newHtml = `
    <div class="item">
      <div class="item-description-time">
          <div class="item-description">
              <p>${desc}</p>
          </div>
          <div class="item-time">
              <p>${time}</p>
          </div>
      </div>
      <div class="item-amount ${type === '+' ? 'income-amount' : 'expense-amount'}">
          <p>৳ ${sep(value)}</p>
      </div>
    </div>
  `
  const collection = document.querySelector('.collection')
  collection.insertAdjacentHTML('afterbegin', newHtml)
  addItemsToLS(type, desc, value, time)
  showTotalIncome()
  showTotalExpanse()
  showTotalBalance()
}

function addItemsToLS(type, desc, value, time){
  let items = getItemsFromLS()
  items.push({type, desc, value, time})
  localStorage.setItem('items', JSON.stringify(items))
}

// UI: Get data from 'Local Stogare'
function getItemsFromLS(){
  let items = localStorage.getItem('items')
  return (items) ? JSON.parse(items) : []
}

// Calculation: Income
function showTotalIncome() {
  let items = getItemsFromLS()
  const amount = items
  .filter(item => (item.type === '+'))
  .reduce((sum, curr) => sum + parseInt(curr.value), 0)
  document.querySelector('.income__amount p').innerText = `৳${sep(amount)}`
}

// Calculation: Expanse
function showTotalExpanse() {
  let items = getItemsFromLS()
  const amount = items
  .filter(item => (item.type === '-'))
  .reduce((sum, curr) => sum + parseInt(curr.value), 0)
  document.querySelector('.expense__amount p').innerText = `৳${sep(amount)}`
}

// Calculation: Total Balance
function showTotalBalance() {
  let items = getItemsFromLS()
  let balance = 0
  items.forEach(item => (item.type === '+') ? balance += parseInt(item.value) : balance -= parseInt(item.value))
  document.querySelector('.balance__amount p').textContent = `${sep(balance)} টাকা`
  document.querySelector('header').className = (balance >= 0) ? 'green' : 'red'
}

// Utility: Date & Time formetting
function getFormettedTime() {
  const now = new Date().toLocaleTimeString('en-us', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  const date = now.split(',')[0].split(' ').reverse()
  const time = now.split(',')[1]

  // 25 Feb, 06:45 PM
  return `${date[0]} ${date[1]}, ${time} `
}

// Utility: Seperator method to show balance with comma
function sep(amount) {
  amount = parseInt(amount)
  return amount.toLocaleString()
}
