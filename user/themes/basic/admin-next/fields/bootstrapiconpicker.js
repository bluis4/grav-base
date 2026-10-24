const TAG = window.__GRAV_FIELD_TAG;

const DEFAULT_ICONS = [
  'bi-arrow-right', 'bi-arrow-up-right', 'bi-arrow-left', 'bi-arrow-up', 'bi-chevron-right',
  'bi-check', 'bi-check-circle', 'bi-x', 'bi-plus', 'bi-dash', 'bi-download', 'bi-upload',
  'bi-envelope', 'bi-telephone', 'bi-chat-dots', 'bi-play-fill', 'bi-pause-fill', 'bi-cart',
  'bi-calendar', 'bi-clock', 'bi-star', 'bi-heart', 'bi-search', 'bi-house', 'bi-house-door',
  'bi-house-door-fill', 'bi-person', 'bi-people', 'bi-gear', 'bi-globe', 'bi-link-45deg',
  'bi-box-arrow-up-right', 'bi-lightning', 'bi-send', 'bi-info-circle', 'bi-question-circle',
  'bi-exclamation-triangle', 'bi-pencil', 'bi-trash', 'bi-camera', 'bi-image', 'bi-file-earmark',
  'bi-folder', 'bi-lock', 'bi-unlock', 'bi-eye', 'bi-eye-slash', 'bi-list', 'bi-grid',
  'bi-three-dots', 'bi-filter', 'bi-sliders', 'bi-arrow-repeat', 'bi-arrow-counterclockwise',
  'bi-share', 'bi-bookmark', 'bi-box-seam', 'bi-rocket-takeoff', 'bi-trophy', 'bi-graph-up-arrow',
  'bi-palette', 'bi-music-note', 'bi-cloud'
];

let iconCatalogPromise = null;

class BootstrapIconPicker extends HTMLElement {
  constructor() {
    super();
    this._value = '';
    this._field = null;
    this._icons = null;
    this._themeBaseUrl = undefined;
    this._domBuilt = false;
  }

  set field(field) {
    this._field = field;
    if (this._domBuilt) {
      this._updateFieldMeta();
      this._updateSelected();
    }
  }

  get field() {
    return this._field;
  }

  set value(value) {
    const next = typeof value === 'string' ? value : '';
    if (this._value !== next) {
      this._value = next;
      if (this._domBuilt) {
        this._updateSelected();
        this._updateGridPressed();
      }
    }
  }

  get value() {
    return this._value || '';
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    if (!this._domBuilt) {
      this._buildDom();
    }

    this._ensureGlobalAssets();
    this._updateSelected();
    this._renderChoices();
    this._loadIconCatalog();
  }

  _themeAssetUrl(assetPath) {
    if (this._themeBaseUrl === undefined) {
      let serverUrl = null;
      if (window.__GRAV_CONFIG__ && typeof window.__GRAV_CONFIG__.serverUrl === 'string') {
        serverUrl = window.__GRAV_CONFIG__.serverUrl;
      } else if (typeof window.__GRAV_API_SERVER_URL === 'string') {
        serverUrl = window.__GRAV_API_SERVER_URL;
      }

      if (serverUrl === null || serverUrl === undefined) {
        const m = window.location.pathname.match(/^(.*?)\/(admin|admin-next)(\/.*)?$/);
        serverUrl = m ? m[1] : '';
      }

      serverUrl = serverUrl.replace(/\/+$/, '');
      this._themeBaseUrl = `${window.location.origin}${serverUrl}`;
    }
    const cleanAsset = String(assetPath).replace(/^\/+/, '');
    return `${this._themeBaseUrl}/user/themes/basic/${cleanAsset}`;
  }

  _ensureGlobalAssets() {
    const cssUrl = this._themeAssetUrl('assets/css/bootstrap-icons.css');
    const woff2Url = this._themeAssetUrl('assets/fonts/bootstrap-icons.woff2');

    // 1. Ensure CSS link in document.head so the font-family is loaded in light DOM
    if (!document.querySelector('link[data-grav-bootstrap-icons]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('data-grav-bootstrap-icons', 'true');
      link.href = cssUrl;
      document.head.appendChild(link);
    }

    // 2. Register FontFace directly in document.fonts to guarantee glyph rendering in shadow DOM
    if (typeof FontFace !== 'undefined' && typeof document.fonts !== 'undefined') {
      try {
        if (!document.fonts.check('1rem "bootstrap-icons"')) {
          const font = new FontFace('bootstrap-icons', `url("${woff2Url}") format("woff2")`, { display: 'block' });
          font.load().then((loaded) => {
            document.fonts.add(loaded);
            if (this._domBuilt) {
              this._renderChoices();
              this._updateSelected();
            }
          }).catch(() => {});
        }
      } catch (_) {}
    }
  }

  _loadIconCatalog() {
    if (this._icons && this._icons.length) return;

    if (iconCatalogPromise) {
      iconCatalogPromise.then((icons) => {
        if (icons && icons.length) {
          this._icons = icons;
          if (this._domBuilt) {
            this._renderChoices();
            this._updateSelected();
          }
        }
      });
      return;
    }

    const cssUrl = this._themeAssetUrl('assets/css/bootstrap-icons.css');
    iconCatalogPromise = fetch(cssUrl, { credentials: 'same-origin' })
      .then((response) => {
        const ct = response.headers.get('content-type') || '';
        if (!response.ok || ct.includes('text/html')) {
          throw new Error('Bootstrap Icons stylesheet unavailable or not CSS');
        }
        return response.text();
      })
      .then((css) => {
        const matches = [...new Set([...css.matchAll(/\.bi-([a-z0-9-]+)::before/g)].map((m) => `bi-${m[1]}`))];
        return matches.length > 0 ? matches : DEFAULT_ICONS;
      })
      .catch((err) => {
        console.warn('Bootstrap Icons catalog fetch failed, using defaults:', err);
        return DEFAULT_ICONS;
      });

    iconCatalogPromise.then((icons) => {
      this._icons = (icons && icons.length) ? icons : DEFAULT_ICONS;
      if (this._domBuilt) {
        this._renderChoices();
        this._updateSelected();
      }
    });
  }

  _getChoices() {
    const field = this._field || {};
    const icons = Object.entries(field.options || {}).map(([value, label]) => ({
      value,
      label: String(label)
    }));
    if (icons.length) return icons;

    const iconList = (this._icons && this._icons.length) ? this._icons : DEFAULT_ICONS;
    return iconList.map((value) => ({
      value,
      label: value.replace(/^bi-/, '').replaceAll('-', ' ')
    }));
  }

  _buildDom() {
    if (!this.shadowRoot) return;

    const iconCss = this._themeAssetUrl('assets/css/bootstrap-icons.css');
    const iconFontWoff2 = this._themeAssetUrl('assets/fonts/bootstrap-icons.woff2');
    const iconFontWoff = this._themeAssetUrl('assets/fonts/bootstrap-icons.woff');

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${iconCss}">
      <style>
        @font-face {
          font-family: "bootstrap-icons";
          src: url("${iconFontWoff2}") format("woff2"),
               url("${iconFontWoff}") format("woff");
          font-display: block;
        }
        :host { display: block; color: inherit; font: inherit; }
        * { box-sizing: border-box; }
        .field { display: grid; gap: .5rem; }
        label { font-size: .875rem; font-weight: 600; }
        .help { margin: 0; color: var(--muted-foreground, #9ca3af); font-size: .75rem; line-height: 1.45; }
        .selected {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 2.5rem;
          padding: .5rem .75rem;
          border: 1px solid var(--border, #3f3f46);
          border-radius: .5rem;
          background: var(--muted, rgba(255, 255, 255, 0.03));
        }
        .selected-info {
          display: flex;
          align-items: center;
          gap: .65rem;
          min-width: 0;
        }
        .selected-info i {
          min-width: 1.4rem;
          text-align: center;
          font-size: 1.1rem;
        }
        .selected-label {
          font-size: .875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .clear-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          padding: 0;
          border: none;
          border-radius: .25rem;
          background: transparent;
          color: var(--muted-foreground, #9ca3af);
          cursor: pointer;
          font-size: 1.1rem;
          line-height: 1;
        }
        .clear-btn:hover {
          color: inherit;
          background: var(--muted, rgba(255, 255, 255, 0.1));
        }
        .clear-btn.visible {
          display: inline-flex;
        }
        input {
          width: 100%;
          height: 2.5rem;
          padding: 0 .75rem;
          border: 1px solid var(--input, #4b5563);
          border-radius: .5rem;
          background: var(--muted, #27272a);
          color: inherit;
          font: inherit;
        }
        input:focus {
          outline: 2px solid var(--ring, #a855f7);
          outline-offset: 1px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(3.25rem, 1fr));
          gap: .4rem;
          max-height: 14rem;
          overflow-y: auto;
          padding: .25rem;
          border: 1px solid var(--border, #3f3f46);
          border-radius: .5rem;
        }
        button.icon-btn {
          display: grid;
          min-height: 3.25rem;
          place-items: center;
          border: 1px solid transparent;
          border-radius: .45rem;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }
        button.icon-btn:hover, button.icon-btn:focus-visible {
          border-color: var(--ring, #a855f7);
          background: color-mix(in srgb, var(--ring, #a855f7) 15%, transparent);
          outline: none;
        }
        button.icon-btn[aria-pressed="true"] {
          border-color: var(--ring, #a855f7);
          background: color-mix(in srgb, var(--ring, #a855f7) 22%, transparent);
        }
        button.icon-btn i {
          font-size: 1.1rem;
        }
        .empty {
          margin: 0;
          padding: .75rem;
          color: var(--muted-foreground, #9ca3af);
          font-size: .8rem;
          grid-column: 1 / -1;
        }
      </style>
      <div class="field">
        <label style="display:none"></label>
        <p class="help" style="display:none"></p>
        <div class="selected" aria-live="polite">
          <div class="selected-info">
            <i class="bi" aria-hidden="true"></i>
            <span class="selected-label">No icon selected</span>
          </div>
          <button type="button" class="clear-btn" title="Clear icon" aria-label="Clear icon">×</button>
        </div>
        <input type="search" autocomplete="off" placeholder="Search Bootstrap icons…" aria-label="Search Bootstrap icons">
        <div class="grid" role="listbox" aria-label="Bootstrap icons"></div>
      </div>`;

    this._domBuilt = true;
    this._updateFieldMeta();

    const input = this.shadowRoot.querySelector('input');
    input.addEventListener('input', () => this._renderChoices());

    const clearBtn = this.shadowRoot.querySelector('.clear-btn');
    clearBtn.addEventListener('click', () => {
      this.value = '';
      this.dispatchEvent(new CustomEvent('change', { detail: '', bubbles: true }));
      this.dispatchEvent(new CustomEvent('commit', { detail: '', bubbles: true }));
    });

    const linkEl = this.shadowRoot.querySelector('link[rel="stylesheet"]');
    if (linkEl) {
      linkEl.addEventListener('load', () => {
        this._renderChoices();
        this._updateSelected();
      }, { once: true });
    }
  }

  _updateFieldMeta() {
    if (!this.shadowRoot) return;
    const field = this._field || {};
    const labelEl = this.shadowRoot.querySelector('label');
    const helpEl = this.shadowRoot.querySelector('.help');

    if (labelEl) {
      if (field.label) {
        labelEl.textContent = field.label;
        labelEl.style.display = '';
      } else {
        labelEl.style.display = 'none';
      }
    }

    if (helpEl) {
      if (field.help) {
        helpEl.textContent = field.help;
        helpEl.style.display = '';
      } else {
        helpEl.style.display = 'none';
      }
    }
  }

  _updateSelected() {
    if (!this.shadowRoot) return;
    const choices = this._getChoices();
    const selected = choices.find((icon) => icon.value === this.value);

    const iconEl = this.shadowRoot.querySelector('.selected-info i');
    const labelEl = this.shadowRoot.querySelector('.selected-label');
    const clearBtn = this.shadowRoot.querySelector('.clear-btn');

    if (iconEl && labelEl && clearBtn) {
      if (this.value) {
        iconEl.className = `bi ${this.value}`;
        iconEl.style.display = '';
        labelEl.textContent = selected ? selected.label : this.value;
        clearBtn.classList.add('visible');
      } else {
        iconEl.className = 'bi';
        iconEl.style.display = 'none';
        labelEl.textContent = 'No icon selected';
        clearBtn.classList.remove('visible');
      }
    }
  }

  _updateGridPressed() {
    if (!this.shadowRoot) return;
    const buttons = this.shadowRoot.querySelectorAll('button.icon-btn');
    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.iconValue === this.value));
    });
  }

  _renderChoices() {
    if (!this.shadowRoot) return;
    const input = this.shadowRoot.querySelector('input');
    const grid = this.shadowRoot.querySelector('.grid');
    if (!grid || !input) return;

    const choices = this._getChoices();
    const query = input.value.trim().toLowerCase();
    const matches = query
      ? choices.filter((icon) => `${icon.value} ${icon.label}`.toLowerCase().includes(query))
      : choices;

    const filtered = matches.slice(0, query ? 200 : 120);
    grid.replaceChildren();

    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'No matching icons.';
      grid.append(empty);
      return;
    }

    if (!query && matches.length > filtered.length) {
      const hint = document.createElement('p');
      hint.className = 'empty';
      hint.textContent = `Showing ${filtered.length} of ${matches.length} icons. Search to narrow the list.`;
      grid.append(hint);
    }

    filtered.forEach((icon) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'icon-btn';
      button.title = icon.label;
      button.dataset.iconValue = icon.value;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-label', icon.label);
      button.setAttribute('aria-pressed', String(icon.value === this.value));

      const glyph = document.createElement('i');
      glyph.className = `bi ${icon.value}`;
      glyph.setAttribute('aria-hidden', 'true');
      button.append(glyph);

      button.addEventListener('click', () => {
        this.value = icon.value;
        this.dispatchEvent(new CustomEvent('change', { detail: icon.value, bubbles: true }));
        this.dispatchEvent(new CustomEvent('commit', { detail: icon.value, bubbles: true }));
      });

      grid.append(button);
    });
  }
}

if (TAG && !customElements.get(TAG)) {
  customElements.define(TAG, BootstrapIconPicker);
}
