import {bindable, containerless, inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PagerOptions} from 'components/pager/pager-options';

let logger = LogManager.getLogger('pager');

@containerless()
@inject(EventAggregator)
export class Pager {
  @bindable public options: PagerOptions;

  public currentPage: number;
  public canPageBackward: boolean;
  public canPageForward: boolean;
  public displayPageInput: any;
  public enablePageArrows: boolean;
  public enablePageInput: boolean = false;
  public enableFirstLastPageArrows: boolean;
  public firstPage: number;
  public hasMorePagesBackward: boolean;
  public hasMorePagesForward: boolean;
  public hasMultiplePages: boolean = false;
  public isValidPageInput: boolean;
  public pagesRange: any[] = [];
  public totalNumberOfPages: number;

  private _eventAggregator: EventAggregator;
  private _displayCurrentPage: any;
  private _options: PagerOptions;
  private _id: string;

  public constructor(eventAggregator: EventAggregator) {
    logger.info('constructor');
    this._eventAggregator = eventAggregator;
    this.processOptions(new PagerOptions());
    this.displayCurrentPage = 1;
  }

  public bind() {
    logger.info('bind');
    logger.info(JSON.stringify(this.options));
    this.processOptions(this.options);
    this._eventAggregator.publish('PageChangeOccurred', {id: this._id, currentPage: this.currentPage});
  }

  private processOptions(options: PagerOptions) {
    logger.info('processOptions(' + JSON.stringify(options) + ')');
    this._options = options || this._options;

    let firstPage = this._options.convertFromDecimal(this._options.firstPage);
    this.firstPage = firstPage;
    this.displayPageInput = firstPage;
    this.currentPage = firstPage;
    this.totalNumberOfPages = this._options.convertFromDecimal(this._options.totalPages);
    this.enablePageInput = this._options.enablePageInput;
    this.hasMultiplePages = this._options.hasMultiplePages;
    this.enablePageArrows = this._options.enablePageArrows;
    this.enableFirstLastPageArrows = this._options.enableFirstLastPageArrows;
    this._id = this._id || this._options.id;
    this.updateState();
  }

  public get displayCurrentPage(): any {
    logger.info('get:displayCurrentPage');
    return this._displayCurrentPage;
  }

  public set displayCurrentPage(currentPage: any) {
    logger.info('set:displayCurrentPage = ' + currentPage);
    this.currentPage = this._options.convertToDecimal(currentPage);
    this._eventAggregator.publish('PageChangeOccurred', {id: this._id, currentPage: this._options.convertToDecimal(currentPage)});
    this._displayCurrentPage = currentPage;
  }

  public pageTo(pageIndex: number) {
    logger.info('pageTo(' + pageIndex + ')');
    if(pageIndex > 0 && pageIndex <= this._options.totalPages){
      this.displayCurrentPage = this._options.convertFromDecimal(pageIndex);
      this.displayPageInput = this.displayCurrentPage;
      this.updateState();
    }
  }

  public pageToBeginning() {
    logger.info('pageToBeginning');
    this.pageTo(this._options.firstPage);
  }

  public retreat() {
    logger.info('retreat');
    if (this.canPageBackward) {
      this.pageTo(this.currentPage - 1);
    }
  }

  public isCurrentPage(page) {
    logger.info('isCurrentPage(' + page + ')');
    return this.currentPage === page;
  }

  public advance() {
    logger.info('advance');
    if (this.currentPage < this._options.totalPages) {
      this.pageTo(this.currentPage + 1);
    }
  }

  public pageToEnd() {
    logger.info('pageToEnd');
    this.pageTo(this._options.totalPages);
  }

  private validatePageInput() {
    logger.info('validatePageInput');
    let pageInput = this._options.convertToDecimal(this.displayPageInput);

    this.isValidPageInput = pageInput && !isNaN(pageInput) && pageInput >= 1 && pageInput <= this._options.totalPages;
  }

  public updateCurrentPage() {
    logger.info('updateCurrentPage');
    this.validatePageInput();

    if(this.isValidPageInput) {
      this.pageTo(this._options.convertToDecimal(this.displayPageInput));
    }
  }

  private updateState() {
    logger.info('updateState');
    let firstPage = this._options.firstPage;
    let maximumNumberOfExplicitPagesToDisplay = this._options.maximumNumberOfExplicitPagesToDisplay;
    let totalPages = this._options.totalPages;

    this.canPageBackward = this.currentPage > firstPage;
    this.canPageForward = this.currentPage < totalPages;

    this.hasMorePagesBackward = false;
    this.hasMorePagesForward = false;

    if (this.currentPage > firstPage + 2 && totalPages > maximumNumberOfExplicitPagesToDisplay) {
      this.hasMorePagesBackward = true;
    }

    if (this.currentPage < totalPages - 2 && totalPages > maximumNumberOfExplicitPagesToDisplay) {
      this.hasMorePagesForward = true;
    }

    let rangeStart;
    let rangeEnd;
    if (!this.hasMorePagesBackward && !this.hasMorePagesForward) {
      rangeStart = firstPage + 1;
      rangeEnd = totalPages;
    } else if (!this.hasMorePagesBackward) {
      rangeStart = firstPage + 1;
      rangeEnd = maximumNumberOfExplicitPagesToDisplay - 1;
    } else if (!this.hasMorePagesForward) {
      rangeEnd = totalPages;
      rangeStart = totalPages - maximumNumberOfExplicitPagesToDisplay + 3;
    } else {
      let hasOddNumberOfButtons = (maximumNumberOfExplicitPagesToDisplay % 2) === 1;
      let x = Math.ceil((maximumNumberOfExplicitPagesToDisplay - 5) / 2);

      if (this.currentPage + x === totalPages - 2) {
        this.hasMorePagesForward = false;
        rangeStart = this.currentPage - x;
        rangeEnd = totalPages;
      } else {
        if (hasOddNumberOfButtons) {
          rangeStart = this.currentPage - x;
          rangeEnd = this.currentPage + x + 1;
        } else {
          rangeStart = this.currentPage - x + 1;
          rangeEnd = this.currentPage + x + 1;
        }
      }
    }

    this.pagesRange = [];
    for (;rangeStart < rangeEnd; rangeStart++) {
      this.pagesRange.push({displayPage: this._options.convertFromDecimal(rangeStart), page: rangeStart });
    }

    this.validatePageInput();
  }
}