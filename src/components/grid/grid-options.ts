import {bindable, containerless, LogManager} from 'aurelia-framework';
import {ColumnDefinition} from 'components/grid/column-definition';

let logger = LogManager.getLogger('grid-options');

export class GridOptions {
  private _columnDefinitions: ColumnDefinition[];
  public sort: (column: ColumnDefinition, sortDirection: string) => any[];

  public get columnDefinitions(): ColumnDefinition[] {
    logger.info('get:columnDefinitions');
    return this._columnDefinitions;
  }
  
  public set columnDefinitions(columnDefinitions: ColumnDefinition[]) {
    logger.info('set:columnDefinitions = ' + JSON.stringify(columnDefinitions));
    this._columnDefinitions = columnDefinitions;
    this.assignColumnIds();
  }
  
  public enableInlineEditing: boolean;
  public enableColumnSorting: boolean;
  public hasIndividualColumnPerAction: boolean;
  public id: string;

  public constructor() {
    logger.info('constructor');
    this.columnDefinitions = [];
    this.enableInlineEditing = false;
    this.enableColumnSorting = false;
    this.hasIndividualColumnPerAction = false;
    this.sort = null;
  }

  public update(options: any): GridOptions {
    logger.info('update(' + JSON.stringify(options) + ')');
    this.columnDefinitions = options.columnDefinitions || this.columnDefinitions;
    this.assignColumnIds();
    this.enableInlineEditing = options.enableInlineEditing || this.enableInlineEditing;
    this.enableColumnSorting = options.enableColumnSorting || this.enableColumnSorting;
    this.hasIndividualColumnPerAction = options.hasIndividualColumnPerAction || this.hasIndividualColumnPerAction;
    this.sort = options.sort || this.sort;

    return this;
  }

  private assignColumnIds() {
    logger.info('assignColumnIds');
    let assignedIds = {};

    for(var i = 0, l = this._columnDefinitions.length; i < l; i++) {
      let columnDefinition = this._columnDefinitions[i];
      if(columnDefinition.id) {
        if(assignedIds[columnDefinition.id]) {
          throw new Error('Columns must be assigned unique ids. Id ' + columnDefinition.id + ' was assigned to more than one column.');
        } else {
          assignedIds[columnDefinition.id] = columnDefinition.id;
        }
      } else {
        if(assignedIds[i]) {
          throw new Error('Columns must be assigned unique ids. Id ' + i + ' was assigned to more than one column.')
        } else {
          columnDefinition.id = i;
          assignedIds[i] = i;
        }
      }
    }
  }
}