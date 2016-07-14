import {bindable, containerless, inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ColumnDefinition} from './column-definition';
import {GridOptions} from './grid-options';
import {GridAction} from './grid-action';

let logger = LogManager.getLogger('grid');

@containerless()
@inject(EventAggregator)
export class Grid {
  @bindable public data: any[];
  @bindable public actions: GridAction[];
  @bindable public options: GridOptions;

  @bindable public selectedColumnId: number;
  @bindable public selectedRowId: number;
  @bindable public sortedColumnId: number;
  @bindable public hoveredRowId: number;
  @bindable public hoveredColumnId: number;

  public columnDefinitions: ColumnDefinition[];
  public enableInlineEditing: boolean;
  public enableColumnSorting: boolean;
  public rows: any[];
  public sortDirection: string;
  public hasIndividualColumnPerAction: boolean;
  private _id: string;
  private _eventAggregator: EventAggregator;

  public constructor(eventAggregator: EventAggregator) {
    logger.info('constructor');
    this._eventAggregator = eventAggregator;
    this.processOptions(new GridOptions());
    this.data = [];
    this.sortDirection = 'none';
    this.actions = [];
  }

  public bind() {
    logger.info('bind');
    this.processOptions(this.options);
    this.createRows(this.data);
  }

  private processOptions(options: GridOptions) {
    logger.info('processOptions(' + JSON.stringify(options) + ')');
    this.columnDefinitions = options.columnDefinitions || this.columnDefinitions;
    this.enableInlineEditing = options.enableInlineEditing || this.enableInlineEditing;
    this.enableColumnSorting = options.enableColumnSorting || this.enableColumnSorting;
    this.hasIndividualColumnPerAction = options.hasIndividualColumnPerAction || this.hasIndividualColumnPerAction;
    this._sort = options.sort;
  }

  private createRows(data: any[]) {
    logger.info('createRows(' + JSON.stringify(data) + ')');
    this.rows = data;
    for(var i = 0, l = this.rows.length; i < l; i++) {
      let row = this.rows[i];
      row.changes = Object.assign({}, row);
      row.hasChanged = false;
    }
  }

  public onCellClicked(event, columnDefinition, row) {
    logger.info('onCellClicked(' + JSON.stringify(event) + ', ' + JSON.stringify(columnDefinition) + ', ' + JSON.stringify(row) + ')');
    if (this.enableInlineEditing) {
      this.selectedColumnId = columnDefinition.id;
      this.selectedRowId = row.id;
      this.giveCellInputFocus(event.toElement);
    }
  }

  public onCellDblClicked(event, columnDefinition, row) {
    logger.info('onCellDblClicked(' + JSON.stringify(event) + ', ' + JSON.stringify(columnDefinition) + ', ' + JSON.stringify(row) + ')');
    if (this.enableInlineEditing) {
      this.selectedColumnId = columnDefinition.id;
      this.selectedRowId = row.id;
      this.giveCellInputFocus(event.toElement);
    }
  }

  private giveCellInputFocus(toElement) {
    logger.info('giveCellInputFocus(' + JSON.stringify(toElement.outerHTML) + ')');
    var td = toElement.nodeName === "TD" ? toElement : toElement.parentElement;
    var input = td.children[0];
    setTimeout(function () {
      input.focus();
      var endPosition = input.value.length;
      input.setSelectionRange(endPosition, endPosition);
    }, 1);
  }

  public onMouseEnter(event, columnDefinition, row) {
    logger.info('onMouseEnter(' + JSON.stringify(event) + ', ' + JSON.stringify(columnDefinition) + ', ' + JSON.stringify(row) + ')');
    this.hoveredColumnId = columnDefinition.id;
    this.hoveredRowId = row.id;
  }

  public onMouseLeave(event, columnDefinition, row) {
    logger.info('onMouseLeave(' + JSON.stringify(event) + ', ' + JSON.stringify(columnDefinition) + ', ' + JSON.stringify(row) + ')');
    this.hoveredColumnId = null;
    this.hoveredRowId = null;
  }

  public onBlur(event, columnDefinition, row) {
    logger.info('onBlur(' + JSON.stringify(event) + ', ' + JSON.stringify(columnDefinition) + ', ' + JSON.stringify(row) + ')');
    this.selectedColumnId = null;
    this.selectedRowId = null;
     if(row.changes[columnDefinition.propertyName] !== row[columnDefinition.propertyName]) {
       row.hasChanged = true;
     } else {
       row.hasChanged = this.rowHasChanges(row);
     }
  }

  public clearChange(event, columnDefinition, row) {
    logger.info('clearChange(' + JSON.stringify(event) + ', ' + JSON.stringify(columnDefinition) + ', ' + JSON.stringify(row) + ')');
    row.changes[columnDefinition.propertyName] = row[columnDefinition.propertyName];
    row.hasChanged = this.rowHasChanges(row);
  }

  public sortColumn(event, columnDefinition) {
    logger.info('sortColumn(' + JSON.stringify(event) + ', ' + JSON.stringify(columnDefinition) + ')');

    if (this.sortedColumnId !== columnDefinition.id) {
        this.sortDirection = 'none';
    }

    if (this.sortDirection === 'none') {
        this.sortedColumnId = columnDefinition.id;
        this.sortDirection = 'ascending';
    } else if (this.sortDirection === 'ascending') {
        this.sortedColumnId = columnDefinition.id;
        this.sortDirection = 'descending';
    } else {
        this.sortedColumnId = null;
        this.sortDirection = 'none';
    }

    this._eventAggregator.publish('SortRequested', {id: this._id, columnDefinition: columnDefinition, sortDirection: this.sortDirection});
  }

  public performAction(action: GridAction, row: any) {
    logger.info('performAction(' + JSON.stringify(action) + ', ' + JSON.stringify(row) + ')');
    this._eventAggregator.publish(action.description + 'Requested', {id: this._id, row: row});
  }

  public rowHasChanges(row: any) {
    logger.info('rowHasChanges(' + JSON.stringify(row) + ')');
    for(var i = 0, l = this.columnDefinitions.length; i < l; i++) {
      var columnDefinition = this.columnDefinitions[i];
      if(columnDefinition.isVisible && row[columnDefinition.propertyName] !== row.changes[columnDefinition.propertyName]) {
        return true;
      }
    }

    return false;
  }

  private first(array, delegate) {
    logger.info('first(' + JSON.stringify(array) + ', ' + JSON.stringify(delegate) + ')');
    for(var i = 0, l = array.length; i < l; i++) {
      if(delegate(array[i])) {
        return array[i];
      }
    }

    throw new Error('Unable to find item matching request.');
  }

  private _sort: (column: ColumnDefinition, sortDirection: string) => any[];

// TODO: research EventAggregator as a better way to handle this
  private sort(columnDefinition: ColumnDefinition) {
    logger.info('sort(' + JSON.stringify(columnDefinition) + ')');
    if(this._sort) {
      this.createRows(this._sort(columnDefinition, this.sortDirection));
    }
  }
}