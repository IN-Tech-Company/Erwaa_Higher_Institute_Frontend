import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-doc-viewer',
  standalone: true,
  imports: [],
  templateUrl: './doc-viewer.html',
  styleUrl: './doc-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocViewerComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly url = input<string | null>(null);
  readonly name = input('');
  readonly closed = output<void>();

  readonly isImage = computed(() => {
    const ext = this.name().split('.').pop()?.toLowerCase() ?? '';
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  });

  readonly safeUrl = computed<SafeResourceUrl | null>(() => {
    const u = this.url();
    return u ? this.sanitizer.bypassSecurityTrustResourceUrl(u) : null;
  });

  close(): void { this.closed.emit(); }
}
