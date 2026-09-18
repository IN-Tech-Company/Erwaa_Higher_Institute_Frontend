import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output, signal, ViewChild, ElementRef, afterNextRender, input } from '@angular/core';
import { LanguageStoreService } from '../../services/language-store.service';
import { TranslatePipe } from '@ngx-translate/core';

export interface PersonalData {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  profileImageUrl: string | null;
  storeImageUrl: string | null;
  storeName: string | null;
  sellected?: boolean;
}

export interface ItemData {
  id: number;
  name: string;
  icon: string;
  sellected?: boolean;
}


@Component({
  selector: 'app-layout',
  imports: [TranslatePipe],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {

  @ViewChild('scrollTarget') scrollTarget!: ElementRef;
  @ViewChild('detailsContainer') detailsContainer!: ElementRef;
  private observer: IntersectionObserver | null = null;

  isPersonlaCardSelected = signal<boolean>(true);
  isItemSelected = signal<boolean>(false);
  displayDetails = signal<boolean>(true);
  private mql: MediaQueryList | null = null;

  // Signal-based inputs (Angular 17+)
  personals = input<PersonalData[]>([]);
  items = input<ItemData[]>([]);
  personalsLabel = input<string>('');
  itemsLabel = input<string>('');
  emptyPersonalsLabel = input<string>('COMMON.EMPTY_LIST');
  mergeColumns = input<boolean>(false);
  loadingPersonals = input<boolean>(false);
  lastPersonal = input<boolean>(false);

  @Output() personalSelected = new EventEmitter<number | null>();
  @Output() itemSelected = new EventEmitter<number | null>();
  @Output() loadMorePersonals = new EventEmitter<void>();

  language = inject(LanguageStoreService);
  reverse_dir: 'ltr' | 'rtl' = this.language.direction() === 'rtl' ? 'ltr' : 'rtl';

  constructor() {
    afterNextRender(() => {
      this.setupIntersectionObserver();
      this.mql = window.matchMedia('(max-width: 1200px)');
      this.mql.addEventListener('change', this.onBreakpointChange);
      this.onBreakpointChange(this.mql);
    });
  }



  personalCardClicked(index: number): void {
    this.isPersonlaCardSelected.set(true);
    this.personalSelected.emit(index);
    if (!this.isItemSelected()) {
      this.itemSelected.emit(1);
      this.isItemSelected.set(true);
    }
    this.displayDetails.set(true);
  }

  backArrowClicked(): void {
    this.isPersonlaCardSelected.set(false);
    this.displayDetails.set(false);
    this.personalSelected.emit(null);
    this.itemSelected.emit(null);
    this.isItemSelected.set(false);
  }

  itemCardClicked(id: number): void {
    this.itemSelected.emit(id);
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.lastPersonal() && !this.loadingPersonals()) {
        console.log("last item is visible");
        this.loadMorePersonals.emit();
      }
    }, options);

    if (this.scrollTarget) {
      this.observer.observe(this.scrollTarget.nativeElement);
    }
  }

  private onBreakpointChange = (event: MediaQueryList | MediaQueryListEvent) => {
    if (event.matches) {
      this.displayDetails.set(false);
      this.personalSelected.emit(null);
      this.itemSelected.emit(null);
      this.isPersonlaCardSelected.set(false);
      this.isItemSelected.set(false);
    } else {
      this.displayDetails.set(true);
      if (!this.isPersonlaCardSelected() && this.personals().length > 0) {
        this.personalSelected.emit(0);
        this.itemSelected.emit(1);
        this.isItemSelected.set(true);
        this.isPersonlaCardSelected.set(true);
      }
    }
  };

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.mql) {
      this.mql.removeEventListener('change', this.onBreakpointChange);
    }
  }

}
