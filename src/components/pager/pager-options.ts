import {LogManager} from 'aurelia-framework';

let logger = LogManager.getLogger('pager-options');

export class PagerOptions {
  public constructor() {
    logger.info('constructor');
    this.convertFromDecimal = this._convertFromDecimal;
    this.convertToDecimal = this._convertToDecimal;
    this.totalNumberOfRecords = 0;
    this.enableFirstLastPageArrows = false;
    this.enablePageArrows = false;
    this.enablePageInput = false;
    this.maximumNumberOfExplicitPagesToDisplay = 7;
    this.pageSize = 10;
  }

  public update(options: any): PagerOptions {
    logger.info('update(' + JSON.stringify(options) + ')');
    this.convertFromDecimal = options.convertFromDecimal || this.convertFromDecimal;
    this.convertToDecimal = options.convertToDecimal || this.convertToDecimal;
    this.totalNumberOfRecords = options.totalNumberOfRecords || this.totalNumberOfRecords;
    this.enableFirstLastPageArrows = options.enableFirstLastPageArrows || this.enableFirstLastPageArrows;
    this.enablePageArrows = options.enablePageArrows || this.enablePageArrows;
    this.enablePageInput = options.enablePageInput || this.enablePageInput;
    this.maximumNumberOfExplicitPagesToDisplay = options.maxmimumNumberOfExplicitPagesToDisplay || this.maximumNumberOfExplicitPagesToDisplay;
    this.pageSize = options.pageSize || this.pageSize;
    this.id = options.id || this.id;

    return this;
  }

  public convertFromDecimal: (decimalNumeralRepresentation: number) => any;
  public convertToDecimal: (alternativeNumeralRepresentation: any) => number;
  public totalNumberOfRecords: number;
  public id: string;

  public get firstPage(): number {
    logger.info('get:firstPage');
    return this._firstPage;
  }

  public get hasMultiplePages(): boolean {
    logger.info('get:hasMultiplePages');
    return this.totalPages > this.firstPage;
  }

  public get totalPages(): number {
    logger.info('get:totalPages');
    return this.pageSize && this.totalNumberOfRecords ? this.totalNumberOfRecords / this.pageSize : 0;
  }

  public get enableFirstLastPageArrows(): boolean {
    logger.info('get:enableFirstLastPageArrows');
    return this.enablePageArrows && this._enableFirstLastPageArrows;
  }

  public set enableFirstLastPageArrows(enableFirstLastPageArrows: boolean) {
    logger.info('set:enableFirstLastPageArrows = ' + enableFirstLastPageArrows);
    this._enableFirstLastPageArrows = enableFirstLastPageArrows;
  }

  public get enablePageArrows(): boolean {
    logger.info('get:enablePageArrows');
    return this._enablePageArrows && this.hasMultiplePages;
  }

  public set enablePageArrows(enablePageArrows: boolean) {
    logger.info('set:enablePageArrows = ' + enablePageArrows);
    this._enablePageArrows = enablePageArrows;
  }

  public get enablePageInput(): boolean {
    logger.info('get:enablePageInput');
    return this._enablePageInput && this.hasMultiplePages;
  }

  public set enablePageInput(enablePageInput: boolean) {
    logger.info('set:enablePageInput = ' + enablePageInput);
    this._enablePageInput = enablePageInput;
  }

  public get maximumNumberOfExplicitPagesToDisplay(): number {
    logger.info('get:maximumNumberOfExplicitPagesToDisplay');
    return this._maximumNumberOfExplicitPagesToDisplay;
  }

  public set maximumNumberOfExplicitPagesToDisplay(maximumNumberOfExplicitPagesToDisplay: number) {
    logger.info('set:maximumNumberOfExplicitPagesToDisplay = ' + maximumNumberOfExplicitPagesToDisplay);
    this._maximumNumberOfExplicitPagesToDisplay = Math.max((maximumNumberOfExplicitPagesToDisplay || 7), 5);
  }

  public get pageSize(): number {
    logger.info('get:pageSize');
    return this._pageSize;
  }

  public set pageSize(pageSize: number) {
    logger.info('set:pageSize');
    this._pageSize = pageSize;
  }

  private _enableFirstLastPageArrows: boolean;
  private _enablePageArrows: boolean;
  private _enablePageInput: boolean;
  private _firstPage: number = 1;
  private _maximumNumberOfExplicitPagesToDisplay: number;
  private _pageSize: number;

  private _convertToDecimal(alternativeNumeralRepresentation) {
    logger.info('_convertToDecimal(' + alternativeNumeralRepresentation + ')');
    return parseInt(alternativeNumeralRepresentation, 10);
  }

  private _convertFromDecimal(decimalNumeralRepresentation) {
    logger.info('_convertFromDecimal(' + decimalNumeralRepresentation + ')');
    return decimalNumeralRepresentation;
  }
}