<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ARIA Admin Panel</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Instrument+Sans:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f4f3ef; --surface: #ffffff; --surface2: #eeecea;
      --border: rgba(0,0,0,0.07); --text: #18181a; --muted: #888;
      --accent: #6c63ff; --green: #1a7a4a; --red: #c0392b; --amber: #c47a1a;
      --font-head: 'Syne', sans-serif; --font-body: 'Instrument Sans', sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }

    /* Login */
    .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .login-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 40px; width: 380px; }
    .login-title { font-family: var(--font-head); font-size: 24px; font-weight: 700; margin-bottom: 6px; }
    .login-sub { font-size: 13px; color: var(--muted); margin-bottom: 28px; }
    .form-group { margin-bottom: 14px; }
    .form-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; display: block; }
    .form-input { width: 100%; padding: 11px 13px; border: 1px solid var(--border); border-radius: 9px; font-size: 14px; font-family: var(--font-body); outline: none; transition: border-color 0.2s; background: var(--bg); }
    .form-input:focus { border-color: var(--accent); }
    .btn { padding: 11px 20px; border-radius: 9px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; font-family: var(--font-body); transition: all 0.15s; }
    .btn-primary { background: var(--text); color: #fff; width: 100%; padding: 13px; font-size: 15px; }
    .btn-primary:hover { opacity: 0.85; }
    .btn-sm { padding: 5px 12px; font-size: 12px; border: 1px solid var(--border); background: transparent; color: var(--muted); border-radius: 7px; }
    .btn-sm:hover { background: var(--surface2); color: var(--text); }
    .btn-danger { background: #fde8e6; color: var(--red); border: none; }
    .btn-success { background: #e8f5ee; color: var(--green); border: none; }
    .error-box { background: #fde8e6; color: var(--red); padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; display: none; }

    /* Layout */
    .layout { display: none; grid-template-columns: 240px 1fr; min-height: 100vh; }
    .layout.active { display: grid; }
    .sidebar { background: var(--text); display: flex; flex-direction: column; padding: 24px 0; }
    .sidebar-logo { font-family: var(--font-head); font-size: 18px; font-weight: 700; color: #fff; padding: 0 24px 4px; }
    .sidebar-logo span { color: #a09cff; }
    .sidebar-role { font-size: 11px; color: rgba(255,255,255,0.3); padding: 0 24px 24px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 24px; font-size: 14px; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.15s; border-left: 3px solid transparent; }
    .nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
    .nav-item.active { color: #fff; border-left-color: #a09cff; background: rgba(255,255,255,0.08); }
    .nav-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.5; }
    .nav-item.active .nav-dot { opacity: 1; background: #a09cff; }
    .sidebar-footer { margin-top: auto; padding: 16px 24px; }
    .logout-btn { width: 100%; padding: 8px; background: rgba(255,255,255,0.07); border: none; border-radius: 8px; color: rgba(255,255,255,0.4); font-size: 13px; cursor: pointer; font-family: var(--font-body); }
    .logout-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }

    /* Main */
    .main { overflow-y: auto; }
    .topbar { padding: 18px 28px; border-bottom: 1px solid var(--border); background: var(--surface); display: flex; justify-content: space-between; align-items: center; }
    .page-title { font-family: var(--font-head); font-size: 19px; font-weight: 700; }
    .admin-badge { padding: 4px 12px; background: rgba(108,99,255,0.1); color: var(--accent); border-radius: 99px; font-size: 11px; font-weight: 600; }
    .content { padding: 24px 28px; }
    .page { display: none; }
    .page.active { display: block; }

    /* Stats */
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 24px; }
    .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px 18px; }
    .stat-card.accent { background: var(--text); }
    .stat-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
    .stat-card.accent .stat-label { color: rgba(255,255,255,0.4); }
    .stat-value { font-family: var(--font-head); font-size: 28px; font-weight: 700; }
    .stat-card.accent .stat-value { color: #fff; }
    .stat-change { font-size: 12px; color: var(--green); margin-top: 3px; }

    /* Table */
    .section { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 20px; }
    .section-header { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .section-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 9px 18px; font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--border); }
    td { padding: 12px 18px; border-bottom: 1px solid var(--border); vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--surface2); }
    .empty-td { text-align: center; padding: 32px; color: var(--muted); }

    /* Badges */
    .badge { display: inline-block; padding: 2px 9px; border-radius: 99px; font-size: 11px; font-weight: 600; }
    .badge-green { background: #e8f5ee; color: var(--green); }
    .badge-red { background: #fde8e6; color: var(--red); }
    .badge-blue { background: #e8edfd; color: var(--accent); }
    .badge-amber { background: #fdf3e3; color: var(--amber); }
    .badge-gray { background: var(--surface2); color: var(--muted); }

    select.form-input { cursor: pointer; }
  </style>
</head>
<body>

<!-- Login -->
<div class="login-page" id="login-page">
  <div class="login-card">
    <div class="login-title">ARIA Admin</div>
    <div class="login-sub">Platform administration panel</div>
    <div class="error-box" id="login-error"></div>
    <div class="form-group"><label class="form-label">Admin password</label><input class="form-input" id="admin-pass" type="password" placeholder="Enter admin password" onkeydown="if(event.key==='Enter')adminLogin()"/></div>
    <button class="btn btn-primary" onclick="adminLogin()">Sign in to admin →</button>
  </div>
</div>

<!-- Dashboard -->
<div class="layout" id="admin-layout">
  <aside class="sidebar">
    <div class="sidebar-logo">AR<span>I</span>A</div>
    <div class="sidebar-role">Admin Panel</div>
    <nav>
      <div class="nav-item active" data-page="overview" onclick="showPage('overview')"><div class="nav-dot"></div> Overview</div>
      <div class="nav-item" data-page="businesses" onclick="showPage('businesses')"><div class="nav-dot"></div> Businesses</div>
      <div class="nav-item" data-page="numbers" onclick="showPage('numbers')"><div class="nav-dot"></div> Phone numbers</div>
      <div class="nav-item" data-page="revenue" onclick="showPage('revenue')"><div class="nav-dot"></div> Revenue</div>
    </nav>
    <div class="sidebar-footer">
      <button class="logout-btn" onclick="adminLogout()">Sign out</button>
    </div>
  </aside>

  <main class="main">
    <div class="topbar">
      <div class="page-title" id="admin-page-title">Overview</div>
      <div style="display:flex;gap:10px;align-items:center;">
        <span class="admin-badge">Admin</span>
      </div>
    </div>

    <div class="content">

      <!-- OVERVIEW -->
      <div class="page active" id="page-overview">
        <div class="stats-grid">
          <div class="stat-card accent"><div class="stat-label">Total businesses</div><div class="stat-value" id="ov-total">—</div><div class="stat-change" id="ov-active-count">— active</div></div>
          <div class="stat-card"><div class="stat-label">Monthly revenue</div><div class="stat-value" id="ov-revenue">—</div><div class="stat-change">This month</div></div>
          <div class="stat-card"><div class="stat-label">Trial accounts</div><div class="stat-value" id="ov-trial">—</div><div class="stat-change">Converting soon</div></div>
          <div class="stat-card"><div class="stat-label">Phone pool</div><div class="stat-value" id="ov-numbers">—</div><div class="stat-change" id="ov-numbers-sub">available</div></div>
        </div>

        <div class="section">
          <div class="section-header"><div class="section-title">Recent signups</div><button class="btn btn-sm" onclick="showPage('businesses')">View all</button></div>
          <table>
            <thead><tr><th>Business</th><th>Email</th><th>Plan</th><th>Phone number</th><th>Signed up</th></tr></thead>
            <tbody id="recent-businesses"><tr><td colspan="5" class="empty-td">Loading...</td></tr></tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-header"><div class="section-title">Revenue overview</div></div>
          <div style="padding:16px 18px;">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
              <div style="background:var(--surface2);border-radius:10px;padding:14px;">
                <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Starter (₹2,000)</div>
                <div style="font-family:var(--font-head);font-size:22px;font-weight:700;" id="rev-starter">—</div>
              </div>
              <div style="background:var(--surface2);border-radius:10px;padding:14px;">
                <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Growth (₹4,000)</div>
                <div style="font-family:var(--font-head);font-size:22px;font-weight:700;" id="rev-growth">—</div>
              </div>
              <div style="background:var(--surface2);border-radius:10px;padding:14px;">
                <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Pro (₹8,000)</div>
                <div style="font-family:var(--font-head);font-size:22px;font-weight:700;" id="rev-pro">—</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BUSINESSES -->
      <div class="page" id="page-businesses">
        <div class="section">
          <div class="section-header">
            <div class="section-title">All businesses</div>
            <div style="display:flex;gap:8px;">
              <select class="form-input" id="biz-filter" style="width:140px;padding:6px 10px;font-size:13px;" onchange="loadBusinesses()">
                <option value="">All plans</option>
                <option value="trial">Trial</option>
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="pro">Pro</option>
              </select>
            </div>
          </div>
          <table>
            <thead><tr><th>Business</th><th>Email</th><th>Phone number</th><th>Plan</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody id="all-businesses"><tr><td colspan="7" class="empty-td">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>

      <!-- PHONE NUMBERS -->
      <div class="page" id="page-numbers">
        <div class="section" style="margin-bottom:20px;">
          <div class="section-header">
            <div class="section-title">Pool stats</div>
            <button class="btn btn-sm" onclick="syncPool()">Sync from Twilio/Vapi</button>
          </div>
          <div style="padding:16px 18px;">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
              <div style="background:var(--surface2);border-radius:10px;padding:14px;">
                <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Total numbers</div>
                <div style="font-family:var(--font-head);font-size:22px;font-weight:700;" id="pool-total">—</div>
              </div>
              <div style="background:var(--surface2);border-radius:10px;padding:14px;">
                <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Assigned</div>
                <div style="font-family:var(--font-head);font-size:22px;font-weight:700;" id="pool-assigned">—</div>
              </div>
              <div style="background:var(--surface2);border-radius:10px;padding:14px;">
                <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Available</div>
                <div style="font-family:var(--font-head);font-size:22px;font-weight:700;" id="pool-available">—</div>
              </div>
            </div>
          </div>
        </div>

        <div class="section" style="margin-bottom:20px;">
          <div class="section-header">
            <div class="section-title">Assign number to business</div>
          </div>
          <div style="padding:20px 18px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
              <div class="form-group">
                <label class="form-label">Select business</label>
                <select class="form-input" id="assign-business-select"></select>
              </div>
              <div class="form-group">
                <label class="form-label">Specific number (optional)</label>
                <input class="form-input" id="assign-number-input" placeholder="Leave blank to auto-assign" style="font-family:monospace;"/>
              </div>
            </div>
            <button class="btn btn-primary" style="width:auto;padding:10px 24px;" onclick="assignNumber()">Assign number</button>
            <p style="font-size:12px;color:var(--muted);margin-top:8px;">Leave the number field blank to auto-assign the next available number from the pool.</p>
          </div>
        </div>

        <div class="section">
          <div class="section-header"><div class="section-title">All numbers in pool</div></div>
          <table>
            <thead><tr><th>Number</th><th>Provider</th><th>Status</th><th>Assigned to</th><th>Action</th></tr></thead>
            <tbody id="number-assignments"><tr><td colspan="5" class="empty-td">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>

      <!-- REVENUE -->
      <div class="page" id="page-revenue">
        <div class="stats-grid">
          <div class="stat-card accent"><div class="stat-label">Monthly recurring</div><div class="stat-value" id="mrr">—</div></div>
          <div class="stat-card"><div class="stat-label">Paying customers</div><div class="stat-value" id="paying">—</div></div>
          <div class="stat-card"><div class="stat-label">Trial users</div><div class="stat-value" id="trial-count">—</div></div>
          <div class="stat-card"><div class="stat-label">Churn rate</div><div class="stat-value">0%</div></div>
        </div>
        <div class="section">
          <div class="section-header"><div class="section-title">Revenue by plan</div></div>
          <table>
            <thead><tr><th>Plan</th><th>Price</th><th>Customers</th><th>Monthly revenue</th></tr></thead>
            <tbody id="revenue-table"><tr><td colspan="4" class="empty-td">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>

    </div>
  </main>
</div>

<script>
// ── Backend is same-origin (admin.html is served by the backend itself) ──
const API = window.location.origin;

// ── Admin key is stored in sessionStorage after successful login ─────────
// (it's also re-sent with every API call as the x-admin-key header)
let adminKey = sessionStorage.getItem('aria_admin_key') || '';

if (adminKey) verifyAndShowAdmin();

async function adminLogin() {
  const pass = document.getElementById('admin-pass').value;
  const err  = document.getElementById('login-error');
  err.style.display = 'none';

  if (!pass) {
    err.textContent = 'Please enter the admin password';
    err.style.display = 'block';
    return;
  }

  // Verify against the REAL backend, not a hardcoded string
  try {
    const r = await fetch(API + '/admin/stats', {
      headers: { 'x-admin-key': pass }
    });
    if (r.status === 401) {
      err.textContent = 'Incorrect password';
      err.style.display = 'block';
      return;
    }
    if (!r.ok) {
      err.textContent = 'Server error — please try again';
      err.style.display = 'block';
      return;
    }
    // Success — save key for this session and proceed
    adminKey = pass;
    sessionStorage.setItem('aria_admin_key', pass);
    showAdmin();
  } catch (e) {
    err.textContent = 'Could not reach server: ' + e.message;
    err.style.display = 'block';
  }
}

function adminLogout() {
  sessionStorage.removeItem('aria_admin_key');
  adminKey = '';
  location.reload();
}

async function verifyAndShowAdmin() {
  try {
    const r = await fetch(API + '/admin/stats', { headers: { 'x-admin-key': adminKey } });
    if (r.ok) { showAdmin(); }
    else { sessionStorage.removeItem('aria_admin_key'); }
  } catch (e) { sessionStorage.removeItem('aria_admin_key'); }
}

function showAdmin() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('admin-layout').classList.add('active');
  loadOverview();
  loadBusinesses();
  loadPool();
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelector(`.nav-item[data-page="${name}"]`)?.classList.add('active');
  const titles = { overview:'Overview', businesses:'Businesses', numbers:'Phone numbers', revenue:'Revenue' };
  document.getElementById('admin-page-title').textContent = titles[name] || name;
  if (name === 'businesses') loadBusinesses();
  if (name === 'numbers')    { loadPool(); loadBusinessSelectOptions(); }
  if (name === 'revenue')    loadRevenue();
}

// ── Admin API helper — always sends the real verified admin key ──────────
async function adminApi(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(API + path, opts);
  if (r.status === 401) {
    sessionStorage.removeItem('aria_admin_key');
    location.reload();
    throw new Error('Session expired');
  }
  return r.json();
}

async function loadOverview() {
  try {
    const d = await adminApi('/admin/stats');
    if (!d.stats) return;
    const s = d.stats;
    document.getElementById('ov-total').textContent        = s.total   || '0';
    document.getElementById('ov-active-count').textContent = (s.active || 0) + ' active';
    document.getElementById('ov-trial').textContent        = s.trial   || '0';
    document.getElementById('ov-numbers').textContent      = (s.pool?.available ?? '0');
    document.getElementById('ov-numbers-sub').textContent  = 'available of ' + (s.pool?.total ?? 0);
    document.getElementById('ov-revenue').textContent      = '₹' + (s.mrr || 0).toLocaleString('en-IN');
    document.getElementById('rev-starter').textContent     = '₹' + ((s.starter||0)*2000).toLocaleString('en-IN');
    document.getElementById('rev-growth').textContent      = '₹' + ((s.growth||0)*4000).toLocaleString('en-IN');
    document.getElementById('rev-pro').textContent         = '₹' + ((s.pro||0)*8000).toLocaleString('en-IN');
    loadRecentBusinesses(d.recent || []);
  } catch(e) { console.error(e); }
}

function loadRecentBusinesses(businesses) {
  const tbody = document.getElementById('recent-businesses');
  if (!businesses.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-td">No businesses yet</td></tr>'; return; }
  tbody.innerHTML = businesses.slice(0,5).map(b => `<tr>
    <td><strong>${escapeHtml(b.name)}</strong></td>
    <td style="font-size:12px;color:var(--muted)">${escapeHtml(b.email)}</td>
    <td><span class="badge badge-${b.plan==='trial'?'amber':b.plan==='pro'?'blue':'green'}">${b.plan}</span></td>
    <td style="font-family:monospace;font-size:12px">${b.twilioNumber || '—'}</td>
    <td style="font-size:12px;color:var(--muted)">${new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
    </tr>`).join('');
}

async function loadBusinesses() {
  const filter = document.getElementById('biz-filter')?.value || '';
  try {
    const d = await adminApi('/admin/businesses' + (filter ? '?plan='+filter : ''));
    const tbody = document.getElementById('all-businesses');
    if (!d.businesses?.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-td">No businesses found</td></tr>'; return; }
    tbody.innerHTML = d.businesses.map(b => `<tr>
      <td><strong>${escapeHtml(b.name)}</strong></td>
      <td style="font-size:12px">${escapeHtml(b.email)}</td>
      <td style="font-family:monospace;font-size:12px">${b.twilioNumber || '<span style="color:var(--muted)">Not assigned</span>'}</td>
      <td>
        <select onchange="changePlan('${b._id}',this.value)" style="font-size:12px;padding:3px 6px;border:1px solid var(--border);border-radius:6px;background:var(--bg);font-family:var(--font-body);">
          <option value="trial" ${b.plan==='trial'?'selected':''}>Trial</option>
          <option value="starter" ${b.plan==='starter'?'selected':''}>Starter</option>
          <option value="growth" ${b.plan==='growth'?'selected':''}>Growth</option>
          <option value="pro" ${b.plan==='pro'?'selected':''}>Pro</option>
        </select>
      </td>
      <td><span class="badge badge-${b.isActive?'green':'red'}">${b.isActive?'Active':'Suspended'}</span></td>
      <td style="font-size:12px;color:var(--muted)">${new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
      <td style="display:flex;gap:6px;">
        <button class="btn btn-sm" onclick="toggleActive('${b._id}',${!b.isActive})">${b.isActive?'Suspend':'Activate'}</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBusiness('${b._id}','${escapeHtml(b.name)}')">Delete</button>
      </td></tr>`).join('');
  } catch(e) { console.error(e); }
}

async function loadPool() {
  try {
    const d = await adminApi('/admin/pool');
    document.getElementById('pool-total').textContent     = d.stats?.total     ?? '0';
    document.getElementById('pool-assigned').textContent  = d.stats?.assigned  ?? '0';
    document.getElementById('pool-available').textContent = d.stats?.available ?? '0';

    const tbody = document.getElementById('number-assignments');
    if (!d.numbers?.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-td">No numbers in pool yet</td></tr>'; return; }
    tbody.innerHTML = d.numbers.map(n => `<tr>
      <td style="font-family:monospace">${n.number}</td>
      <td><span class="badge badge-gray">${n.provider}</span></td>
      <td><span class="badge badge-${n.isAssigned?'green':'amber'}">${n.isAssigned?'Assigned':'Available'}</span></td>
      <td>${n.businessId ? escapeHtml(n.businessId.name || '') : '—'}</td>
      <td>${n.isAssigned ? `<button class="btn btn-sm btn-danger" onclick="releaseNumberFromBiz('${n.businessId?._id}')">Release</button>` : '—'}</td>
      </tr>`).join('');
  } catch(e) { console.error(e); }
}

async function loadBusinessSelectOptions() {
  try {
    const d = await adminApi('/admin/businesses');
    const sel = document.getElementById('assign-business-select');
    sel.innerHTML = '<option value="">Select business...</option>' +
      (d.businesses||[]).map(b => `<option value="${b._id}">${escapeHtml(b.name)} — ${escapeHtml(b.email)}</option>`).join('');
  } catch(e) {}
}

async function assignNumber() {
  const bizId  = document.getElementById('assign-business-select').value;
  const number = document.getElementById('assign-number-input').value.trim();
  if (!bizId) { alert('Please select a business'); return; }
  try {
    const body = { businessId: bizId };
    if (number) body.number = number;
    const result = await adminApi('/admin/assign', 'POST', body);
    if (result.success) {
      alert('Number assigned: ' + (result.number || ''));
    } else {
      alert(result.message || 'Could not assign number');
    }
    loadPool();
    loadBusinesses();
  } catch(e) { alert('Error assigning number'); }
}

async function releaseNumberFromBiz(businessId) {
  if (!businessId) return;
  if (!confirm('Release this number back to the pool?')) return;
  await adminApi('/admin/release', 'POST', { businessId });
  loadPool();
  loadBusinesses();
}

async function syncPool() {
  try {
    const result = await adminApi('/admin/pool/sync', 'POST');
    alert('Synced! Added ' + (result.added || 0) + ' new number(s).');
    loadPool();
  } catch(e) { alert('Sync failed'); }
}

async function changePlan(id, plan) {
  await adminApi('/admin/business', 'PATCH', { businessId: id, plan });
  loadOverview();
}

async function toggleActive(id, isActive) {
  await adminApi('/admin/business', 'PATCH', { businessId: id, isActive });
  loadBusinesses();
}

async function deleteBusiness(id, name) {
  if (!confirm(`Permanently delete "${name}" and ALL their data (appointments, customers, call logs)? This cannot be undone.`)) return;
  try {
    const result = await adminApi('/admin/business/' + id, 'DELETE');
    if (result.success) {
      alert('Business deleted');
      loadBusinesses();
      loadOverview();
      loadPool();
    } else {
      alert(result.error || 'Delete failed');
    }
  } catch(e) { alert('Delete failed'); }
}

async function loadRevenue() {
  try {
    const d = await adminApi('/admin/stats');
    const s = d.stats || {};
    document.getElementById('mrr').textContent         = '₹' + (s.mrr||0).toLocaleString('en-IN');
    document.getElementById('paying').textContent      = (s.active||0);
    document.getElementById('trial-count').textContent = (s.trial||0);
    const tbody = document.getElementById('revenue-table');
    const plans = [
      { name:'Starter', price:2000, count:s.starter||0 },
      { name:'Growth',  price:4000, count:s.growth||0  },
      { name:'Pro',     price:8000, count:s.pro||0     },
    ];
    tbody.innerHTML = plans.map(p => `<tr>
      <td><strong>${p.name}</strong></td>
      <td>₹${p.price.toLocaleString('en-IN')}/month</td>
      <td>${p.count} businesses</td>
      <td><strong>₹${(p.price*p.count).toLocaleString('en-IN')}</strong></td></tr>`).join('');
  } catch(e) {}
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
</script>
</body>
</html>
