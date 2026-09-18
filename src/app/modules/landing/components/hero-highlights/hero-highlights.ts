import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface HighlightCard {
  icon: string;
  titleKey: string;
  descKey: string;
}

@Component({
  selector: 'app-hero-highlights',
  imports: [TranslatePipe],
  templateUrl: './hero-highlights.html',
  styleUrl: './hero-highlights.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroHighlightsComponent {
  readonly cards: HighlightCard[] = [
    { icon: 'workspace_premium', titleKey: 'LANDING.HIGHLIGHTS.ITEM1_TITLE', descKey: 'LANDING.HIGHLIGHTS.ITEM1_DESC' },
    { icon: 'travel_explore', titleKey: 'LANDING.HIGHLIGHTS.ITEM2_TITLE', descKey: 'LANDING.HIGHLIGHTS.ITEM2_DESC' },
    { icon: 'military_tech', titleKey: 'LANDING.HIGHLIGHTS.ITEM3_TITLE', descKey: 'LANDING.HIGHLIGHTS.ITEM3_DESC' },
  ];
}
