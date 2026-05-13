const fs = require('fs');
const path = require('path');
const dir = '/Users/googe/Documents/Claude/bodd';

const TROPHY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px;"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;

const AWARD_TAG_STYLE = `display:inline-flex;align-items:flex-start;gap:6px;background:var(--teal-light);border:0.5px solid var(--teal);border-radius:10px;padding:6px 10px;font-size:11px;color:var(--teal-dark);font-weight:500;line-height:1.4;text-align:right;`;

const NEW = `    <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-top:1.5rem;flex-wrap:wrap;">
      <div style="display:flex;flex-wrap:wrap;gap:0.625rem;align-items:center;">
        <span class="btn btn-primary" onclick="window.location.href='demo.html'">Book a Demo</span>
      </div>
      <div style="display:flex;flex-direction:row;gap:6px;align-items:flex-start;">
        <div style="${AWARD_TAG_STYLE}">${TROPHY_SVG}
          PCIAW Technology<br>Award 2025
        </div>
        <div style="${AWARD_TAG_STYLE}">${TROPHY_SVG}
          NAUMD Best Uniform<br>Sizing Technology 2025
        </div>
      </div>
    </div>`;

// The star-icon awards block present on 7 of the 8 pages
const STAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const PILL_STYLE = `display:inline-flex;align-items:center;gap:6px;background:var(--teal-light);border:0.5px solid var(--teal);border-radius:20px;padding:4px 12px;font-size:12px;color:var(--teal-dark);font-weight:500;`;

const OLD_AWARDS_BLOCK = `    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:0.75rem;margin-bottom:0.25rem;">
      <div style="${PILL_STYLE}">
        ${STAR_SVG}
        PCIAW Technology Award 2025
      </div>
      <div style="${PILL_STYLE}">
        ${STAR_SVG}
        NAUMD Best Uniform Sizing Technology 2025
      </div>
    </div>`;

// cta-row variants that follow the awards block
const CTA_MULTILINE = `    <div class="cta-row" style="margin-top:1.5rem;">
      <span class="btn btn-primary" onclick="window.location.href='demo.html'">Book a Demo</span>
    </div>`;

const CTA_INLINE = `    <div class="cta-row"><span class="btn btn-primary" onclick="window.location.href='demo.html'">Book a Demo</span></div>`;

// aviation/themeparks: inline cta-row but with margin-top style
const CTA_INLINE_MARGIN = `    <div class="cta-row" style="margin-top:1.5rem;"><span class="btn btn-primary" onclick="window.location.href='demo.html'">Book a Demo</span></div>`;

// workwear has no awards, just a cta-row with trailing whitespace
const CTA_WORKWEAR = `    <div class="cta-row" style="margin-top:1.5rem;">
      <span class="btn btn-primary" onclick="window.location.href='demo.html'">Book a Demo</span>

    </div>`;

const files = ['defence','police','fire','ambulance','aviation','themeparks','ballistics','workwear']
  .map(f => path.join(dir, f + '.html'));

let changed = 0;
for (const fp of files) {
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;

  // Case 1: awards + multiline cta-row
  content = content.split(OLD_AWARDS_BLOCK + '\n' + CTA_MULTILINE).join(NEW);

  // Case 2: awards + inline cta-row (no style)
  content = content.split(OLD_AWARDS_BLOCK + '\n' + CTA_INLINE).join(NEW);

  // Case 3: awards + inline cta-row with margin-top (aviation, themeparks)
  content = content.split(OLD_AWARDS_BLOCK + '\n' + CTA_INLINE_MARGIN).join(NEW);

  // Case 4: workwear — no awards, just the cta-row with trailing whitespace
  content = content.split(CTA_WORKWEAR).join(NEW);

  if (content !== original) {
    fs.writeFileSync(fp, content);
    changed++;
    console.log('✓ ' + path.basename(fp));
  } else {
    console.log('✗ no match — ' + path.basename(fp));
  }
}
console.log(`\nDone — ${changed}/8 files updated.`);
