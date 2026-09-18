import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface CategoryStat {
  labelKey: string;
  runs: number;
  trainees: number;
}

@Component({
  selector: 'app-program-history-section',
  imports: [TranslatePipe],
  templateUrl: './program-history.html',
  styleUrl: './program-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramHistorySectionComponent {
  readonly categories: CategoryStat[] = [
    { labelKey: 'ROW1', runs: 2, trainees: 50 },
    { labelKey: 'ROW2', runs: 17, trainees: 255 },
    { labelKey: 'ROW3', runs: 55, trainees: 853 },
  ];

  readonly totalRuns = computed(() => this.categories.reduce((sum, c) => sum + c.runs, 0));
  readonly totalTrainees = computed(() => this.categories.reduce((sum, c) => sum + c.trainees, 0));
}
