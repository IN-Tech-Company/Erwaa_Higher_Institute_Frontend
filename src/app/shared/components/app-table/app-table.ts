import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface AppTableCol<T = unknown> {
  key: string;
  header: string;
  width?: string;
  cell?: (row: T) => string | number;
  cellTpl?: TemplateRef<{ $implicit: T }>;
}

export interface AppTabFilter {
  value: string;
  label: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './app-table.html',
  styleUrl: './app-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTableComponent {
  readonly rows = input.required<unknown[]>();
  readonly columns = input.required<AppTableCol[]>();
  readonly loading = input(false);
  readonly skeletonRows = input(5);
  readonly emptyText = input('لا توجد بيانات');

  readonly searchable = input(false);
  readonly searchPlaceholder = input('بحث...');
  readonly serverSearch = input(false);
  readonly searchFn = input<(row: unknown, q: string) => boolean>(() => true);
  readonly searchChange = output<string>();

  readonly tabFilters = input<AppTabFilter[]>([]);
  readonly serverFilter = input(false);
  readonly filterFn = input<(row: unknown, f: string) => boolean>(() => true);
  readonly filterChange = output<string>();

  readonly rowClickable = input(false);
  readonly rowClick = output<unknown>();

  readonly mobileRowTpl = input<TemplateRef<{ $implicit: unknown }> | null>(null);

  readonly showFooter = input(true);
  readonly footerLabelFn = input<(n: number) => string>(n => String(n));

  // Set to false when the caller already paginates `rows` itself (server-side
  // page params, infinite scroll / "load more"), so this component doesn't
  // slice an already-partial list into a second, conflicting pager.
  readonly paginated = input(true);
  readonly pageSize = input(10);
  readonly showingLabelFn = input<(from: number, to: number, total: number) => string>(
    (from, to, total) => `${from}–${to} من ${total}`
  );

  readonly searchQ = signal('');
  readonly activeFilter = signal('all');
  private readonly currentPageRaw = signal(1);

  private readonly searchSubject = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.searchSubject
      .pipe(debounceTime(400), takeUntilDestroyed())
      .subscribe(q => this.searchChange.emit(q));
  }

  readonly filteredRows = computed(() => {
    const q = this.serverSearch() ? '' : this.searchQ().toLowerCase().trim();
    const f = this.serverFilter() ? '' : this.activeFilter();
    return this.rows().filter(row => {
      const matchQ = !q || this.searchFn()(row, q);
      const matchF = !f || this.filterFn()(row, f);
      return matchQ && matchF;
    });
  });

  readonly tabCounts = computed(() =>
    this.tabFilters().map(tab => ({
      ...tab,
      count: this.serverFilter()
        ? null
        : this.rows().filter(row => this.filterFn()(row, tab.value)).length,
    }))
  );

  readonly skeletonArray = computed(() => Array.from({ length: this.skeletonRows() }));

  readonly footerLabel = computed(() => this.footerLabelFn()(this.filteredRows().length));

  readonly pageCount = computed(() => {
    if (!this.paginated()) return 1;
    return Math.max(1, Math.ceil(this.filteredRows().length / this.pageSize()));
  });

  readonly currentPage = computed(() => Math.min(this.currentPageRaw(), this.pageCount()));

  readonly pagedRows = computed(() => {
    if (!this.paginated()) return this.filteredRows();
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredRows().slice(start, start + this.pageSize());
  });

  readonly showingLabel = computed(() => {
    const total = this.filteredRows().length;
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = Math.min(start + this.pageSize(), total);
    return this.showingLabelFn()(total === 0 ? 0 : start + 1, end, total);
  });

  // Windowed page numbers around the current page, with `null` standing in for an ellipsis.
  readonly pageNumbers = computed(() => {
    const total = this.pageCount();
    const cur = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set<number>([1, total, cur, cur - 1, cur + 1]);
    const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);

    const result: (number | null)[] = [];
    let prev = 0;
    for (const p of sorted) {
      if (prev && p - prev > 1) result.push(null);
      result.push(p);
      prev = p;
    }
    return result;
  });

  onSearch(e: Event): void {
    const q = (e.target as HTMLInputElement).value;
    this.searchQ.set(q);
    this.currentPageRaw.set(1);
    this.searchSubject.next(q);
  }

  onTabClick(value: string): void {
    this.activeFilter.set(value);
    this.currentPageRaw.set(1);
    if (this.serverFilter()) this.filterChange.emit(value);
  }

  goToPage(page: number): void {
    this.currentPageRaw.set(page);
  }

  onRowClick(row: unknown): void {
    if (this.rowClickable()) this.rowClick.emit(row);
  }

  getCell(col: AppTableCol, row: unknown): string | number {
    return col.cell ? col.cell(row) : '';
  }

  trackById(_: number, row: unknown): unknown {
    return (row as { id: unknown }).id ?? _;
  }
}
