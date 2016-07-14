export class ColumnDefinition {
  public id: number;
  public propertyName: string = '';
  public displayName: string = '';
  public isVisible: boolean = true;

/* All to be handled with Event Aggregator or passed in functions?
  public onClick: Function;
  public onDoubleClick: Function;
  public onBlur: Function;
  public onMouseEnter: Function;
  public onMouseLeave: Function;
  public onSort: Function;
  public actions: Function[];
*/
}