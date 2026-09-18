import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../popup/popup';

@Component({
  selector: 'app-help-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupComponent],
  templateUrl: './help-popup.html',
  styleUrl: './help-popup.scss'
})
export class HelpPopupComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() sent = new EventEmitter<string>();

  message = '';

  onClose() {
    this.close.emit();
  }

  onSend() {
    if (!this.message.trim()) return;
    this.sent.emit(this.message);
    this.message = '';
    this.close.emit();
  }
}