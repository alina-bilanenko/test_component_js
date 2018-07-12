export default class DynamicTable {
  constructor({
                rowsAmount = 4,
                columnsAmount = 4
              }) {

    this.ROWS_AMOUNT = rowsAmount;
    this.COLUMNS_AMOUNT = columnsAmount;

    this.mainContainer = document.querySelector('div[data-dynamic-table]');
    this.table = document.createElement('table');
    this.tblBody = document.createElement("tbody");

    this.addRowButton = document.createElement('button');
    this.addColumnButton = document.createElement('button');
    this.removeRowButton = document.createElement('button');
    this.removeColumnButton = document.createElement('button');

  }

  initialize() {
    this.table.id = 'table';
    this.mainContainer.appendChild(this.table);
    this.table.appendChild(this.tblBody);

    for (let i = 0; i < this.ROWS_AMOUNT; i++) {
      let row = document.createElement("tr");

      for (let j = 0; j < this.COLUMNS_AMOUNT; j++) {
        let cell = document.createElement("td");
        row.appendChild(cell);
      }

      this.tblBody.appendChild(row);
    }

    this.createButton(this.addRowButton, 'add-row', '+', () => this.addRowHandler());
    this.createButton(this.addColumnButton, 'add-column', '+', () => this.addColumnHandler());
    this.createButton(this.removeRowButton, 'remove-row', '-', () => this.removeRowHandler());
    this.createButton(this.removeColumnButton, 'remove-column', '-', () => this.removeColumnHandler());

    this.table.addEventListener("mouseover", (e) => this.showButtonHandler(e));

  }

  createButton(element, className, text, handler) {
    this.mainContainer.appendChild(element);
    element.innerText = text;
    element.classList.add('button', className);
    element.addEventListener("click", handler);
  }

  addRowHandler() {
    let amountColumns = this.table.rows[0].cells.length;
    let newRow = this.tblBody.insertRow();

    for (let i = 0; i < amountColumns; i++) {
      newRow.insertCell(i);
    }
  }

  addColumnHandler() {
    let tableStr = this.table.rows;

    for (let i = 0; i < tableStr.length; i++) {
      tableStr[i].insertCell();
    }
  }

  removeRowHandler() {

    if (!this.removeRowButton.hasAttribute('data-delete-row')) return;

    let amountRows = this.table.rows.length;

    if (amountRows === 1) return;

    let rowDeletionInd = parseInt(this.removeRowButton.getAttribute('data-delete-row'), 10);

    this.table.deleteRow(rowDeletionInd);

    this.checkPositionButtons(
      this.removeRowButton,
      'data-delete-row',
      'top',
      rowDeletionInd,
      amountRows - 1
    )
  }

  removeColumnHandler() {

    if (!this.removeColumnButton.hasAttribute('data-delete-column')) return;

    let amountColumns = this.table.rows[0].cells.length;
    let amountRows = this.table.rows.length;

    if (amountColumns === 1) return;

    let columnDeletionIn = parseInt(this.removeColumnButton.getAttribute('data-delete-column'), 10);

    for (let i = 0; i < amountRows; i++) {
      this.table.rows[i].deleteCell(columnDeletionIn);
    }

    this.checkPositionButtons(
      this.removeColumnButton,
      'data-delete-column',
      'left',
      columnDeletionIn,
      amountColumns - 1
    )
  }

  checkPositionButtons(element, attribute, property, index, amount) {

    if (amount === index) {
      index--;
    }

    Object.assign(element.style, {[property]: index * 52 + 56 + 'px'});
    element.setAttribute(attribute, index.toString());

    this.removeRowButton.classList.add('visibility');
    this.removeColumnButton.classList.add('visibility');

    if (this.table.rows.length <= 1) {
      this.removeRowButton.classList.remove('visibility');
    }

    if (this.table.rows[0].cells.length <= 1) {
      this.removeColumnButton.classList.remove('visibility');
    }
  }

  showButtonHandler(event) {
    let elem = event.target;
    let rowInd = elem.parentElement.rowIndex;
    let columnInd = elem.cellIndex;

    if (columnInd || columnInd === 0) {
      this.checkPositionButtons(
        this.removeColumnButton,
        'data-delete-column',
        'left',
        columnInd
      )
    }

    if (rowInd || rowInd === 0) {
      this.checkPositionButtons(
        this.removeRowButton,
        'data-delete-row',
        'top',
        rowInd
      )
    }
  }
}


