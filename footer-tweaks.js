const fs = require('fs');
const path = require('path');

const dir = '/Users/googe/Documents/Claude/bodd';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// ── Replacements that are identical across both variants ──────────────────────

const simple = [
  // 1. Award pills: remove display:block so they hug text width
  [
    ';display:block;">PCIAW Technology Award 2025</div>',
    ';">PCIAW Technology Award 2025</div>'
  ],
  [
    ';display:block;">NAUMD Best Uniform Sizing Technology 2025</div>',
    ';">NAUMD Best Uniform Sizing Technology 2025</div>'
  ],
  [
    ';display:block;">Financial Review Most Innovative Company</div>',
    ';">Financial Review Most Innovative Company</div>'
  ],
  // 2. Three-col badges: add line breaks
  [
    '>Great Place to Work®</div>',
    '>Great Place<br>to Work®</div>'
  ],
  [
    '>MSIA Member</div>',
    '>MSIA<br>Member</div>'
  ],
  [
    '>Australian Made</div>',
    '>Australian<br>Made</div>'
  ],
];

// ── Column restructure — bare & variant ───────────────────────────────────────

const OLD_COLS_BARE = `      <div class="footer-col">
        <h5>Uniforms</h5>
        <a href="uniforms.html">Overview</a>
        <a href="defence.html">Defence & Military</a>
        <a href="police.html">Police & Law Enforcement</a>
        <a href="fire.html">Fire & Rescue</a>
        <a href="ambulance.html">Ambulance & Paramedics</a>
        <a href="aviation.html">Aviation</a>
        <a href="themeparks.html">Theme Parks & Entertainment</a>
        <a href="ballistics.html">Ballistics & Armour</a>
        <a href="workwear.html">Workwear & Industrial</a>
      </div>
      <div class="footer-col">
        <h5>Retail</h5>
        <a href="retail.html">Overview</a>
        <a href="tailoring.html">Tailoring & MTM</a>
        <a href="sporting.html">High-Function & Sporting</a>
        <h5 style="margin-top:1.5rem;">Health & Wellness</h5>
        <a href="health.html">Overview</a>
        <a href="pharmacy.html">Retail Pharmacy</a>
        <a href="weightloss.html">Weight Management</a>
        <a href="gyms.html">Gyms & Fitness</a>
        <a href="longevity.html">Longevity & Wellness</a>
        <a href="clinical.html">Allied Health & GP</a>
        <a href="defencehealth.html">Defence Health</a>
        <a href="corporate.html">Corporate Wellness</a>
      </div>
      <div class="footer-col">
        <h5>How it works</h5>
        <a href="howitworks.html">Overview</a>
        <a href="platform.html">The Platform</a>
        <a href="technology.html">Product &amp; Technology</a>
        <a href="security.html">Data &amp; Security</a>
        <h5 style="margin-top:1.5rem;">Company</h5>
        <a href="about.html">About</a>
        <a href="news.html">News</a>
        <a href="press.html">Press &amp; Media</a>
        <a href="contact.html">Contact</a>
        <a href="careers.html">Work With Us</a>
        <a href="investors.html">Investors</a>
        <h5 style="margin-top:1.5rem;">Consumer</h5>
        <a href="mybodd.html">MyBodd</a>
      </div>`;

const NEW_COLS_BARE = `      <div class="footer-col">
        <h5>Uniforms</h5>
        <a href="uniforms.html">Overview</a>
        <a href="defence.html">Defence & Military</a>
        <a href="police.html">Police & Law Enforcement</a>
        <a href="fire.html">Fire & Rescue</a>
        <a href="ambulance.html">Ambulance & Paramedics</a>
        <a href="aviation.html">Aviation</a>
        <a href="themeparks.html">Theme Parks & Entertainment</a>
        <a href="ballistics.html">Ballistics & Armour</a>
        <a href="workwear.html">Workwear & Industrial</a>
        <h5 style="margin-top:1.5rem;">Retail</h5>
        <a href="retail.html">Overview</a>
        <a href="tailoring.html">Tailoring & MTM</a>
        <a href="sporting.html">High-Function & Sporting</a>
      </div>
      <div class="footer-col">
        <h5>Health & Wellness</h5>
        <a href="health.html">Overview</a>
        <a href="pharmacy.html">Retail Pharmacy</a>
        <a href="weightloss.html">Weight Management</a>
        <a href="gyms.html">Gyms & Fitness</a>
        <a href="longevity.html">Longevity & Wellness</a>
        <a href="clinical.html">Allied Health & GP</a>
        <a href="defencehealth.html">Defence Health</a>
        <a href="corporate.html">Corporate Wellness</a>
        <h5 style="margin-top:1.5rem;">Consumer</h5>
        <a href="mybodd.html">MyBodd</a>
      </div>
      <div class="footer-col">
        <h5>How it works</h5>
        <a href="howitworks.html">Overview</a>
        <a href="platform.html">The Platform</a>
        <a href="technology.html">Product &amp; Technology</a>
        <a href="security.html">Data &amp; Security</a>
        <h5 style="margin-top:1.5rem;">Company</h5>
        <a href="about.html">About</a>
        <a href="news.html">News</a>
        <a href="press.html">Press &amp; Media</a>
        <a href="contact.html">Contact</a>
        <a href="careers.html">Work With Us</a>
        <a href="investors.html">Investors</a>
      </div>`;

// ── Column restructure — &amp; variant ────────────────────────────────────────

const OLD_COLS_AMP = `      <div class="footer-col">
        <h5>Uniforms</h5>
        <a href="uniforms.html">Overview</a>
        <a href="defence.html">Defence &amp; Military</a>
        <a href="police.html">Police &amp; Law Enforcement</a>
        <a href="fire.html">Fire &amp; Rescue</a>
        <a href="ambulance.html">Ambulance &amp; Paramedics</a>
        <a href="aviation.html">Aviation</a>
        <a href="themeparks.html">Theme Parks &amp; Entertainment</a>
        <a href="ballistics.html">Ballistics &amp; Armour</a>
        <a href="workwear.html">Workwear &amp; Industrial</a>
      </div>
      <div class="footer-col">
        <h5>Retail</h5>
        <a href="retail.html">Overview</a>
        <a href="tailoring.html">Tailoring &amp; MTM</a>
        <a href="sporting.html">High-Function &amp; Sporting</a>
        <h5 style="margin-top:1.5rem;">Health &amp; Wellness</h5>
        <a href="health.html">Overview</a>
        <a href="pharmacy.html">Retail Pharmacy</a>
        <a href="weightloss.html">Weight Management</a>
        <a href="gyms.html">Gyms &amp; Fitness</a>
        <a href="longevity.html">Longevity &amp; Wellness</a>
        <a href="clinical.html">Allied Health &amp; GP</a>
        <a href="defencehealth.html">Defence Health</a>
        <a href="corporate.html">Corporate Wellness</a>
      </div>
      <div class="footer-col">
        <h5>How it works</h5>
        <a href="howitworks.html">Overview</a>
        <a href="platform.html">The Platform</a>
        <a href="technology.html">Product &amp; Technology</a>
        <a href="security.html">Data &amp; Security</a>
        <h5 style="margin-top:1.5rem;">Company</h5>
        <a href="about.html">About</a>
        <a href="news.html">News</a>
        <a href="press.html">Press &amp; Media</a>
        <a href="contact.html">Contact</a>
        <a href="careers.html">Work With Us</a>
        <a href="investors.html">Investors</a>
        <h5 style="margin-top:1.5rem;">Consumer</h5>
        <a href="mybodd.html">MyBodd</a>
      </div>`;

const NEW_COLS_AMP = `      <div class="footer-col">
        <h5>Uniforms</h5>
        <a href="uniforms.html">Overview</a>
        <a href="defence.html">Defence &amp; Military</a>
        <a href="police.html">Police &amp; Law Enforcement</a>
        <a href="fire.html">Fire &amp; Rescue</a>
        <a href="ambulance.html">Ambulance &amp; Paramedics</a>
        <a href="aviation.html">Aviation</a>
        <a href="themeparks.html">Theme Parks &amp; Entertainment</a>
        <a href="ballistics.html">Ballistics &amp; Armour</a>
        <a href="workwear.html">Workwear &amp; Industrial</a>
        <h5 style="margin-top:1.5rem;">Retail</h5>
        <a href="retail.html">Overview</a>
        <a href="tailoring.html">Tailoring &amp; MTM</a>
        <a href="sporting.html">High-Function &amp; Sporting</a>
      </div>
      <div class="footer-col">
        <h5>Health &amp; Wellness</h5>
        <a href="health.html">Overview</a>
        <a href="pharmacy.html">Retail Pharmacy</a>
        <a href="weightloss.html">Weight Management</a>
        <a href="gyms.html">Gyms &amp; Fitness</a>
        <a href="longevity.html">Longevity &amp; Wellness</a>
        <a href="clinical.html">Allied Health &amp; GP</a>
        <a href="defencehealth.html">Defence Health</a>
        <a href="corporate.html">Corporate Wellness</a>
        <h5 style="margin-top:1.5rem;">Consumer</h5>
        <a href="mybodd.html">MyBodd</a>
      </div>
      <div class="footer-col">
        <h5>How it works</h5>
        <a href="howitworks.html">Overview</a>
        <a href="platform.html">The Platform</a>
        <a href="technology.html">Product &amp; Technology</a>
        <a href="security.html">Data &amp; Security</a>
        <h5 style="margin-top:1.5rem;">Company</h5>
        <a href="about.html">About</a>
        <a href="news.html">News</a>
        <a href="press.html">Press &amp; Media</a>
        <a href="contact.html">Contact</a>
        <a href="careers.html">Work With Us</a>
        <a href="investors.html">Investors</a>
      </div>`;

// ── Apply to all files ────────────────────────────────────────────────────────

let totalChanged = 0;

for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;

  // Simple replacements (variant-agnostic)
  for (const [from, to] of simple) {
    content = content.split(from).join(to);
  }

  // Column restructure — bare & variant
  if (content.includes(OLD_COLS_BARE)) {
    content = content.split(OLD_COLS_BARE).join(NEW_COLS_BARE);
  }

  // Column restructure — &amp; variant
  if (content.includes(OLD_COLS_AMP)) {
    content = content.split(OLD_COLS_AMP).join(NEW_COLS_AMP);
  }

  if (content !== original) {
    fs.writeFileSync(fp, content);
    totalChanged++;
    console.log('✓ ' + file);
  }
}

console.log(`\nDone — ${totalChanged} files updated.`);
