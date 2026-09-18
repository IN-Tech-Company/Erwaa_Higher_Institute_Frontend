import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
} from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  state('hidden', style({ opacity: 0 })),
  state('visible', style({ opacity: 1 })),
  transition('hidden => visible', [
    animate('1000ms 200ms ease-out')
  ]),
]);

export const slideInUpAnimation = trigger('slideInUp', [
  state('hidden', style({ opacity: 0, transform: 'translateY(120px)' })),
  state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
  transition('hidden => visible', [
    animate('1000ms 200ms cubic-bezier(0.25, 0.8, 0.25, 1)')
  ]),
]);

export const slideInLeftAnimation = trigger('slideInLeft', [
  state('hidden', style({ opacity: 0, transform: 'translateX(-120px)' })),
  state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
  transition('hidden => visible', [
    animate('1000ms 200ms cubic-bezier(0.25, 0.8, 0.25, 1)')
  ]),
]);

export const slideInRightAnimation = trigger('slideInRight', [
  state('hidden', style({ opacity: 0, transform: 'translateX(120px)' })),
  state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
  transition('hidden => visible', [
    animate('1000ms 200ms cubic-bezier(0.25, 0.8, 0.25, 1)')
  ]),
]);

export const scaleInAnimation = trigger('scaleIn', [
  state('hidden', style({ opacity: 0, transform: 'scale(0.8)' })),
  state('visible', style({ opacity: 1, transform: 'scale(1)' })),
  transition('hidden => visible', [
    animate('800ms 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
  ]),
]);

export const staggerListAnimation = trigger('staggerList', [
  state('hidden', style({})),
  state('visible', style({})),
  transition('hidden => visible', [
    query('@slideInUp, @fadeIn, @scaleIn', [
      style({ opacity: 0, transform: 'translateY(120px)' }),
      stagger('150ms', [
        animate('1000ms 200ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const staggerChildrenAnimation = trigger('staggerChildren', [
  transition('* => visible', [
    query('.stagger-item', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('150ms', [
        animate('800ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const zoomInAnimation = trigger('zoomIn', [
  state('hidden', style({ opacity: 0, transform: 'scale(0.5)' })),
  state('visible', style({ opacity: 1, transform: 'scale(1)' })),
  transition('hidden => visible', [
    animate('800ms 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
  ]),
]);

export const zoomOutAnimation = trigger('zoomOut', [
  state('hidden', style({ opacity: 0, transform: 'scale(1.5)' })),
  state('visible', style({ opacity: 1, transform: 'scale(1)' })),
  transition('hidden => visible', [
    animate('800ms 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
  ]),
]);

export const rotateInAnimation = trigger('rotateIn', [
  state('hidden', style({ opacity: 0, transform: 'rotate(-180deg) scale(0.5)' })),
  state('visible', style({ opacity: 1, transform: 'rotate(0) scale(1)' })),
  transition('hidden => visible', [
    animate('1000ms 200ms cubic-bezier(0.25, 0.8, 0.25, 1)')
  ]),
]);

export const flipInYAnimation = trigger('flipInY', [
  state('hidden', style({ opacity: 0, transform: 'perspective(400px) rotateY(90deg)' })),
  state('visible', style({ opacity: 1, transform: 'perspective(400px) rotateY(0)' })),
  transition('hidden => visible', [
    animate('800ms 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
  ]),
]);

export const flipInXAnimation = trigger('flipInX', [
  state('hidden', style({ opacity: 0, transform: 'perspective(400px) rotateX(90deg)' })),
  state('visible', style({ opacity: 1, transform: 'perspective(400px) rotateX(0)' })),
  transition('hidden => visible', [
    animate('800ms 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
  ]),
]);
