import {inject} from 'aurelia-framework';
// import {IndividualFactory} from 'factories/individual-factory';
import {PagerOptions} from 'components/pager/pager-options';
// import {GridOptions} from 'components/grid/grid-options';

// @inject(IndividualFactory)
export class App {
  // public gridSettings: any;
  // public numberOfRecords: number;
  // public gridData: any[];
  // private individualFactory: IndividualFactory;
  
  // pageAction(pageIndex){
  //     var index = pageIndex || this.pagerSettings.currentPage;
  //     this.gridSettings.data.rows = this.generateGridRows();
  // }
  
  public pagerSettings: PagerOptions;
  public currentPage: number = 0;
  //constructor(individualFactory) {
  constructor() {
    this.pagerSettings = new PagerOptions().update({
      totalNumberOfRecords: 100,
      enablePageInput: true,
      enablePageArrows: true,
      enableFirstLastPageArrows: true
    });

    // this.individualFactory = individualFactory;

    // this.gridSettings = new GridOptions().update({
    //   // actions: [
    //   //   { name: 'View', action: this.view },
    //   //   // { name: 'Edit', action: this.edit },
    //   //   // { name: 'Delete', action: this.delete },
    //   //   // { name: 'Sort', action: this.sort }
    //   // ],
    //   columnDefinitions: [
    //       { propertyName: 'firstName', displayName: 'First Name' },
    //       { propertyName: 'lastName', displayName: 'Last Name' }
    //   ],
    //   enableInlineEditing: true//,
    //   //pageAction: this.pageAction
    // });

    // let numberOfRecords = 10;
    // this.gridData = this.generateGridRows(numberOfRecords);
  }
  
  // generateGridRows(numberOfRecords: number) {
  //   var rows = [];

  //   if (numberOfRecords > 0) {
  //       for (var i = 0; i < numberOfRecords; i++) {
  //           rows.push(this.individualFactory.individual());
  //       }
  //   }

  //   return rows;
  // }
  
  // edit(individual) {
  //     console.log('edit:' + individual.id);
  // };

  // sort(rows, column, sortDirection) {
  //     var sortedRows = rows;//_.sortBy(vm.gridData.rows, column.id);
  //     if (sortDirection === 'descending') {
  //         sortedRows.reverse();
  //     }
  //     console.log('sort:' + column.id);

  //     return sortedRows;
  // };
  
  // view(individual) {
  //     console.log('view:' + individual.id);
  // };
  
  // delete(individual) {
  //     console.log('delete:' + individual.id);
  // };
}
