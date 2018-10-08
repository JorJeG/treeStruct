class TreeStruct {
  constructor(root, data) {
    this.data = data;
    this.root = root;
    this.selected = [];
    this.selectedId = null;
    this.dragElements = null;
    this.draggedId = null;
    this.editTitleEl = null;
    this.removeEl = null;
  }

  init() {
    this.showTree(this.root, this.data);
    document.addEventListener('click', (e) => this.removeVisible(e));
    document.addEventListener("drag", (e) => this.handleDrag(e));
    document.addEventListener("dragstart", (e) => this.handleDragStart(e));
    document.addEventListener("dragend", (e) => this.handleDragEnd(e));
    document.addEventListener("dragover", (e) => this.handleDragOver(e));
    document.addEventListener("dragenter", (e) => this.handleDragEnter(e));
    document.addEventListener("dragleave", (e) => this.handleDragLeave(e));
    document.addEventListener("drop", (e) => this.handleDrop(e));
  }

  showTree(host, data) {
    const li = document.createElement('li');
    li.dataset.id = data.id;
    li.innerHTML = `
      <span class="title">${data.value}</span>
      ${data.value === 'root' ? '' : '<button class="edit" title="you can rename this node">Edit Name</button>'}
      <button class="add" title="you can add children to this node">Add Child</button>
      <button class="del" title="you can delete this node">${data.value === 'root' ? 'Delete all child' : 'Delete'}</button>`;
    
    li.setAttribute('draggable', 'true');
    li.classList.add('dropzone');
    li.addEventListener('click', (e) => this.handleClick(e));
    host.appendChild(li);
    this.dragElements = document.querySelectorAll('[draggable]');
    if (data.children.length === 0) {
      return;
    }
  
    const ul = document.createElement('ul');
    li.appendChild(ul);
  
    for (let child of data.children) {
      this.showTree(ul, child);
    }
  }

  updateView() {
    this.root.innerHTML = '';
    this.showTree(this.root, this.data);
  }

  handleClick(event) {
    event.stopPropagation();
    const curId = event.target.parentElement.dataset.id;
    if (curId !== this.selectedId) {
      this.removeVisible();
    }
    this.selected = event.target.parentElement.querySelectorAll(`[data-id="${event.target.parentElement.dataset.id}"] > button`);
    this.selected.forEach(el => el.classList.toggle('visible'));
    this.selectedId = curId;
  
    if (event.target.classList.contains('edit')) {
      console.log('Вы можете изменить название элемента');
      this.editTitleEl = event.target.parentElement.querySelector('.title');
      this.editTitleEl.addEventListener('keydown', (e) => this.handleKey(e));
      this.dragElements.forEach(el => el.setAttribute('draggable', 'false'))
      this.editTitleEl.setAttribute('contenteditable', 'true');
      this.editTitleEl.focus();
    }
  
    if (event.target.classList.contains('add')) {
      console.log('Вы добавили новый элемент');
      const newNode = {
        "id": Date.now().toString(),
        "value": "new Node",
        "children": []
      };
      this.addNode(this.data, newNode, this.selectedId);
      this.updateView();
    }
  
    if (event.target.classList.contains('del')) {
      console.log('Вы удалили элемент с id ' + this.selectedId);
      this.removeNode(this.data, this.selectedId);
      this.updateView();
    }
  }

  removeVisible() {
    this.selected.forEach(el => el.classList.remove('visible'));
    if (this.editTitleEl) {
      this.editTitleEl.setAttribute('contenteditable', 'false');
      this.editTitleEl.blur();
      this.editTitle(this.data, this.selectedId, this.editTitleEl.textContent);
      console.log('Вы изменили название элемента');
    }
    this.selected = [];
    this.dragElements.forEach(el => el.setAttribute('draggable', 'true'));
  }

  handleKey(event) {
    if (event.keyCode === 13) {
      this.editTitle(this.data, this.selectedId, event.target.textContent);
      this.dragElements.forEach(el => {
        el.setAttribute('draggable', 'true');
      });
      this.updateView();
      console.log('Вы изменили название элемента');
    }
  }

  addNode(data, dragged, containerId) {
    if (data.id === containerId) {
      data.children.push(dragged);
      return;
    }
    for (let child of data.children) {
      if (child.id === containerId) {
        child.children.push(dragged);
        return;
      }
      this.addNode(child, dragged, containerId);
    }
  }

  removeNode(data, id) {
    if (data.id === id) {
      data.children = [];
      return;
    }
    for (let child in data.children) {
      if (data.children[child].id === id) {
        this.removeEl = data.children.splice(child, 1);
        return;
      }
      this.removeNode(data.children[child], id);
    }
  }

  editTitle(data, id, newValue) {
    if (data.id === id) {
      data.value = newValue;
      return;
    }
  
    for (let child in data.children) {
      if (data.children[child].id === id) {
        data.children[child].value = newValue;
        return;
      }
      this.editTitle(data.children[child], id, newValue)
    }
  }

  handleDrag(event) {

  }
  
  handleDragStart(event) {
    this.draggedId = event.target.dataset.id;
    event.target.style.opacity = .5;
  }
  
  handleDragEnd(event) {
    event.target.style.opacity = "";
  }
  
  handleDragOver(event) {
    event.preventDefault();
  }
  
  handleDragEnter(event) {
    if ( event.target.className == "dropzone" ) {
      event.target.style.background = "rgba(0,0,0,0.3)";
    }
  }
  
  handleDragLeave(event) {
    if ( event.target.className == "dropzone" ) {
      event.target.style.background = "";
    }
  }
  
  handleDrop(event) {
    event.preventDefault();
    if ( event.target.className == "dropzone" && event.target.dataset.id !== this.draggedId) {
      console.log('Вы переместили элемент');
      const dropId = event.target.dataset.id;
      this.removeNode(this.data, this.draggedId);
      this.addNode(this.data, this.removeEl[0], dropId);
      this.updateView()
    }
    event.target.style.background = "";
  }
}
const root = document.getElementById('root');
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

new TreeStruct(root, data).init();