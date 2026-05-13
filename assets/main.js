function selectRegion(r) {
  const labels = { au: 'AU / NZ', us: 'US', eu: 'Europe' };
  localStorage.setItem('bodd_region', r);
  document.getElementById('region-modal').style.display = 'none';
  const label = document.getElementById('footer-region-label');
  if (label) label.textContent = labels[r] || r;

  /* Selecting US triggers the region mismatch demo on reload */
  if (r === 'us') {
    const url = new URL(window.location.href);
    url.searchParams.set('demo', 'region');
    window.location.href = url.toString();
  }
}

function showRegionModal() {
  const modal = document.getElementById('region-modal');
  modal.style.display = 'flex';
  // Mark AU as the simulated detected region
  const btns = modal.querySelectorAll('button[onclick*="selectRegion"]');
  btns.forEach(function(btn) {
    if (btn.getAttribute('onclick').includes("'au'")) {
      btn.style.borderColor = 'var(--blue)';
      btn.style.boxShadow = '0 0 0 1px var(--blue)';
      if (!btn.querySelector('.detected-tag')) {
        var tag = document.createElement('span');
        tag.className = 'detected-tag';
        tag.textContent = 'Detected';
        tag.style.cssText = 'font-size:10px;background:var(--blue-light);color:var(--blue);padding:2px 8px;border-radius:20px;font-weight:600;margin-left:auto;';
        btn.appendChild(tag);
      }
    }
  });
}

function dismissRegionBanner() {
  var b = document.getElementById('region-banner');
  if (b) b.remove();
  document.body.style.paddingTop = '';
  var nav = document.querySelector('nav');
  if (nav) nav.style.top = '';
}

function showRegionMismatchBanner() {
  if (document.getElementById('region-banner')) return;
  const saved = localStorage.getItem('bodd_region');
  const regionLabels = { au: 'Australia & New Zealand', us: 'United States', eu: 'Europe' };
  const currentLabel = saved ? (regionLabels[saved] || saved) : 'United States';

  const banner = document.createElement('div');
  banner.id = 'region-banner';
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:1000;background:var(--blue);padding:0.625rem 2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;box-sizing:border-box;';
  banner.innerHTML = [
    '<div style="display:flex;align-items:center;gap:0.75rem;font-size:13px;color:rgba(255,255,255,0.85);">',
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    '<span>We\'ve detected you may be visiting from <strong style="color:white;">Australia &amp; New Zealand</strong>. You\'re currently viewing the <strong style="color:white;">',
    currentLabel,
    '</strong> site.</span>',
    '</div>',
    '<div style="display:flex;align-items:center;gap:0.75rem;flex-shrink:0;">',
    '<button onclick="selectRegion(\'au\');dismissRegionBanner();" style="font-size:12px;font-weight:500;background:white;color:var(--blue);border:none;padding:5px 14px;border-radius:20px;cursor:pointer;font-family:inherit;transition:opacity 0.15s;">Switch to AU / NZ</button>',
    '<button onclick="dismissRegionBanner();" style="font-size:12px;color:rgba(255,255,255,0.7);background:none;border:none;cursor:pointer;font-family:inherit;padding:4px 8px;">Dismiss</button>',
    '</div>',
  ].join('');

  document.body.insertBefore(banner, document.body.firstChild);

  /* Measure banner height and push nav + page content down to match */
  const h = banner.offsetHeight;
  document.body.style.paddingTop = h + 'px';
  const nav = document.querySelector('nav');
  if (nav) nav.style.top = (12 + h) + 'px';
}

document.addEventListener('DOMContentLoaded', function() {
  // Restore footer region label if already selected
  const saved = localStorage.getItem('bodd_region');
  const labels = { au: 'AU / NZ', us: 'US', eu: 'Europe' };
  const label = document.getElementById('footer-region-label');
  if (saved && label) label.textContent = labels[saved] || saved;

  // Show region modal only on home page, only on first visit
  const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
  if (isHome && !saved) {
    showRegionModal();
  }

  // Region mismatch demo — triggered by ?demo=region in URL
  const params = new URLSearchParams(window.location.search);
  if (params.get('demo') === 'region') {
    if (!saved) localStorage.setItem('bodd_region', 'us');
    showRegionMismatchBanner();
  }

  // Close dropdowns on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.dropdown').forEach(d => d.style.display = '');
    }
  });
});

function toggleMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger) hamburger.classList.toggle('open');
  if (mobileMenu) mobileMenu.classList.toggle('open');
}

function toggleSection(header) {
  const links = header.nextElementSibling;
  const isOpen = links.classList.contains('open');
  links.classList.toggle('open', !isOpen);
  header.classList.toggle('expanded', !isOpen);
}

// ── Build Your Platform — stepper ──
var bldStep = 1;
var bldQty = 1;
var bldSector = null;
var bldModules = {};
var bldSectorLabels = { uniforms:'Uniforms & Workforce', retail:'Retail & Apparel', health:'Health & Wellness', multi:'Multiple sectors', notsure:'Not sure yet' };
var bldStepTitles = ['','Your organisation','Scanner quantity','Modules','Your details','Review & submit'];

function buildNav(dir) {
  var next = bldStep + dir;
  if (next < 1 || next > 5) return;
  document.getElementById('build-step-' + bldStep).style.display = 'none';
  bldStep = next;
  document.getElementById('build-step-' + bldStep).style.display = 'block';
  document.getElementById('build-step-label').textContent = 'Step ' + bldStep + ' of 5';
  document.getElementById('build-step-title').textContent = bldStepTitles[bldStep];
  document.getElementById('build-progress-bar').style.width = (bldStep * 20) + '%';
  document.getElementById('build-back-btn').style.display = bldStep > 1 ? 'block' : 'none';
  var nextBtn = document.getElementById('build-next-btn');
  if (bldStep === 5) {
    nextBtn.style.display = 'none';
    buildPopulateSummary();
  } else {
    nextBtn.style.display = 'block';
    nextBtn.textContent = bldStep === 4 ? 'Review →' : 'Next →';
  }
}

function selectBuildOption(type, val, el) {
  bldSector = val;
  el.closest('#sector-grid').querySelectorAll('.build-option').forEach(function(t) {
    t.style.borderColor = 'var(--gray-200)';
    t.style.background = 'var(--white)';
  });
  el.style.borderColor = 'var(--teal-dark)';
  el.style.background = 'var(--teal-light)';
}

function changeBuildQty(delta) {
  bldQty = Math.max(1, bldQty + delta);
  document.getElementById('build-qty-display').textContent = bldQty;
  document.getElementById('build-qty-plural').textContent = bldQty !== 1 ? 's' : '';
  updateBuildQtyBtns();
}

function setBuildQty(n) {
  bldQty = n;
  document.getElementById('build-qty-display').textContent = n;
  document.getElementById('build-qty-plural').textContent = n !== 1 ? 's' : '';
  updateBuildQtyBtns();
}

function updateBuildQtyBtns() {
  document.querySelectorAll('.build-qty-btn').forEach(function(btn) {
    var v = parseInt(btn.textContent);
    var active = (v === bldQty) || (btn.textContent === '100+' && bldQty >= 100);
    btn.style.background = active ? 'var(--teal-dark)' : 'var(--white)';
    btn.style.color = active ? 'white' : 'inherit';
    btn.style.borderColor = active ? 'var(--teal-dark)' : 'var(--gray-200)';
  });
}

function toggleBuildModule(el, id) {
  bldModules[id] = !bldModules[id];
  var check = el.querySelector('.bmod-check');
  if (bldModules[id]) {
    el.style.borderColor = 'var(--teal-dark)';
    el.style.background = 'var(--teal-light)';
    check.style.background = 'var(--teal-dark)';
    check.style.borderColor = 'var(--teal-dark)';
    check.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  } else {
    el.style.borderColor = 'var(--gray-200)';
    el.style.background = 'var(--white)';
    check.style.background = 'transparent';
    check.style.borderColor = 'var(--gray-300)';
    check.innerHTML = '';
  }
}

function buildPopulateSummary() {
  var sectorLabel = bldSectorLabels[bldSector] || '—';
  document.getElementById('bsum-title').textContent = sectorLabel + ' Platform';
  document.getElementById('bsum-sector').textContent = sectorLabel;
  document.getElementById('bsum-scanners').textContent = bldQty + (bldQty === 1 ? ' scanner' : ' scanners');
  var modNames = { sizematch:'Bodd SizeMatch', compose:'Bodd Compose', vitals:'Bodd Vitals', mybodd:'MyBodd', motion:'Bodd Motion (coming soon)', insight:'Bodd Insight (coming soon)' };
  var modHtml = '<div style="display:flex;align-items:center;gap:0.5rem;font-size:13px;color:var(--gray-700);"><svg xmlns=\'http://www.w3.org/2000/svg\' width=\'11\' height=\'11\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'var(--teal-dark)\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'20 6 9 17 4 12\'/></svg>Bodd Core <span style=\'font-size:11px;color:var(--gray-400);\'>(always included)</span></div>';
  Object.keys(bldModules).forEach(function(k) {
    if (bldModules[k] && modNames[k]) {
      modHtml += '<div style="display:flex;align-items:center;gap:0.5rem;font-size:13px;color:var(--gray-700);"><svg xmlns=\'http://www.w3.org/2000/svg\' width=\'11\' height=\'11\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'var(--teal-dark)\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'20 6 9 17 4 12\'/></svg>' + modNames[k] + '</div>';
    }
  });
  document.getElementById('bsum-modules').innerHTML = modHtml;
  var fname = document.getElementById('bld-fname') ? document.getElementById('bld-fname').value : '';
  var lname = document.getElementById('bld-lname') ? document.getElementById('bld-lname').value : '';
  var email = document.getElementById('bld-email') ? document.getElementById('bld-email').value : '';
  var org = document.getElementById('bld-org') ? document.getElementById('bld-org').value : '';
  document.getElementById('bsum-contact').textContent = [fname + ' ' + lname, org, email].filter(function(s){ return s.trim(); }).join(' · ') || '—';
}

function buildSubmitQuote() {
  document.getElementById('build-step-5').style.display = 'none';
  document.getElementById('build-nav').style.display = 'none';
  document.getElementById('build-thankyou').style.display = 'block';
  document.getElementById('build-progress-bar').style.width = '100%';
  document.getElementById('build-step-label').textContent = 'Complete';
  document.getElementById('build-step-title').textContent = 'Quote request sent';
  window.scrollTo(0,0);
}

function submitDemoForm() {
  document.getElementById('demo-form-wrap').style.display = 'none';
  document.getElementById('demo-thankyou').style.display = 'block';
  document.getElementById('demo-thankyou').scrollIntoView({behavior:'smooth'});
}

function submitContactForm() {
  document.getElementById('contact-thankyou').style.display = 'block';
  document.getElementById('contact-note').style.display = 'none';
  const formGrid = document.querySelector('.form-grid');
  const submitBtn = document.querySelector('#contact-submit-row');
  if (formGrid) formGrid.style.display = 'none';
  if (submitBtn) submitBtn.style.display = 'none';
}

// ── ROI Calculator ──
const roiSectors = {
  uniforms: {
    label: 'Uniforms & Workforce Sizing',
    fields: [
      { id: 'workforce', label: 'Total workforce size', default: '', placeholder: 'e.g. 500', hint: '' },
      { id: 'items', label: 'Garment items sized per person', default: 5, hint: 'Industry average: 5 items (jacket, trousers, shirt, boots, headwear)' },
      { id: 'manual_time', label: 'Manual fitting time per person (mins)', default: 45, hint: 'Industry average: 45 mins including scheduling and admin' },
      { id: 'labour_rate', label: 'Hourly labour cost of fitter ($)', default: 35, hint: '' },
      { id: 'return_rate', label: 'Current return / remake rate (%)', default: 18, hint: 'Industry average: 15–22% for manually-sized workforces' },
      { id: 'remake_cost', label: 'Average cost per return / remake ($)', default: 85, hint: 'Includes handling, reprocessing and redelivery' },
      { id: 'emergency_orders', label: 'Annual emergency replacement orders', default: 20, hint: 'Orders placed outside normal procurement cycles due to sizing errors' },
      { id: 'emergency_cost', label: 'Average emergency order cost ($)', default: 350, hint: '' },
    ],
    calc: (v) => {
      const boddTime = 2/60;
      const timeSaved = ((v.manual_time/60) - boddTime) * v.workforce;
      const labourSaving = timeSaved * v.labour_rate;
      const currentReturns = v.workforce * v.items * (v.return_rate/100);
      const boddReturns = currentReturns * 0.35;
      const remakeSaving = (currentReturns - boddReturns) * v.remake_cost;
      const emergencySaving = v.emergency_orders * v.emergency_cost * 0.7;
      const total = labourSaving + remakeSaving + emergencySaving;
      return {
        stats: [
          { value: '$'+fmt(labourSaving), label: 'Labour cost saved' },
          { value: '$'+fmt(remakeSaving), label: 'Returns & remakes avoided', teal: true },
          { value: Math.round(timeSaved/8)+' days', label: 'Staff time recovered' },
          { value: '$'+fmt(total), label: 'Estimated total annual saving', large: true },
        ],
        bars: [
          { label: 'Labour saving', value: labourSaving },
          { label: 'Returns & remakes', value: remakeSaving },
          { label: 'Emergency orders', value: emergencySaving },
        ],
        insight: 'Based on your inputs, Bodd could save your organisation approximately $'+fmt(total)+' annually — recovering '+Math.round(timeSaved/8)+' working days in fitting time and reducing remake costs by '+Math.round(currentReturns - boddReturns)+' fewer returns.',
      };
    }
  },
  retail: {
    label: 'Retail & Tailoring',
    fields: [
      { id: 'appts', label: 'Fitting appointments per month', default: '', placeholder: 'e.g. 150', hint: '' },
      { id: 'conversion', label: 'Current in-store conversion rate (%)', default: 55, hint: 'Average for tailoring / MTM retail: 50–60%' },
      { id: 'avg_order', label: 'Average order value ($)', default: 800, hint: '' },
      { id: 'alteration_rate', label: 'Garments requiring alteration (%)', default: 35, hint: 'Industry average for MTM: 30–40%' },
      { id: 'alteration_cost', label: 'Average alteration cost ($)', default: 65, hint: 'Labour and rework cost per garment' },
      { id: 'return_rate', label: 'Current return rate (%)', default: 12, hint: 'Industry average for tailoring: 10–15%' },
      { id: 'return_cost', label: 'Average cost per return ($)', default: 120, hint: '' },
    ],
    calc: (v) => {
      const conversionUplift = 0.12;
      const newConversion = Math.min(95, v.conversion * (1 + conversionUplift));
      const extraSales = v.appts * ((newConversion - v.conversion)/100) * v.avg_order * 12;
      const alterationReduction = 0.65;
      const currentAlterations = v.appts * (v.alteration_rate/100) * 12;
      const alterationSaving = currentAlterations * alterationReduction * v.alteration_cost;
      const returnReduction = 0.60;
      const currentReturns = v.appts * (v.return_rate/100) * 12;
      const returnSaving = currentReturns * returnReduction * v.return_cost;
      const total = extraSales + alterationSaving + returnSaving;
      return {
        stats: [
          { value: '$'+fmt(extraSales), label: 'Revenue from conversion uplift' },
          { value: '$'+fmt(alterationSaving), label: 'Alteration cost reduction', teal: true },
          { value: '$'+fmt(returnSaving), label: 'Returns eliminated' },
          { value: '$'+fmt(total), label: 'Estimated annual value', large: true },
        ],
        bars: [
          { label: 'Conversion uplift', value: extraSales },
          { label: 'Alterations saved', value: alterationSaving },
          { label: 'Returns eliminated', value: returnSaving },
        ],
        insight: 'Based on your inputs, Bodd could deliver approximately $'+fmt(total)+' in annual value — through a '+Math.round(conversionUplift*100)+'% lift in conversion, fewer alterations, and significantly reduced returns.',
      };
    }
  },
  gyms: {
    label: 'Gyms & Fitness Centres',
    fields: [
      { id: 'members', label: 'Total active members', default: '', placeholder: 'e.g. 800', hint: '' },
      { id: 'new_members', label: 'New member sign-ups per month', default: 40, hint: '' },
      { id: 'monthly_fee', label: 'Average monthly membership fee ($)', default: 75, hint: '' },
      { id: 'retention', label: 'Current annual retention rate (%)', default: 65, hint: 'Industry average: 60–70%' },
      { id: 'conversion', label: 'New member trial-to-join conversion (%)', default: 45, hint: 'Industry average: 40–50%' },
    ],
    calc: (v) => {
      const retentionUplift = 0.12;
      const churnReduction = v.members * (1 - v.retention/100) * retentionUplift;
      const retentionRevenue = churnReduction * v.monthly_fee * 12;
      const conversionUplift = 0.08;
      const extraMembers = v.new_members * (conversionUplift) * 12;
      const conversionRevenue = extraMembers * v.monthly_fee * 8;
      const total = retentionRevenue + conversionRevenue;
      return {
        stats: [
          { value: '$'+fmt(retentionRevenue), label: 'Retention revenue uplift' },
          { value: '$'+fmt(conversionRevenue), label: 'New member conversion uplift', teal: true },
          { value: Math.round(churnReduction)+' members', label: 'Members retained per year' },
          { value: '$'+fmt(total), label: 'Estimated annual revenue uplift', large: true },
        ],
        bars: [
          { label: 'Retention uplift', value: retentionRevenue },
          { label: 'Conversion uplift', value: conversionRevenue },
        ],
        insight: 'Based on your inputs, Bodd could deliver $'+fmt(total)+' in additional annual revenue — retaining approximately '+Math.round(churnReduction)+' more members per year and converting more trials through body scan as a differentiator.',
      };
    }
  },
  pharmacy: {
    label: 'Pharmacy & Weight Management',
    fields: [
      { id: 'consults', label: 'Weight management consults per month', default: '', placeholder: 'e.g. 60', hint: '' },
      { id: 'programme_fee', label: 'Programme value per patient ($)', default: 350, hint: 'Average 3-month programme value' },
      { id: 'rebook_rate', label: 'Current patient rebook / return rate (%)', default: 40, hint: 'Patients who return for follow-up consultations' },
      { id: 'consult_time', label: 'Average consultation time (mins)', default: 25, hint: '' },
      { id: 'staff_rate', label: 'Pharmacist / staff hourly rate ($)', default: 55, hint: '' },
      { id: 'upsell_rate', label: 'Current programme enrolment rate (%)', default: 30, hint: 'Patients who enrol in a structured programme' },
    ],
    calc: (v) => {
      const rebookUplift = 0.28;
      const extraRebooks = v.consults * ((v.rebook_rate/100) * rebookUplift) * 12;
      const rebookRevenue = extraRebooks * (v.programme_fee * 0.4);
      const upsellUplift = 0.20;
      const extraEnrolments = v.consults * (upsellUplift) * 12;
      const upsellRevenue = extraEnrolments * v.programme_fee;
      const timeSavedMins = (v.consult_time - 10) * v.consults;
      const timeSavedAnnual = timeSavedMins * 12 / 60;
      const staffSaving = timeSavedAnnual * v.staff_rate;
      const total = rebookRevenue + upsellRevenue + staffSaving;
      return {
        stats: [
          { value: '$'+fmt(upsellRevenue), label: 'Programme enrolment uplift' },
          { value: '$'+fmt(rebookRevenue), label: 'Return visit revenue', teal: true },
          { value: '$'+fmt(staffSaving), label: 'Consultation time saved' },
          { value: '$'+fmt(total), label: 'Estimated annual value', large: true },
        ],
        bars: [
          { label: 'Programme enrolments', value: upsellRevenue },
          { label: 'Return visits', value: rebookRevenue },
          { label: 'Staff time saved', value: staffSaving },
        ],
        insight: 'Based on your inputs, Bodd could deliver $'+fmt(total)+' in annual value — through higher programme enrolment, more return visits enabled by objective progress data, and faster consultations.',
      };
    }
  },
  longevity: {
    label: 'Longevity & Wellness Centres',
    fields: [
      { id: 'new_members', label: 'New members per month', default: '', placeholder: 'e.g. 20', hint: '' },
      { id: 'programme_fee', label: 'Annual programme fee per member ($)', default: 3500, hint: '' },
      { id: 'avg_tenure', label: 'Average member tenure (months)', default: 14, hint: 'How long members typically stay engaged' },
      { id: 'referral_rate', label: 'Current referral rate (%)', default: 15, hint: 'Members who refer a new member' },
      { id: 'retention', label: 'Current annual retention rate (%)', default: 60, hint: '' },
    ],
    calc: (v) => {
      const retentionUplift = 0.15;
      const tenureUplift = v.avg_tenure * retentionUplift;
      const ltv = (v.programme_fee / 12) * (v.avg_tenure + tenureUplift);
      const currentLtv = (v.programme_fee / 12) * v.avg_tenure;
      const ltvUplift = (ltv - currentLtv) * v.new_members * 12;
      const referralUplift = 0.25;
      const extraReferrals = v.new_members * 12 * (v.referral_rate/100) * referralUplift;
      const referralRevenue = extraReferrals * v.programme_fee;
      const churnReduction = v.new_members * 12 * (1 - v.retention/100) * retentionUplift;
      const retentionRevenue = churnReduction * (v.programme_fee / 12) * 6;
      const total = ltvUplift + referralRevenue + retentionRevenue;
      return {
        stats: [
          { value: '$'+fmt(ltvUplift), label: 'Lifetime value uplift' },
          { value: '$'+fmt(referralRevenue), label: 'Referral revenue uplift', teal: true },
          { value: Math.round(tenureUplift*10)/10+' months', label: 'Avg. engagement extension' },
          { value: '$'+fmt(total), label: 'Estimated annual value', large: true },
        ],
        bars: [
          { label: 'Lifetime value uplift', value: ltvUplift },
          { label: 'Referral revenue', value: referralRevenue },
          { label: 'Retention uplift', value: retentionRevenue },
        ],
        insight: 'Based on your inputs, Bodd could deliver $'+fmt(total)+' in additional annual value — by extending member engagement, improving outcomes that drive referrals, and reducing churn with objective progress data.',
      };
    }
  },
  defence: {
    label: 'Defence & Uniformed Services',
    fields: [
      { id: 'intake', label: 'Annual recruit intake volume', default: '', placeholder: 'e.g. 300', hint: '' },
      { id: 'equip_days', label: 'Current days to fully equip a recruit', default: 14, hint: 'From intake to operationally equipped' },
      { id: 'daily_cost', label: 'Daily cost of non-deployment readiness per recruit ($)', default: 450, hint: 'Salary, accommodation and overhead during delay' },
      { id: 'return_rate', label: 'Current uniform return / refit rate (%)', default: 22, hint: 'Industry average for defence: 18–25%' },
      { id: 'refit_cost', label: 'Average refit / remake cost per item ($)', default: 120, hint: '' },
      { id: 'items', label: 'Uniform items per recruit', default: 8, hint: 'Full kit: combat clothing, boots, helmet, gloves, PPE' },
    ],
    calc: (v) => {
      const boddEquipDays = v.equip_days * 0.45;
      const daysSaved = v.equip_days - boddEquipDays;
      const readinessSaving = daysSaved * v.daily_cost * v.intake;
      const currentRefits = v.intake * v.items * (v.return_rate/100);
      const boddRefits = currentRefits * 0.30;
      const refitSaving = (currentRefits - boddRefits) * v.refit_cost;
      const total = readinessSaving + refitSaving;
      return {
        stats: [
          { value: Math.round(daysSaved)+' days', label: 'Faster time to operational readiness' },
          { value: '$'+fmt(readinessSaving), label: 'Readiness cost saving', teal: true },
          { value: '$'+fmt(refitSaving), label: 'Procurement waste reduction' },
          { value: '$'+fmt(total), label: 'Estimated annual saving', large: true },
        ],
        bars: [
          { label: 'Readiness saving', value: readinessSaving },
          { label: 'Procurement waste', value: refitSaving },
        ],
        insight: 'Based on your inputs, Bodd could save approximately $'+fmt(total)+' annually — reducing time to operational readiness by '+Math.round(daysSaved)+' days per recruit and cutting procurement waste by '+Math.round(currentRefits - boddRefits)+' fewer refits.',
      };
    }
  },
  corporate: {
    label: 'Corporate Wellness',
    fields: [
      { id: 'employees', label: 'Number of employees', default: '', placeholder: 'e.g. 1000', hint: '' },
      { id: 'absenteeism', label: 'Current absenteeism rate (%)', default: 4.5, hint: 'Australian average: 4–5% of working days lost annually' },
      { id: 'daily_cost', label: 'Average daily cost per absent employee ($)', default: 350, hint: 'Salary, productivity loss and replacement cost' },
      { id: 'programme_cost', label: 'Annual wellness programme spend per employee ($)', default: 800, hint: '' },
      { id: 'engagement', label: 'Current programme engagement rate (%)', default: 35, hint: 'Employees who actively participate in wellness programmes' },
    ],
    calc: (v) => {
      const absenteeismReduction = 0.12;
      const workingDays = 250;
      const daysLost = v.employees * workingDays * (v.absenteeism/100);
      const daysSaved = daysLost * absenteeismReduction;
      const absenteeismSaving = daysSaved * v.daily_cost;
      const engagementUplift = 0.30;
      const extraEngaged = v.employees * (v.engagement/100) * engagementUplift;
      const programmeSaving = extraEngaged * v.programme_cost * 0.25;
      const total = absenteeismSaving + programmeSaving;
      return {
        stats: [
          { value: '$'+fmt(absenteeismSaving), label: 'Absenteeism cost reduction' },
          { value: '$'+fmt(programmeSaving), label: 'Programme ROI improvement', teal: true },
          { value: Math.round(daysSaved)+' days', label: 'Working days recovered' },
          { value: '$'+fmt(total), label: 'Estimated annual value', large: true },
        ],
        bars: [
          { label: 'Absenteeism saving', value: absenteeismSaving },
          { label: 'Programme ROI', value: programmeSaving },
        ],
        insight: 'Based on your inputs, Bodd could deliver $'+fmt(total)+' in annual value — reducing absenteeism by '+Math.round(absenteeismReduction*100)+'% and improving programme engagement through personalised, objective body data.',
      };
    }
  },
};

function fmt(n) { return Math.round(n).toLocaleString(); }

function roiSectorSwitch() {
  const sectorEl = document.getElementById('roi-sector');
  if (!sectorEl) return;
  const sector = sectorEl.value;
  const config = roiSectors[sector];
  if (!config) return;

  const container = document.getElementById('roi-fields');
  container.innerHTML = config.fields.map(f => `
    <div>
      <label style="display:block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--gray-500);margin-bottom:0.5rem;">${f.label}</label>
      <input type="number" id="roi-field-${f.id}" ${f.default !== '' ? 'value="'+f.default+'"' : ''} ${f.placeholder ? 'placeholder="'+f.placeholder+'"' : ''} style="width:100%;padding:0.75rem 1rem;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit;color:var(--black);background:var(--white);">
      ${f.hint ? '<div style="font-size:11px;color:var(--gray-400);margin-top:0.3rem;">'+f.hint+'</div>' : ''}
    </div>`).join('');

  document.getElementById('roi-results').style.display = 'none';
  document.getElementById('roi-placeholder').style.display = 'flex';
  document.querySelectorAll('.roi-bar-fill').forEach(b => { b.style.transition = 'none'; b.style.width = '0%'; });
}

function roiCalc() {
  const sector = document.getElementById('roi-sector').value;
  const config = roiSectors[sector];
  if (!config) return;

  const v = {};
  config.fields.forEach(f => {
    const el = document.getElementById('roi-field-' + f.id);
    v[f.id] = el ? (parseFloat(el.value) || 0) : 0;
  });

  const result = config.calc(v);

  const statContainer = document.getElementById('roi-stats');
  statContainer.innerHTML = result.stats.map(s => `
    <div style="background:${s.large ? 'var(--black)' : s.teal ? 'var(--teal-light)' : 'var(--gray-50)'};border:0.5px solid ${s.large ? 'var(--black)' : s.teal ? 'var(--teal)' : 'var(--gray-200)'};border-radius:12px;padding:1.25rem 1.5rem;${s.large ? 'grid-column:span 2;' : ''}">
      <div style="font-size:${s.large ? '28px' : '22px'};font-weight:${s.large ? '600' : '500'};letter-spacing:-0.02em;color:${s.large ? 'var(--white)' : s.teal ? 'var(--teal-dark)' : 'var(--black)'};margin-bottom:0.25rem;">${s.value}</div>
      <div style="font-size:12px;color:${s.large ? '#999' : s.teal ? 'var(--teal-dark)' : 'var(--gray-500)'};">${s.label}</div>
    </div>`).join('');

  const maxVal = Math.max(...result.bars.map(b => b.value)) * 1.15 || 1;
  const barContainer = document.getElementById('roi-bars');
  barContainer.innerHTML = result.bars.map((b, i) => `
    <div style="margin-bottom:${i < result.bars.length-1 ? '1rem' : '0'};">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
        <div style="font-size:13px;color:var(--gray-700);">${b.label}</div>
        <div style="font-size:13px;font-weight:600;color:${i===0 ? 'var(--black)' : 'var(--teal-dark)'};">$${fmt(b.value)}</div>
      </div>
      <div style="height:8px;background:var(--gray-200);border-radius:4px;overflow:hidden;">
        <div class="roi-bar-fill" style="height:100%;width:0%;background:${i===0 ? 'var(--black)' : 'var(--teal-dark)'};border-radius:4px;transition:width 0.8s cubic-bezier(0.4,0,0.2,1);" data-width="${Math.min(100,(b.value/maxVal)*100)}%"></div>
      </div>
    </div>`).join('');

  document.getElementById('roi-insight').textContent = result.insight;
  document.getElementById('roi-results').style.display = 'block';
  document.getElementById('roi-placeholder').style.display = 'none';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.roi-bar-fill').forEach(b => {
        b.style.width = b.dataset.width;
      });
    });
  });
}

roiSectorSwitch();
