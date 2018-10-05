const root = document.getElementById('root');
let selected = [];
let selectedId;
let dragElements;
let editTitleEl;
let rem;

const data = {
  "id": "1538727956126",
  "value": "root",
  "children": [
      {
          "id": "1538727958550",
          "value": "child1",
          "children": [
              {
                  "id": "1538728010986",
                  "value": "subChild1",
                  "children": []
              },
              {
                  "id": "1538728026922",
                  "value": "subChild2",
                  "children": []
              }
          ]
      },
      {
          "id": "1538728063563",
          "value": "child2",
          "children": []
      },
      {
          "id": "1538728070971",
          "value": "child3",
          "children": []
      }
  ]
}

showTree(root, data);

function showTree(host, data) {
  const li = document.createElement('li');
  li.dataset.id = data.id;
  li.innerHTML = `
    <span class="title">${data.value}</span>
    ${data.value === 'root' ? '' : '<button class="edit" title="you can rename this node">Edit Name</button>'}
    <button class="add" title="you can add children to this node">Add Child</button>
    <button class="del" title="you can delete this node">${data.value === 'root' ? 'Delete all child' : 'Delete'}</button>`;
  
  li.setAttribute('draggable', 'true');
  li.classList.add('dropzone');
  li.addEventListener('click', handleClick);
  host.appendChild(li);
  dragElements = document.querySelectorAll('[draggable]');
  if (data.children.length === 0) {
    return;
  }

  const ul = document.createElement('ul');
  li.appendChild(ul);

  for (let child of data.children) {
    showTree(ul, child);
  }
}

function removeVisible() {
  console.log(selectedId);
  selected.forEach(el => el.classList.remove('visible'));
  if (editTitleEl) {
    editTitleEl.setAttribute('contenteditable', 'false');
    editTitleEl.blur();
  }
  selected = [];
  dragElements.forEach(el => el.setAttribute('draggable', 'true'));
}

document.addEventListener('click', removeVisible);

function handleClick(event) {
  event.stopPropagation();
  const curId = this.dataset.id;
  if (curId !== selectedId) {
    removeVisible();
  }
  selected = this.querySelectorAll(`[data-id="${this.dataset.id}"] > button`);
  selected.forEach(el => el.classList.toggle('visible'));
  selectedId = curId;

  if (event.target.classList.contains('edit')) {
    console.log('edit');
    editTitleEl = this.querySelector('.title');
    editTitleEl.addEventListener('keydown', handleKey);
    dragElements.forEach(el => el.setAttribute('draggable', 'false'))
    editTitleEl.setAttribute('contenteditable', 'true');
    editTitleEl.focus();
    
  }

  if (event.target.classList.contains('add')) {
    console.log('add');
    const newNode = {
      "id": Date.now().toString(),
      "value": "new Node",
      "children": []
    };

    addNode(data, newNode, curId);
    root.innerHTML = '';
    showTree(root, data);
  }

  if (event.target.classList.contains('del')) {
    console.log('del');
    removeNode(data, selectedId);
    root.innerHTML = '';
    showTree(root, data);
  }
}

function editTitle(data, id, newValue) {
  if (data.id === id) {
    data.value = newValue;
    return;
  }

  for (let child in data.children) {
    if (data.children[child].id === id) {
      data.children[child].value = newValue;
      return;
    }
    editTitle(data.children[child], id, newValue)
  }
}

function findNode(data, id) {
  if (data.id === id) {
    console.log(data);
    return data;
  }

  for (let child of data.children) {
    findNode(child, id);
  }
}

findNode(data, '1538727956126');

function removeNode(data, id) {
  if (data.id === id) {
    data.children = [];
    return;
  }
  for (let child in data.children) {
    if (data.children[child].id === id) {
      rem = data.children.splice(child, 1);
      return;
    }
    removeNode(data.children[child], id);
  }
}

function handleRemove(event) {
  if (event.currentTarget === event.target) {
    const id = event.target.dataset.id;
    removeNode(data, id);
    root.innerHTML = '';
    showTree(root, data);
  }
}

function handleKey(event) {
  if (event.keyCode === 13) {
    editTitle(data, selectedId, event.target.textContent);
    dragElements.forEach(el => {
      el.setAttribute('draggable', 'true');
    });
    root.innerHTML = '';
    showTree(root, data);
  }
}

function addNode(data, dragged, containerId) {
  if (data.id === containerId) {
    data.children.push(dragged);
    return;
  }
  for (let child of data.children) {
    if (child.id === containerId) {
      child.children.push(dragged);
      return;
    }
    addNode(child, dragged, containerId);
  }
}

let draggedId;

/* events fired on the draggable target */
document.addEventListener("drag", function( event ) {

}, false);

document.addEventListener("dragstart", function( event ) {
  // store a ref. on the dragged elem
  draggedId = event.target.dataset.id;
  // make it half transparent
  event.target.style.opacity = .5;
}, false);

document.addEventListener("dragend", function( event ) {
  // reset the transparency
  event.target.style.opacity = "";
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function( event ) {
  // prevent default to allow drop
  event.preventDefault();
}, false);

document.addEventListener("dragenter", function( event ) {
  // highlight potential drop target when the draggable element enters it
  if ( event.target.className == "dropzone" ) {
      event.target.style.background = "rgba(0,0,0,0.3)";
  }

}, false);

document.addEventListener("dragleave", function( event ) {
  // reset background of potential drop target when the draggable element leaves it
  if ( event.target.className == "dropzone" ) {
      event.target.style.background = "";
  }

}, false);


document.addEventListener("drop", function( event ) {
  // prevent default action (open as link for some elements)
  event.preventDefault();
  // move dragged elem to the selected drop target
  if ( event.target.className == "dropzone" && event.target.dataset.id !== draggedId) {
      const dropId = event.target.dataset.id;
      removeNode(data, draggedId);
      addNode(data, rem[0], dropId);
      root.innerHTML = '';
      showTree(root, data);
  }
  event.target.style.background = "";

}, false);