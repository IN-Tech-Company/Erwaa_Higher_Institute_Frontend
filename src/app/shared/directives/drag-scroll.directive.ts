import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appDragScroll]',
  standalone: true,
})
export class DragScrollDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent): void {
    this.isDragging = true;
    this.startX = e.pageX - this.el.nativeElement.offsetLeft;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
    this.el.nativeElement.style.cursor = 'grabbing';
    this.el.nativeElement.style.userSelect = 'none';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;
    e.preventDefault();
    const x = e.pageX - this.el.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.2;
    this.el.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onMouseUp(): void {
    this.isDragging = false;
    this.el.nativeElement.style.cursor = 'grab';
    this.el.nativeElement.style.removeProperty('user-select');
  }
}
