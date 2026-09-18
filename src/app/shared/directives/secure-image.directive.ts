import { Directive, ElementRef, Input, OnChanges, OnDestroy, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'img[secureSrc]',
  standalone: true
})
export class SecureImageDirective implements OnChanges, OnDestroy {
  @Input('secureSrc') url?: string | null;
  private el = inject(ElementRef);
  private http = inject(HttpClient);
  private sub?: Subscription;
  private objectUrl?: string;

  ngOnChanges() {
    this.cleanup();
    if (!this.url) {
      this.el.nativeElement.src = '';
      return;
    }
    
    if (this.url.startsWith('blob:') || this.url.startsWith('data:')) {
      this.el.nativeElement.src = this.url;
      return;
    }
    
    this.sub = this.http.get(this.url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.objectUrl = URL.createObjectURL(blob);
        this.el.nativeElement.src = this.objectUrl;
      }
    });
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    this.sub?.unsubscribe();
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }
}
