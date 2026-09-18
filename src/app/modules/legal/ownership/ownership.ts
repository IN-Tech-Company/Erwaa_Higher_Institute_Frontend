import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ownership',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './ownership.html',
  styleUrl: './ownership.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnershipComponent {}
