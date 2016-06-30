import {bindable, containerless, inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PagerOptions} from '../pager/pager-options';

let logger = LogManager.getLogger('paged-grid');

@containerless()
@inject(EventAggregator)
export class PagedGrid {
  @bindable public pagerOptions: PagerOptions;
  @bindable public id: string;

  public page;

  private _eventAggregator: EventAggregator;

  constructor(eventAggregator: EventAggregator, id: string = null) {
    logger.info('constructor');
    this._eventAggregator = eventAggregator;
  }

  bind() {
    logger.info('bind');
    this.pagerOptions.id = this.id || this.pagerOptions.id;

    this._eventAggregator.subscribe('PageChangeOccurred', payload => {
      if(payload.id === this.id) {
        this.page = payload.currentPage;
      }
    });
  }
}
