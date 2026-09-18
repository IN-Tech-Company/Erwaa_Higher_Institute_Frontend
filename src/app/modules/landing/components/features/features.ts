import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface FeatureItem {
  icon: string;
  key: string;
}

interface AccreditationLogo {
  src: string;
  altKey: string;
}

@Component({
  selector: 'app-features-section',
  imports: [TranslatePipe],
  templateUrl: './features.html',
  styleUrl: './features.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesSectionComponent {
  readonly items: FeatureItem[] = [
    { icon: 'workspace_premium', key: 'ITEM1' },
    { icon: 'grid_view', key: 'ITEM2' },
    { icon: 'trending_up', key: 'ITEM3' },
    { icon: 'military_tech', key: 'ITEM4' },
  ];

  readonly accreditations: AccreditationLogo[] = [
    { src: '/assets/images/parteners/tvtc-logo.svg', altKey: 'LANDING.FEATURES.ACCREDIT1' },
    { src: '/assets/images/parteners/national-elearning-center-logo.svg', altKey: 'LANDING.FEATURES.ACCREDIT2' },
    { src: '/assets/images/parteners/manar-platform-logo.png', altKey: 'LANDING.FEATURES.ACCREDIT3' },
  ];
}
