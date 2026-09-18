import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LanguageStoreService } from '../../services/language-store.service';
import { PanelService } from '../../services/panel.service';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent {
  readonly svc = inject(PanelService);
  readonly lang = inject(LanguageStoreService).currentLanguage;
}
