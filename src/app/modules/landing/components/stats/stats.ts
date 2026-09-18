import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface StatItem {
  numberKey: string;
  labelKey: string;
}

@Component({
  selector: 'app-stats-section',
  imports: [TranslatePipe],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsSectionComponent {
  readonly items: StatItem[] = [
    { numberKey: 'LANDING.STATS.ITEM1_NUMBER', labelKey: 'LANDING.STATS.ITEM1_LABEL' },
    { numberKey: 'LANDING.STATS.ITEM2_NUMBER', labelKey: 'LANDING.STATS.ITEM2_LABEL' },
    { numberKey: 'LANDING.STATS.ITEM3_NUMBER', labelKey: 'LANDING.STATS.ITEM3_LABEL' },
  ];
}
