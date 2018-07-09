export default class DynamicTable {
  constructor({
                row = 4,
                column = 4
              }) {
    this.COUNT_ROW = row;
    this.COUNT_COLUMN = column;
    this.state = {
      hideButtonsTimeoutCol: null,
      hideButtonsTimeoutRow: null
    };
    this.mainDiv = document.querySelector('div[data-dynamic-table]');
    this.table = document.createElement('table');
    this.tblBody = document.createElement("tbody");

    this.addRowDiv = document.createElement('div');
    this.addColDiv = document.createElement('div');
    this.deleteColDiv = document.createElement('div');
    this.deleteRowDiv = document.createElement('div');

    this.STYLE_BUTTONS_VISIBLE = {
      opacity: '1',
      visibility: 'visible'
    };
    this.STYLE_BUTTONS_HIDDEN = {
      opacity: '0',
      visibility: 'hidden'
    }
  }

  initialize() {
    this.table.id = 'table';
    this.mainDiv.appendChild(this.table);
    this.table.appendChild(this.tblBody);

    for (let i = 0; i < this.COUNT_ROW; i++) {
      let row = document.createElement("tr");

      for (let j = 0; j < this.COUNT_COLUMN; j++) {
        let cell = document.createElement("td");
        row.appendChild(cell);
      }

      this.tblBody.appendChild(row);
    }

    this.addRowDiv.innerText = "+";
    this.addColDiv.innerText = "+";
    this.deleteColDiv.innerText = "-";
    this.deleteRowDiv.innerText = "-";

    this.createDiv(this.addRowDiv, 'plus-row');
    this.createDiv(this.addColDiv, 'plus-col');
    this.createDiv(this.deleteColDiv, 'del-col');
    this.createDiv(this.deleteRowDiv, 'del-row');

    this.table.addEventListener("mouseover", (e) => this.showDeleteButton(e));
    this.table.addEventListener("mouseout", (e) => this.tableMouseOut(e));
    this.deleteColDiv.addEventListener("mouseover", () => this.divColMouseOver());
    this.deleteColDiv.addEventListener("mouseout", () => this.divColMouseOut());
    this.deleteRowDiv.addEventListener("mouseover", () => this.divRowMouseOver());
    this.deleteRowDiv.addEventListener("mouseout", () => this.divRowMouseOut());
  }

  createDiv(elem, className) {
    this.mainDiv.appendChild(elem);
    elem.classList.add(className);
    elem.addEventListener("click", (e) => this.clickButton(e));
  }

  clickButton(event) {
    let elem = event.target;

    if (elem.tagName !== 'DIV') return;

    if (elem.classList.contains('plus-row')) {
      this.addRow();
    }

    if (elem.classList.contains('plus-col')) {
      this.addColumn();
    }

    if (elem.classList.contains('del-col')) {
      this.deleteRowCol('del-col');
    }

    if (elem.classList.contains('del-row')) {
      this.deleteRowCol('del-row');
    }
  }

  addColumn() {
    let tableStr = this.table.rows;

    for (let i = 0; i < tableStr.length; i++) {
      tableStr[i].insertCell();
    }
  }

  addRow() {
    let countColumns = this.table.rows[0].cells.length;
    let newRow = this.tblBody.insertRow();

    for (let i = 0; i < countColumns; i++) {
      newRow.insertCell(i);
    }
  }

  deleteRowCol(className) {

    if (!this.deleteRowDiv.hasAttribute('data-delete-row') && !this.deleteColDiv.hasAttribute('data-delete-column')) return;

    let countColumns = this.table.rows[0].cells.length;
    let countRows = this.table.rows.length;

    if (className === 'del-col') {

      if (countColumns === 1) return;

      let colInd = parseInt(this.deleteColDiv.getAttribute('data-delete-column'), 10);

      for (let i = 0; i < countRows; i++) {
        this.table.rows[i].deleteCell(colInd);
      }

      if (countColumns - 1 === colInd) {
        this.addAttribute(this.deleteColDiv, 'data-delete-column', 'left', colInd-1);
      }
    }

    if (className === 'del-row') {

      if (countRows === 1) return;

      let rowInd = parseInt(this.deleteRowDiv.getAttribute('data-delete-row'), 10);

      this.table.deleteRow(rowInd);

      if (countRows - 1 === rowInd) {
        this.addAttribute(this.deleteRowDiv, 'data-delete-row', 'top', rowInd-1);
      }
    }
    this.chekedVisible();
  }

  chekedVisible() {

    if (this.table.rows.length <= 1) this.hidden(this.deleteRowDiv);

    if (this.table.rows[0].cells.length <= 1) this.hidden(this.deleteColDiv);

  }

  hidden(hiddenDiv) {
    Object.assign(hiddenDiv.style, this.STYLE_BUTTONS_HIDDEN);
  }

  addAttribute(field, atr, property, ind, visible = false) {

    Object.assign(field.style, { [property]: ind * 52 + 54 + 'px'});

    if(visible) {
      Object.assign(field.style, this.STYLE_BUTTONS_VISIBLE);
    }

    field.setAttribute(atr, ind.toString());
  }

  showDeleteButton(event) {
    clearTimeout(this.state.hideButtonsTimeoutCol);
    clearTimeout(this.state.hideButtonsTimeoutRow);

    let elem = event.target;

    let countRows = this.table.rows.length;
    let countColumns = this.table.rows[0].cells.length;
    let rowInd = elem.parentElement.rowIndex;
    let cellInd = elem.cellIndex;

    this.chekedVisible();

    if ((cellInd || cellInd === 0) && countColumns > 1) {
      this.addAttribute(this.deleteColDiv, 'data-delete-column', 'left', cellInd, true);
    }

    if ((rowInd || rowInd === 0) && countRows > 1) {
      this.addAttribute(this.deleteRowDiv, 'data-delete-row', 'top', rowInd, true);
    }
  }

  tableMouseOut(event) {

    if (!event.relatedTarget || event.relatedTarget.tagName !== 'DIV') return;

    this.state.hideButtonsTimeoutRow = setTimeout(() => {
      this.hidden(this.deleteRowDiv);
    }, 500);

    this.state.hideButtonsTimeoutCol = setTimeout(() => {
      this.hidden(this.deleteColDiv);
    }, 500);
  }

  divColMouseOver() {

    clearTimeout(this.state.hideButtonsTimeoutCol);

    Object.assign(this.deleteColDiv.style,
      (this.table.rows[0].cells.length > 1)
        ? this.STYLE_BUTTONS_VISIBLE
        : this.STYLE_BUTTONS_HIDDEN);
  }

  divColMouseOut() {
    this.state.hideButtonsTimeoutCol = setTimeout(() => {
      this.hidden(this.deleteColDiv);
    }, 500)
  }

  divRowMouseOver(e) {

    clearTimeout(this.state.hideButtonsTimeoutRow);

    Object.assign(this.deleteRowDiv.style,
      (this.table.rows.length > 1)
        ? this.STYLE_BUTTONS_VISIBLE
        : this.STYLE_BUTTONS_HIDDEN);
  }

  divRowMouseOut() {
    this.state.hideButtonsTimeoutRow = setTimeout(() => {
      this.hidden(this.deleteRowDiv);
    }, 500)
  }
}



