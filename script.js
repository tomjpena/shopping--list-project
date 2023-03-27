//whole form
const itemForm = document.querySelector('#item-form');
//text field input
const itemInput = document.querySelector('#item-input');
//ul
const itemList = document.querySelector('#item-list');

function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  //validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  //Create List Item
  const li = document.createElement('li');
  // Add text in text field to li
  li.appendChild(document.createTextNode(newItem));
  // create button using function
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);

  //Clear text field
  itemInput.value = '';
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

//Events
itemForm.addEventListener('submit', addItem);
