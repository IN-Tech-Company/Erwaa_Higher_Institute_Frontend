import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const ID_PREFIX = '__erwaa_ld_';

/**
 * Manages JSON-LD (schema.org) <script> tags in <head>, keyed by a short
 * string (e.g. 'course', 'breadcrumb', 'faq') so several schemas can live
 * on the same page at once without clobbering each other.
 *
 * Each page component is responsible for clearing the keys it owns when it
 * gets destroyed (via DestroyRef) — otherwise its structured data would
 * keep showing up on whatever page the user navigates to next, since
 * <head> is shared across the whole SPA.
 */
@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  constructor(@Inject(DOCUMENT) private readonly doc: Document) { }

  /** Sets (or replaces in place) the JSON-LD block registered under `key`. */
  set(key: string, schema: Record<string, unknown>): void {
    const id = ID_PREFIX + key;
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.doc.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);
  }

  /** Removes the JSON-LD block registered under `key`, if any. */
  remove(key: string): void {
    this.doc.getElementById(ID_PREFIX + key)?.remove();
  }

  /** Removes every JSON-LD block for the given keys — call from a page's DestroyRef. */
  clear(keys: string[]): void {
    keys.forEach((key) => this.remove(key));
  }
}
