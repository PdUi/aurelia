import {inject} from 'aurelia-framework';
import {IndividualFactory} from 'factories/individual-factory';
import {PagerOptions} from 'components/pager/pager-options';
import {GridOptions} from 'components/grid/grid-options';
import {GridAction} from 'components/grid/grid-action';
import {ColumnDefinition} from 'components/grid/column-definition';

@inject(IndividualFactory)
export class App {
  public gridSettings: any;
  public numberOfRecords: number;
  public gridData: any[];
  private individualFactory: IndividualFactory;
  public gridActions: GridAction[];
  public pagerSettings: PagerOptions;
  public currentPage: number = 0;
  public pagedGridId: string = 'TestPagedGrid';

  constructor(individualFactory) {
    this.pagerSettings = new PagerOptions().update({
      totalNumberOfRecords: 100,
      enablePageInput: true,
      enablePageArrows: true,
      enableFirstLastPageArrows: true
    });

    this.individualFactory = individualFactory;

    this.gridSettings = new GridOptions().update({
      columnDefinitions: [
          { propertyName: 'firstName', displayName: 'First Name' },
          { propertyName: 'lastName', displayName: 'Last Name' }
      ],
      enableInlineEditing: true,
      enableColumnSorting: true,
      sort: this.sort
    });

    this.gridActions = [
      { description: 'View', action: this.view },
      { description: 'Edit', action: this.edit },
      { description: 'Delete', action: this.delete }
    ];

    let numberOfRecords = 10;
    this.gridData = this.generateGridRows(numberOfRecords);
  }
  
  generateGridRows(numberOfRecords: number) {
    var rows = [];

    if (numberOfRecords > 0) {
        for (var i = 0; i < numberOfRecords; i++) {
            rows.push(this.individualFactory.individual());
        }
    }

    return rows;
  }
  
  edit(individual) {
      console.log('edit:' + individual.id);
  };

  sort(column: ColumnDefinition, sortDirection: string) {
      var sortedRows = this.data.sort((a, b) => a[column.propertyName].localeCompare(b[column.propertyName]));
      // var sortedRows = this.gridData.sort((a, b) => {
      //   if(a[column.propertyName] < b[column.propertyName]) return -1;
      //   if(a[column.propertyName] > b[column.propertyName]) return 1;
      //   return 0;
      // });

      if (sortDirection === 'descending') {
          sortedRows.reverse();
      }

      return sortedRows;
  };

  view(individual) {
      console.log('view:' + individual.id);
  };

  delete(individual) {
      console.log('delete:' + individual.id);
  };
}
