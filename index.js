const colRow = 4;
const colColumn = 4;
let state = {
  hideButtonsTimeoutCol: null,
  hideButtonsTimeoutRow: null
};

let mainDiv = document.querySelector('div[data-dynamic-table]');

let table = document.createElement('table');
table.id = 'table';
mainDiv.appendChild(table);
let tblBody = document.createElement("tbody");
table.appendChild(tblBody);

for (let i = 0; i < colRow; i++) {
  let row = document.createElement("tr");

  for (let j = 0; j < colColumn; j++) {
    let cell = document.createElement("td");
    row.appendChild(cell);
  }

  tblBody.appendChild(row);
}

table.addEventListener("mouseover", (e) => showDeleteButton(e, state));
table.addEventListener("mouseout", (e) => tableMouseOut(e, state));

let addRowDiv = document.createElement('div');
let textAddRow = document.createTextNode("+");
addRowDiv.appendChild(textAddRow);
mainDiv.appendChild(addRowDiv);
addRowDiv.classList.add('plus-row');
addRowDiv.addEventListener( "click" , clickButton);

let addColDiv = document.createElement('div');
let textAddCol = document.createTextNode("+");
addColDiv.appendChild(textAddCol);
mainDiv.appendChild(addColDiv);
addColDiv.classList.add('plus-col');
addColDiv.addEventListener( "click" , clickButton);

let deleteColDiv = document.createElement('div');
let textDeleteCol = document.createTextNode("-");
deleteColDiv.appendChild(textDeleteCol);
mainDiv.appendChild(deleteColDiv);
deleteColDiv.classList.add('del-col');
deleteColDiv.addEventListener( "click" , clickButton);
deleteColDiv.addEventListener("mouseover", (e) => divColMouseOver(e, state));
deleteColDiv.addEventListener("mouseout", (e) => divColMouseOut(e, state));

let deleteRowDiv = document.createElement('div');
let textDeleteRow = document.createTextNode("-");
deleteRowDiv.appendChild(textDeleteRow);
mainDiv.appendChild(deleteRowDiv);
deleteRowDiv.classList.add('del-row');
deleteRowDiv.addEventListener( "click" , clickButton);
deleteRowDiv.addEventListener("mouseover",(e) => divRowMouseOver(e, state));
deleteRowDiv.addEventListener("mouseout", (e) => divRowMouseOut(e, state));

function clickButton(event) {
  let elem = event.target;
  if (elem.tagName !== 'DIV') return;

  if(elem.classList.contains('plus-row')) {
    addString();
  }

  if(elem.classList.contains('plus-col')) {
    addColumn();
  }

  if(elem.classList.contains('del-col')) {
    deleteRowCol(elem, 'del-col');
  }

  if(elem.classList.contains('del-row')) {
    deleteRowCol(elem, 'del-row');
  }
}

function addColumn() {
  let tableStr = document.querySelectorAll('#table tr');

  for(let i = 0; i < tableStr.length; i++) {
    tableStr[i].insertCell();
  }

}

function addString() {
  let table = document.getElementById('table');
  let colColumns = table.rows[0].cells.length;
  let tableBody = document.querySelector('#table > tbody');
  let newRow   = tableBody.insertRow();

  for (let i = 0; i < colColumns; i++) {
    newRow.insertCell(i);
  }

}

function deleteRowCol(event, className) {
  let row = document.querySelector('.del-row');
  let col = document.querySelector('.del-col');

  if (!row.hasAttribute('data-delete-row') && !col.hasAttribute('data-delete-column')) return;

  let table = document.getElementById('table');
  let tableStr = document.querySelectorAll('#table tr');
  let kolColumns = tableStr[0].cells.length;
  let kolRows = tableStr.length;

  if (className === 'del-col') {
    let colInd = parseInt(col.getAttribute('data-delete-column'), 10);

    if(kolColumns === 1) return;

    for(let i = 0; i < kolRows; i++) {
      tableStr[i].deleteCell(colInd);
    }

    if(kolColumns - 1 === colInd) {
      Object.assign(col.style, { left: (colInd - 1)*54 + 54 + 'px' });
      col.setAttribute('data-delete-column', (colInd-1).toString());
    }
  }

  if(className === 'del-row') {
    let rowInd = parseInt(row.getAttribute('data-delete-row'), 10);

    if(kolRows === 1) return;

    table.deleteRow(rowInd);

    if(kolRows - 1 === rowInd) {
      Object.assign(row.style, { top: (rowInd - 1)*54 + 54 + 'px' });
      row.setAttribute('data-delete-row', (rowInd-1).toString());
    }
  }

  if(document.getElementById('table').rows.length <= 1) {
    Object.assign(row.style, { opacity: '0', visibility: 'hidden' });
  }

  if(document.getElementById('table').rows[0].cells.length <= 1) {
    Object.assign(col.style, { opacity: '0', visibility: 'hidden' });
  }
}

function showDeleteButton(event, state) {
  clearTimeout(state.hideButtonsTimeoutCol);
  clearTimeout(state.hideButtonsTimeoutRow);

  let elem = event.target;
  let table = document.getElementById('table');
  let row = document.querySelector('.del-row');
  let col = document.querySelector('.del-col');
  let kolRows = table.rows.length;
  let kolColumns = table.rows[0].cells.length;
  let rowInd = elem.parentElement.rowIndex;
  let cellInd = elem.cellIndex;

  if (kolRows <= 1) {
    Object.assign(row.style, { opacity: '0', visibility: 'hidden' });
  }

  if (kolColumns <= 1) {
    Object.assign(col.style, { opacity: '0', visibility: 'hidden' });
  }

  if((cellInd || cellInd === 0) && kolColumns > 1){
    Object.assign(col.style, { left: cellInd*54 + 54 + 'px', opacity: '1', visibility: 'visible' });
    col.setAttribute('data-delete-column', cellInd.toString());
  }

  if((rowInd || rowInd === 0) && kolRows > 1){
    Object.assign(row.style, { top: rowInd*54 + 54 + 'px', opacity: '1', visibility: 'visible' });
    row.setAttribute('data-delete-row', rowInd.toString())
  }
}

function tableMouseOut(event, state) {
  let row = document.querySelector('.del-row');
  let col = document.querySelector('.del-col');

  if(!event.relatedTarget || event.relatedTarget.tagName !== 'DIV') return;

  state.hideButtonsTimeoutRow = setTimeout(() => {
    Object.assign(row.style, { opacity: '0', visibility: 'hidden' });
  }, 500);

  state.hideButtonsTimeoutCol = setTimeout(() => {
    Object.assign(col.style, { opacity: '0', visibility: 'hidden' });
  }, 500);
}

function divColMouseOver(e, state) {
  let col = document.querySelector('.del-col');
  let table = document.getElementById('table');
  let kolColumns = table.rows[0].cells.length;

  clearTimeout(state.hideButtonsTimeoutCol);

  if(kolColumns > 1) {
    Object.assign(col.style, { opacity:'1', visibility: 'visible' });
  } else {
    Object.assign(col.style, { opacity:'0', visibility: 'hidden' });
  }
}

function divColMouseOut(event, state) {
  let col = document.querySelector('.del-col');

  state.hideButtonsTimeoutCol = setTimeout(() => {
    Object.assign(col.style, { opacity:'0', visibility: 'hidden' });
  }, 500)
}

function divRowMouseOver(e, state) {
  let row = document.querySelector('.del-row');
  let table = document.getElementById('table');
  let kolRows = table.rows.length;

  clearTimeout(state.hideButtonsTimeoutRow);

  if(kolRows > 1){
    Object.assign(row.style, { opacity:'1', visibility: 'visible' });
  } else {
    Object.assign(row.style, { opacity:'0', visibility: 'hidden' });
  }
}

function divRowMouseOut(event, state) {
  let row = document.querySelector('.del-row');

  state.hideButtonsTimeoutRow = setTimeout(() => {
    Object.assign(row.style, { opacity:'0', visibility: 'hidden' });
  }, 500)
}