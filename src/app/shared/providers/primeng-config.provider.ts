import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/styled';
import { Preset } from '@primeuix/themes/types';

const AuraCustom: Preset = definePreset(Aura as Preset, {
  semantic: {
    // Primary = Green #09583B
    primary: {
      50: '#ebf2ef',
      100: '#ceded8',
      200: '#9dbcb1',
      300: '#6b9b89',
      400: '#3a7962',
      500: '#09583b',
      600: '#084d34',
      700: '#063f2a',
      800: '#053121',
      900: '#042318',
      950: '#042318',
    },

    colorScheme: {
      light: {
        formField: {
          background: '#eff1f0',   // neutral-50
          filledBackground: '#d8dbda',   // neutral-100

          borderColor: '#b0b7b4',   // neutral-200
          hoverBorderColor: '#89928f',   // neutral-300
          focusBorderColor: '#09583b',   // primary
          invalidBorderColor: '#FF3B30',   // error

          color: '#171e1b',   // neutral-900
          placeholderColor: '#616e69',   // neutral-400

          borderRadius: '12px',
          transitionDuration: '0.2s',

          focusRing: {
            width: '2px',
            style: 'solid',
            color: 'rgba(9, 88, 59, 0.2)',  // primary 20%
            offset: '0',
          },
        },

        content: {
          background: '#ffffff',
          color: '#171e1b',   // neutral-900
          borderColor: '#b0b7b4',   // neutral-200
          hoverBackground: '#ebf2ef',   // primary-50
          hoverColor: '#09583b',   // primary
        },

        surface: {
          0: '#ffffff',
          50: '#eff1f0',   // neutral-50
          100: '#d8dbda',   // neutral-100
          200: '#b0b7b4',   // neutral-200
          300: '#89928f',   // neutral-300
          400: '#616e69',   // neutral-400
          500: '#3a4a44',   // neutral-500
          600: '#33413c',   // neutral-600
          700: '#2a3531',   // neutral-700
          800: '#202926',   // neutral-800
          900: '#171e1b',   // neutral-900
          950: '#171e1b',   // neutral-900 (no darker stop supplied)
        },

        overlay: {
          background: '#ffffff',
          borderColor: '#b0b7b4',
          shadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        },

        highlight: {
          background: '#ceded8',   // primary-100
          color: '#09583b',   // primary
        },
      },
    },
  },
});

export function providePrimeNGConfig(): EnvironmentProviders {
  return makeEnvironmentProviders([
    providePrimeNG({
      theme: {
        preset: AuraCustom,
        options: {
          darkModeSelector: '.dark',
          cssLayer: false,
        },
      },
      ripple: true,
      inputStyle: 'filled',
    }),
  ]);
}
