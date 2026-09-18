import { Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter, Input, signal, NgZone } from '@angular/core';

@Directive({
  selector: '[appAnimateOnScroll]',
  exportAs: 'animateOnScroll',
  standalone: true
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  @Input() threshold = 0.1; // 10% of element visible
  @Input() rootMargin = '0px';

  @Output() visibilityChange = new EventEmitter<'visible' | 'hidden'>();

  public state = signal<'hidden' | 'visible'>('hidden');

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    const options = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.ngZone.run(() => {
            this.state.set('visible');
            this.visibilityChange.emit('visible');
          });
          // Animate only once
          if (this.observer) {
            this.observer.unobserve(this.el.nativeElement);
          }
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);

    // Set initial state to hidden
    this.state.set('hidden');
    this.visibilityChange.emit('hidden');
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

