//whole form
const itemForm = document.querySelector('#item-form');
//text field input
const itemInput = document.querySelector('#item-input');
//ul
const itemList = document.querySelector('#item-list');
//clear button
const clearButton = document.querySelector('#clear');
//filter
const filter = document.querySelector('#filter');
//additem button
const formBtn = itemForm.querySelector('button');
// allows editing items
let isEditMode = false;

//Displays items in storage. creates array from items in storage that have been parsed from JSON to give an array of items that contain only the text from the items in storage. that text is sent the additemtodom function in a foreach function that will cycle through the array and add the text to a new list item
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemtoDom(item);
    checkUI();
  });
}

// creates and adds item to dom. stores in local storage
function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  //validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  //check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists');
      return;
    }
  }

  //create item dom element
  addItemtoDom(newItem);

  //add item to local storage
  addItemToStorage(newItem);

  checkUI();
  //Clear text field
  itemInput.value = '';
}

//handles adding list item to dom
function addItemtoDom(item) {
  //Create List Item
  const li = document.createElement('li');
  // Add text in text field to li
  li.appendChild(document.createTextNode(item));
  // create button using function
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  // add li to DOM
  itemList.appendChild(li);
}

//creates button
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

//creates icon
function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

// checks to see if anything is in local storage. if not, set itemsfromstorage array to empty. if so, add items to array. push new item to array and set the local storage to the new array of items with stringify
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  //adds new item to array
  itemsFromStorage.push(item);

  //convert to json string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//retrieves item from storage
function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

//functions as a handler that will perform different functions based on where you click
function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    //target is what you click on. parent element of the x is the button. parent element of the button is the li. this removes the li
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

//edit mode
function setItemToEdit(item) {
  isEditMode = true;
  //removes edit-mode class before assigning it to clicked li
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i>    Update Item';
  formBtn.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
}

//removes items
function removeItem(item) {
  if (confirm('Are you sure?')) {
    //remove item from dom
    item.remove();
    //remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

//removes item from local storage
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  //filter out item be removed. returns string without removed item
  itemsFromStorage = itemsFromStorage.filter(
    (filteredItem) => filteredItem !== item
  );

  //reset to locastorage with item removes
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//clears all items
function clearAll() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  //clear localstorage
  localStorage.removeItem('items');

  // check for filter and clear all button
  checkUI();
}

// filter list function
function filterList(e) {
  const filterText = filter.value.toLowerCase();
  const items = itemList.querySelectorAll('li');
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(filterText) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

//checks ui to hide or display filter and clear button
function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearButton.style.display = 'none';
    filter.style.display = 'none';
  } else {
    clearButton.style.display = 'block';
    filter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// initialize app
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearButton.addEventListener('click', clearAll);
  filter.addEventListener('input', filterList);
  document.addEventListener('DOMContentLoaded', displayItems);
  checkUI();
}

init();
