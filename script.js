// ==========================================
// HOSTEL MANAGEMENT SYSTEM - CORE SCRIPT
// ==========================================

const DATA_VERSION = 'v2.0';

// ===== THEME MANAGEMENT =====
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeToggleIcon(newTheme);
}

function updateThemeToggleIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = theme === 'dark' 
      ? '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
      : '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);

// ===== DATA STORE =====
const HMS = {
  KEYS: { users:'hms_users', rooms:'hms_rooms', bookings:'hms_bookings', payments:'hms_payments', requests:'hms_requests', visitors:'hms_visitors', attendance:'hms_attendance', notices:'hms_notices', outpasses:'hms_outpasses' },

  defaults: {
    users: [
      // Staff
      { id:'u1', username:'admin', password:'admin123', role:'admin', name:'Rajesh Kumar', email:'admin@hostelpro.com', phone:'9876543210' },
      { id:'u3', username:'reception', password:'rec123', role:'receptionist', name:'Priya Patel', email:'priya@hostelpro.com', phone:'9876543213' },
      // Students
      { id:'u2',  username:'student123', password:'pass123',  role:'student', name:'Arjun Sharma',   email:'arjun@student.com',   phone:'9811001001', studentId:'STU001', roomId:'r1', bloodGroup:'O+',  emergencyContact:'9811001002', course:'B.Tech CSE',  year:'2nd Year', fatherName:'Ramesh Sharma',  address:'12 Rajouri Garden, Delhi' },
      { id:'u4',  username:'rahul456',   password:'rahul123',  role:'student', name:'Rahul Verma',    email:'rahul@student.com',   phone:'9811002001', studentId:'STU002', roomId:'r2', bloodGroup:'A+',  emergencyContact:'9811002002', course:'B.Tech ECE',  year:'3rd Year', fatherName:'Suresh Verma',   address:'45 Andheri West, Mumbai' },
      { id:'u5',  username:'sneha789',   password:'sneha123',  role:'student', name:'Sneha Singh',    email:'sneha@student.com',   phone:'9811003001', studentId:'STU003', roomId:'r3', bloodGroup:'B+',  emergencyContact:'9811003002', course:'MCA',         year:'1st Year', fatherName:'Deepak Singh',   address:'78 Whitefield, Bangalore' },
      { id:'u6',  username:'priya.k',    password:'priya123',  role:'student', name:'Priya Kapoor',   email:'priya.k@student.com', phone:'9811004001', studentId:'STU004', roomId:'r2', bloodGroup:'AB+', emergencyContact:'9811004002', course:'B.Sc IT',     year:'2nd Year', fatherName:'Rakesh Kapoor',  address:'22 Salt Lake, Kolkata' },
      { id:'u7',  username:'ankit.y',    password:'ankit123',  role:'student', name:'Ankit Yadav',    email:'ankit.y@student.com', phone:'9811005001', studentId:'STU005', roomId:'r3', bloodGroup:'O-',  emergencyContact:'9811005002', course:'B.Tech ME',   year:'4th Year', fatherName:'Ramkesh Yadav',  address:'33 Civil Lines, Allahabad' },
      { id:'u8',  username:'kavya.r',    password:'kavya123',  role:'student', name:'Kavya Reddy',    email:'kavya.r@student.com', phone:'9811006001', studentId:'STU006', roomId:'r3', bloodGroup:'B-',  emergencyContact:'9811006002', course:'MBA',         year:'1st Year', fatherName:'Venkat Reddy',   address:'56 Banjara Hills, Hyderabad' },
      { id:'u9',  username:'rohit.m',    password:'rohit123',  role:'student', name:'Rohit Mehta',    email:'rohit.m@student.com', phone:'9811007001', studentId:'STU007', roomId:'r4', bloodGroup:'A-',  emergencyContact:'9811007002', course:'B.Tech Civil',year:'3rd Year', fatherName:'Anil Mehta',     address:'67 Navrangpura, Ahmedabad' },
      { id:'u10', username:'pooja.g',    password:'pooja123',  role:'student', name:'Pooja Gupta',    email:'pooja.g@student.com', phone:'9811008001', studentId:'STU008', roomId:'r4', bloodGroup:'AB-', emergencyContact:'9811008002', course:'BCA',         year:'2nd Year', fatherName:'Sanjay Gupta',   address:'89 Hazratganj, Lucknow' },
      { id:'u11', username:'sanjay.j',   password:'sanjay123', role:'student', name:'Sanjay Joshi',   email:'sanjay.j@student.com',phone:'9811009001', studentId:'STU009', roomId:'r5', bloodGroup:'O+',  emergencyContact:'9811009002', course:'M.Tech CSE',  year:'1st Year', fatherName:'Mohan Joshi',    address:'101 Koregaon Park, Pune' },
      { id:'u12', username:'meera.k',    password:'meera123',  role:'student', name:'Meera Krishnan', email:'meera.k@student.com', phone:'9811010001', studentId:'STU010', roomId:'r6', bloodGroup:'B+',  emergencyContact:'9811010002', course:'BBA',         year:'3rd Year', fatherName:'Krishnan Pillai',address:'14 T Nagar, Chennai' },
      { id:'u13', username:'aditya.p',   password:'aditya123', role:'student', name:'Aditya Patil',   email:'aditya.p@student.com',phone:'9811011001', studentId:'STU011', roomId:'r6', bloodGroup:'A+',  emergencyContact:'9811011002', course:'B.Tech CSE',  year:'2nd Year', fatherName:'Ramesh Patil',   address:'55 FC Road, Pune' },
    ],
    rooms: [
      { id:'r1', number:'A-101', floor:'Ground Floor', type:'Single', beds:1, occupied:1, bathrooms:'Shared',   rent:5000, status:'occupied',  amenities:['AC','WiFi','Study Table','Wardrobe'] },
      { id:'r2', number:'A-102', floor:'Ground Floor', type:'Double', beds:2, occupied:2, bathrooms:'Shared',   rent:4000, status:'occupied',  amenities:['Fan','WiFi','Study Table'] },
      { id:'r3', number:'B-201', floor:'2nd Floor',   type:'Triple', beds:3, occupied:3, bathrooms:'Attached',  rent:3500, status:'occupied',  amenities:['AC','WiFi','Attached Bath','Balcony'] },
      { id:'r4', number:'B-202', floor:'2nd Floor',   type:'Double', beds:2, occupied:2, bathrooms:'Shared',   rent:4000, status:'occupied',  amenities:['Fan','WiFi'] },
      { id:'r5', number:'C-301', floor:'3rd Floor',   type:'Single', beds:1, occupied:1, bathrooms:'Attached',  rent:6000, status:'occupied',  amenities:['AC','WiFi','Attached Bath','TV'] },
      { id:'r6', number:'C-302', floor:'3rd Floor',   type:'Triple', beds:3, occupied:2, bathrooms:'Attached',  rent:3500, status:'partial',   amenities:['Fan','WiFi','Attached Bath'] },
      { id:'r7', number:'D-401', floor:'4th Floor',   type:'Double', beds:2, occupied:0, bathrooms:'Attached',  rent:4500, status:'available', amenities:['AC','WiFi','Attached Bath','Study Table'] },
      { id:'r8', number:'D-402', floor:'4th Floor',   type:'Single', beds:1, occupied:0, bathrooms:'Attached',  rent:6500, status:'available', amenities:['AC','WiFi','Attached Bath','TV','Mini Fridge'] },
    ],
    bookings: [
      { id:'b1',  studentId:'u2',  roomId:'r1', checkIn:'2024-07-01', checkOut:'2025-06-30', amount:5000, status:'active' },
      { id:'b2',  studentId:'u4',  roomId:'r2', checkIn:'2024-08-01', checkOut:'2025-05-31', amount:4000, status:'active' },
      { id:'b3',  studentId:'u5',  roomId:'r3', checkIn:'2024-09-01', checkOut:'2025-08-31', amount:3500, status:'active' },
      { id:'b5',  studentId:'u6',  roomId:'r2', checkIn:'2024-08-01', checkOut:'2025-07-31', amount:4000, status:'active' },
      { id:'b6',  studentId:'u7',  roomId:'r3', checkIn:'2024-07-15', checkOut:'2025-07-14', amount:3500, status:'active' },
      { id:'b7',  studentId:'u8',  roomId:'r3', checkIn:'2024-10-01', checkOut:'2025-09-30', amount:3500, status:'active' },
      { id:'b8',  studentId:'u9',  roomId:'r4', checkIn:'2024-09-01', checkOut:'2025-08-31', amount:4000, status:'active' },
      { id:'b9',  studentId:'u10', roomId:'r4', checkIn:'2024-11-01', checkOut:'2025-10-31', amount:4000, status:'active' },
      { id:'b10', studentId:'u11', roomId:'r5', checkIn:'2025-01-01', checkOut:'2025-12-31', amount:6000, status:'active' },
      { id:'b11', studentId:'u12', roomId:'r6', checkIn:'2024-08-01', checkOut:'2025-07-31', amount:3500, status:'active' },
      { id:'b12', studentId:'u13', roomId:'r6', checkIn:'2024-09-01', checkOut:'2025-08-31', amount:3500, status:'active' },
      { id:'b4',  studentId:'u2',  roomId:'r1', checkIn:'2023-07-01', checkOut:'2024-06-30', amount:4500, status:'completed' },
    ],
    payments: [
      // Arjun Sharma (STU001)
      { id:'p1',  bookingId:'b1',  studentId:'u2',  amount:5000, method:'UPI',         date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010001' },
      { id:'p2',  bookingId:'b1',  studentId:'u2',  amount:5000, method:'Net Banking', date:'2025-03-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2503010002' },
      { id:'p3',  bookingId:'b1',  studentId:'u2',  amount:5000, method:'UPI',         date:'2025-02-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2502010003' },
      { id:'p6',  bookingId:'b1',  studentId:'u2',  amount:5000, method:'',            date:'2025-05-01', status:'pending', type:'Monthly Rent', txnId:'' },
      // Rahul Verma (STU002)
      { id:'p4',  bookingId:'b2',  studentId:'u4',  amount:4000, method:'Debit Card',  date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010004' },
      { id:'p7',  bookingId:'b2',  studentId:'u4',  amount:4000, method:'UPI',         date:'2025-03-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2503010007' },
      { id:'p17', bookingId:'b2',  studentId:'u4',  amount:4000, method:'',            date:'2025-05-01', status:'pending', type:'Monthly Rent', txnId:'' },
      // Sneha Singh (STU003)
      { id:'p5',  bookingId:'b3',  studentId:'u5',  amount:3500, method:'UPI',         date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010005' },
      { id:'p8',  bookingId:'b3',  studentId:'u5',  amount:3500, method:'Net Banking', date:'2025-03-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2503010008' },
      // Priya Kapoor (STU004)
      { id:'p9',  bookingId:'b5',  studentId:'u6',  amount:4000, method:'UPI',         date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010009' },
      { id:'p18', bookingId:'b5',  studentId:'u6',  amount:4000, method:'',            date:'2025-05-01', status:'pending', type:'Monthly Rent', txnId:'' },
      // Ankit Yadav (STU005)
      { id:'p10', bookingId:'b6',  studentId:'u7',  amount:3500, method:'Credit Card', date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010010' },
      // Kavya Reddy (STU006)
      { id:'p11', bookingId:'b7',  studentId:'u8',  amount:3500, method:'UPI',         date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010011' },
      { id:'p19', bookingId:'b7',  studentId:'u8',  amount:3500, method:'',            date:'2025-05-01', status:'pending', type:'Monthly Rent', txnId:'' },
      // Rohit Mehta (STU007)
      { id:'p12', bookingId:'b8',  studentId:'u9',  amount:4000, method:'Net Banking', date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010012' },
      // Pooja Gupta (STU008)
      { id:'p13', bookingId:'b9',  studentId:'u10', amount:4000, method:'UPI',         date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010013' },
      { id:'p20', bookingId:'b9',  studentId:'u10', amount:4000, method:'',            date:'2025-05-01', status:'pending', type:'Monthly Rent', txnId:'' },
      // Sanjay Joshi (STU009)
      { id:'p14', bookingId:'b10', studentId:'u11', amount:6000, method:'Debit Card',  date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010014' },
      // Meera Krishnan (STU010)
      { id:'p15', bookingId:'b11', studentId:'u12', amount:3500, method:'UPI',         date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010015' },
      // Aditya Patil (STU011)
      { id:'p16', bookingId:'b12', studentId:'u13', amount:3500, method:'UPI',         date:'2025-04-01', status:'paid',    type:'Monthly Rent', txnId:'TXN2504010016' },
      { id:'p21', bookingId:'b12', studentId:'u13', amount:3500, method:'',            date:'2025-05-01', status:'pending', type:'Monthly Rent', txnId:'' },
    ],
    requests: [
      { id:'req1', studentId:'u2', type:'Maintenance', description:'Light bulb not working in room', date:'2025-04-08', status:'pending', response:'' },
      { id:'req2', studentId:'u4', type:'Room Change', description:'Requesting room change to 3rd floor for better study environment', date:'2025-04-05', status:'approved', response:'Request approved. Room change will be processed next month.' },
      { id:'req3', studentId:'u5', type:'Complaint', description:'Noise issue from neighboring room after 11 PM', date:'2025-04-07', status:'resolved', response:'Issue has been addressed. Students counseled.' },
      { id:'req4', studentId:'u2', type:'Other', description:'Need extra blanket and pillow', date:'2025-04-09', status:'pending', response:'' },
    ],
    visitors: [
      { id:'v1', name:'Meena Sharma', studentId:'u2', phone:'9876543220', checkIn:'2025-04-10 10:30', checkOut:null, status:'active', purpose:'Family Visit' },
      { id:'v2', name:'Ramesh Verma', studentId:'u4', phone:'9876543221', checkIn:'2025-04-10 09:15', checkOut:'2025-04-10 11:00', status:'checked-out', purpose:'Family Visit' },
      { id:'v3', name:'Anita Singh', studentId:'u5', phone:'9876543222', checkIn:'2025-04-09 14:00', checkOut:'2025-04-09 16:30', status:'checked-out', purpose:'Friend' },
    ],
    attendance: [
      { id:'at1', studentId:'u2', date:'2025-04-10', status:'present', checkIn:'21:30', checkOut:null },
      { id:'at2', studentId:'u4', date:'2025-04-10', status:'present', checkIn:'20:45', checkOut:null },
      { id:'at3', studentId:'u5', date:'2025-04-10', status:'out-pass', checkIn:null, checkOut:'09:00' },
    ],
    notices: [
      { id:'n1', title:'Monthly Fee Due – May 2025', body:'Monthly hostel fee for May 2025 is due by 10th May. Please pay on time to avoid ₹500 late fee charges.', date:'2025-04-01', type:'warning', author:'Admin' },
      { id:'n2', title:'Water Supply Interruption', body:'Water supply will be interrupted on April 12th from 10 AM to 2 PM for annual pipe maintenance.', date:'2025-04-08', type:'info', author:'Admin' },
      { id:'n3', title:'Annual Sports Day – April 20', body:'Annual hostel sports day will be held on April 20th. Events: cricket, badminton, chess. Register by April 18th.', date:'2025-04-05', type:'success', author:'Admin' },
      { id:'n4', title:'Hostel Gate Closing Time Updated', body:'Effective immediately, hostel gate will close at 10:00 PM on weekdays and 11:00 PM on weekends.', date:'2025-04-03', type:'danger', author:'Admin' },
    ]
  },

  init() {
    Object.keys(this.KEYS).forEach(k => {
      if (!localStorage.getItem(this.KEYS[k]) && this.defaults[k]) {
        localStorage.setItem(this.KEYS[k], JSON.stringify(this.defaults[k]));
      }
    });
  },

  async syncFromDB() {
    try {
      const res = await fetch('api/sync.php');
      if (!res.ok) return false;
      const result = await res.json();
      if (result.success && result.data) {
        // Always overwrite localStorage with DB data (even empty arrays)
        Object.entries(result.data).forEach(([k, v]) => {
          localStorage.setItem(this.KEYS[k], JSON.stringify(v ?? []));
        });
        return true;
      }
    } catch (e) { /* offline – keep localStorage */ }
    return false;
  },

  async persist(table, action, data) {
    try {
      await fetch('api/data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, action, data }),
      });
    } catch (e) { /* offline – already saved to localStorage */ }
  },

  get(key) { return JSON.parse(localStorage.getItem(this.KEYS[key]) || '[]'); },
  set(key, data) { localStorage.setItem(this.KEYS[key], JSON.stringify(data)); },
  add(key, item) { const d = this.get(key); d.push(item); this.set(key, d); this.persist(key, 'add', item); return item; },
  update(key, id, updates) {
    const d = this.get(key);
    const i = d.findIndex(x => x.id === id);
    if (i !== -1) { d[i] = { ...d[i], ...updates }; this.set(key, d); this.persist(key, 'update', d[i]); return d[i]; }
    return null;
  },
  remove(key, id) { this.set(key, this.get(key).filter(x => x.id !== id)); this.persist(key, 'remove', { id }); },
  findById(key, id) { return this.get(key).find(x => x.id === id); },
  where(key, fn) { return this.get(key).filter(fn); },
  genId() { return '_' + Math.random().toString(36).slice(2, 11); },
  // Generates sequential payment IDs (p1, p2, p3...) instead of random strings,
  // keeping payment IDs consistent with seeded data and readable in the UI.
  genPaymentId() {
    const payments = this.get('payments');
    const max = payments.reduce((m, p) => {
      const n = parseInt((p.id || '').replace(/^p/, ''));
      return (!isNaN(n) && n > m) ? n : m;
    }, 0);
    return 'p' + (max + 1);
  },

  getSession() { return JSON.parse(sessionStorage.getItem('hms_session') || 'null'); },
  setSession(data) { sessionStorage.setItem('hms_session', JSON.stringify(data)); },
  clearSession() { sessionStorage.removeItem('hms_session'); },
};

// ===== AUTH =====
async function handleLogin(e) {
  e.preventDefault();
  const role = document.getElementById('role').value;
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const btn = e.target.querySelector('.btn-login');

  if (!username || !password) { notify('Please fill in all fields', 'error'); return; }

  btn.textContent = 'Signing in…';
  btn.disabled = true;

  const routes = { admin:'owner-dashboard.html', student:'student-dashboard.html', receptionist:'receptionist-dashboard.html' };

  try {
    const res = await fetch('api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });
    const data = await res.json();
    if (data.success) {
      HMS.setSession({ userId: data.user.id, role: data.user.role, name: data.user.name });
      window.location.href = routes[data.user.role];
      return;
    }
    notify(data.error || 'Invalid credentials. Please check and try again.', 'error');
  } catch (err) {
    // PHP unavailable – fall back to localStorage demo mode
    const users = HMS.get('users');
    const user = users.find(u => u.username === username && u.password === password && u.role === role);
    if (user) {
      HMS.setSession({ userId: user.id, role: user.role, name: user.name });
      window.location.href = routes[user.role];
      return;
    }
    notify('Invalid credentials. Please check and try again.', 'error');
  }

  btn.textContent = 'Sign In';
  btn.disabled = false;
}

function fillCred(username, password, role) {
  document.getElementById('username').value = username;
  document.getElementById('password').value = password;
  document.getElementById('role').value = role;
  syncRoleUI(role);
}

// ===== ROLE PICKER =====
const _roleData = {
  student:      { name: 'Student',       sub: 'Hostel resident access',  color: 'blue'   },
  admin:        { name: 'Admin / Owner', sub: 'Full system control',      color: 'purple' },
  receptionist: { name: 'Receptionist', sub: 'Front desk operations',    color: 'cyan'   },
};

function toggleRolePicker() {
  const trigger = document.getElementById('roleTrigger');
  const panel   = document.getElementById('roleDropdownPanel');
  if (!trigger || !panel) return;
  const isOpen = panel.classList.contains('open');
  if (isOpen) { closeRolePicker(); } else {
    trigger.classList.add('open');
    panel.classList.add('open');
  }
}

function closeRolePicker() {
  const trigger = document.getElementById('roleTrigger');
  const panel   = document.getElementById('roleDropdownPanel');
  if (trigger) trigger.classList.remove('open');
  if (panel)   panel.classList.remove('open');
}

function selectRoleOption(el) {
  const value = el.dataset.value;
  document.getElementById('role').value = value;
  document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  syncRoleUI(value);
  closeRolePicker();
}

function syncRoleUI(value) {
  const data = _roleData[value];
  if (!data) return;
  const nameEl = document.getElementById('roleTriggerName');
  const subEl  = document.getElementById('roleTriggerSub');
  const iconEl = document.getElementById('roleTriggerIcon');
  if (nameEl) nameEl.textContent = data.name;
  if (subEl)  subEl.textContent  = data.sub;
  // sync selected state in panel
  document.querySelectorAll('.role-option').forEach(o => {
    o.classList.toggle('selected', o.dataset.value === value);
  });
  // sync trigger icon gradient color accent
  if (iconEl) {
    iconEl.style.background = value === 'admin'
      ? 'linear-gradient(135deg,#7c3aed,#a855f7)'
      : value === 'receptionist'
        ? 'linear-gradient(135deg,#0891b2,#06b6d4)'
        : 'linear-gradient(135deg,var(--primary),var(--secondary))';
    // swap icon svg to match the selected option icon
    const srcIcon = document.querySelector(`.role-option[data-value="${value}"] .role-opt-icon svg`);
    if (srcIcon) iconEl.innerHTML = srcIcon.outerHTML;
  }
}

// Close role picker when clicking outside
document.addEventListener('click', function(e) {
  const picker = document.getElementById('rolePicker');
  if (picker && !picker.contains(e.target)) closeRolePicker();
});

function logout() {
  const modal = document.getElementById('logoutConfirmModal');
  if (modal) {
    openModal('logoutConfirmModal');
  } else if (confirm('Are you sure you want to logout?')) {
    confirmLogout();
  }
}

function confirmLogout() {
  HMS.clearSession();
  window.location.href = 'login.html';
}

function requireAuth(requiredRole) {
  HMS.init();
  const session = HMS.getSession();
  if (!session) { window.location.href = 'login.html'; return null; }
  if (requiredRole && session.role !== requiredRole) { window.location.href = 'login.html'; return null; }
  return session;
}

// ===== NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
  document.querySelectorAll(`[data-page="${pageId}"]`).forEach(n => n.classList.add('active'));
  document.getElementById('pageTitle').textContent = document.querySelector(`[data-page="${pageId}"]`)?.dataset.title || 'Dashboard';
  if (window.innerWidth <= 768) closeMobileSidebar();
}

function initTopbar(session) {
  document.getElementById('topbarUserName').textContent = session.name.split(' ')[0];
  document.getElementById('topbarUserAvatar').textContent = session.name[0];
  const sidebarName = document.getElementById('sidebarUserName');
  const sidebarRole = document.getElementById('sidebarUserRole');
  const sidebarAvatar = document.getElementById('sidebarUserAvatar');
  if (sidebarName) sidebarName.textContent = session.name;
  if (sidebarRole) sidebarRole.textContent = session.role.charAt(0).toUpperCase() + session.role.slice(1);
  if (sidebarAvatar) sidebarAvatar.textContent = session.name[0];
}

// Mobile sidebar
function toggleMobileSidebar() {
  document.querySelector('.sidebar').classList.toggle('mobile-open');
  document.getElementById('sidebarOverlay').classList.toggle('visible');
}
function closeMobileSidebar() {
  document.querySelector('.sidebar').classList.remove('mobile-open');
  document.getElementById('sidebarOverlay').classList.remove('visible');
}

// ===== MODALS =====
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
// Close on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});

// ===== NOTIFICATIONS =====
function notify(msg, type = 'info', title = '') {
  const icons = {
    success: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
    error: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    warning: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>',
    info: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  };
  const titles = { success:'Success', error:'Error', warning:'Warning', info:'Info' };
  const container = document.querySelector('.notifications-container') || (() => {
    const c = document.createElement('div'); c.className = 'notifications-container'; document.body.appendChild(c); return c;
  })();
  const n = document.createElement('div');
  n.className = `notification ${type === 'error' ? 'error' : type}`;
  n.innerHTML = `<div class="notification-icon">${icons[type] || icons.info}</div>
    <div class="notification-body">
      <div class="notification-title">${title || titles[type]}</div>
      <div class="notification-msg">${msg}</div>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>`;
  container.appendChild(n);
  setTimeout(() => { n.classList.add('hide'); setTimeout(() => n.remove(), 300); }, 4000);
}

// ===== UTILITIES =====
function fmtCurrency(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '-'; }
function fmtDateTime(d) { return d ? new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '-'; }
function today() { return new Date().toISOString().split('T')[0]; }
function avatarLetter(name) { return name ? name[0].toUpperCase() : '?'; }
function avatarColor(name) {
  const colors = ['','green','orange','red','purple'];
  return colors[(name?.charCodeAt(0) || 0) % colors.length];
}

function togglePassword() {
  const inp = document.getElementById('password');
  const btn = document.getElementById('passwordToggle');
  if (inp.type === 'password') {
    inp.type = 'text';
    btn.innerHTML = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/></svg>';
  } else {
    inp.type = 'password';
    btn.innerHTML = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>';
  }
}

function filterTable(searchId, tableId) {
  const term = document.getElementById(searchId).value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
  });
}

function exportTableCSV(tableId, filename) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows = Array.from(table.querySelectorAll('tr'));
  const csv = rows.map(r => Array.from(r.querySelectorAll('th,td')).map(c => `"${c.textContent.trim()}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = filename + '.csv'; a.click();
  notify('CSV exported successfully', 'success');
}

// ===== STUDENT DASHBOARD =====
async function initStudentDashboard() {
  const session = requireAuth('student');
  if (!session) return;
  initTopbar(session);
  showPage('dashboard');
  await HMS.syncFromDB();
  const student = HMS.findById('users', session.userId);
  renderStudentDashboard(student);
  renderStudentBookings(student);
  renderStudentPayments(student);
  renderStudentRequests(student);
  renderStudentProfile(student);
  renderNotices();
}

function renderStudentDashboard(student) {
  const bookings = HMS.where('bookings', b => b.studentId === student.id && b.status === 'active');
  const booking = bookings[0];
  const room = booking ? HMS.findById('rooms', booking.roomId) : null;
  const pendingPayments = HMS.where('payments', p => p.studentId === student.id && p.status === 'pending');
  const pendingAmt = pendingPayments.reduce((s,p) => s + p.amount, 0);
  const allPayments = HMS.where('payments', p => p.studentId === student.id && p.status === 'paid');

  set('statRoom', room ? room.number : 'N/A');
  set('statPending', fmtCurrency(pendingAmt));
  set('statPaidTotal', fmtCurrency(allPayments.reduce((s,p) => s + p.amount, 0)));
  set('statBookingStatus', booking ? 'Active' : 'None');

  if (booking && room) {
    const el = document.getElementById('currentBookingInfo');
    if (el) el.innerHTML = `
      <div class="info-row"><span class="info-label">Room Number</span><span class="info-value fw-600 color-primary">${room.number}</span></div>
      <div class="info-row"><span class="info-label">Room Type</span><span class="info-value">${room.type}</span></div>
      <div class="info-row"><span class="info-label">Floor</span><span class="info-value">${room.floor}</span></div>
      <div class="info-row"><span class="info-label">Monthly Rent</span><span class="info-value fw-600">${fmtCurrency(room.rent)}</span></div>
      <div class="info-row"><span class="info-label">Check-In Date</span><span class="info-value">${fmtDate(booking.checkIn)}</span></div>
      <div class="info-row"><span class="info-label">Check-Out Date</span><span class="info-value">${fmtDate(booking.checkOut)}</span></div>
      <div class="info-row"><span class="info-label">Amenities</span><span class="info-value">${room.amenities.join(', ')}</span></div>
    `;
  }

  const recentPay = HMS.where('payments', p => p.studentId === student.id).slice(-3).reverse();
  const payBody = document.getElementById('recentPaymentsBody');
  if (payBody) payBody.innerHTML = recentPay.length ? recentPay.map(p =>
    `<tr><td>${p.txnId || '-'}</td><td>${p.type}</td><td>${fmtCurrency(p.amount)}</td>
     <td>${fmtDate(p.date)}</td><td><span class="badge ${p.status==='paid'?'badge-success':'badge-warning'}">${p.status}</span></td></tr>`
  ).join('') : '<tr><td colspan="5" class="text-center text-muted">No payments found</td></tr>';
}

function renderStudentBookings(student) {
  const bookings = HMS.where('bookings', b => b.studentId === student.id);
  const tbody = document.getElementById('bookingsBody');
  if (!tbody) return;
  tbody.innerHTML = bookings.length ? bookings.map(b => {
    const room = HMS.findById('rooms', b.roomId);
    return `<tr><td>${b.id}</td><td>${room ? room.number : '-'}</td><td>${room ? room.type : '-'}</td>
      <td>${fmtDate(b.checkIn)}</td><td>${fmtDate(b.checkOut)}</td>
      <td>${fmtCurrency(b.amount)}/mo</td>
      <td><span class="badge ${b.status==='active'?'badge-success':b.status==='pending'?'badge-warning':'badge-secondary'}">${b.status}</span></td></tr>`;
  }).join('') : '<tr><td colspan="7" class="text-center text-muted" style="padding:24px">No bookings found</td></tr>';
}

function renderStudentPayments(student) {
  let payments = HMS.where('payments', p => p.studentId === student.id);
  const pending = payments.filter(p => p.status === 'pending');
  const pendingAmt = pending.reduce((s,p) => s + p.amount, 0);

  set('paymentHeroAmount', fmtCurrency(pendingAmt));
  set('paymentHeroLabel', pendingAmt > 0 ? 'Amount Due' : 'No Pending Dues');
  set('paymentDueDate', pendingAmt > 0 ? 'Due by 10th of this month' : 'All payments up to date');

  // Apply date range filter
  const fromEl = document.getElementById('stuPayDateFrom');
  const toEl = document.getElementById('stuPayDateTo');
  const from = fromEl ? fromEl.value : '';
  const to = toEl ? toEl.value : '';
  let filtered = [...payments];
  if (from) filtered = filtered.filter(p => p.date && p.date >= from);
  if (to)   filtered = filtered.filter(p => p.date && p.date <= to);
  // Apply sort
  const { col: sc, dir: sd } = stuSortState.payments;
  filtered.sort((a, b) => {
    if (sc === 'amount') return sd === 'asc' ? (a.amount||0) - (b.amount||0) : (b.amount||0) - (a.amount||0);
    if (sc === 'status') return sd === 'asc' ? (a.status||'').localeCompare(b.status||'') : (b.status||'').localeCompare(a.status||'');
    // FIX: Use direct < > comparison instead of localeCompare() for ISO date strings (YYYY-MM-DD).
    // localeCompare() is locale-sensitive and produces wrong order on Indian/non-English Windows locales.
    const da = a.date || '', db = b.date || '';
    return sd === 'asc' ? (da < db ? -1 : da > db ? 1 : 0) : (db < da ? -1 : db > da ? 1 : 0);
  });

  const tbody = document.getElementById('paymentHistoryBody');
  if (!tbody) return;
  tbody.innerHTML = filtered.length ? filtered.map(p =>
    `<tr><td>${p.txnId || '-'}</td><td>${p.type}</td><td>${fmtCurrency(p.amount)}</td>
     <td>${p.method || '-'}</td><td>${fmtDate(p.date)}</td>
     <td><span class="badge ${p.status==='paid'?'badge-success':'badge-warning'}">${p.status}</span></td>
     <td>${p.status==='paid'?`<button class="btn btn-sm btn-secondary" onclick="printReceipt('${p.id}')">Receipt</button>`:'—'}</td></tr>`
  ).join('') : '<tr><td colspan="7" class="text-center text-muted" style="padding:24px">No payment records found</td></tr>';
}

function renderStudentRequests(student) {
  const reqs = HMS.where('requests', r => r.studentId === student.id);
  const tbody = document.getElementById('requestsBody');
  if (!tbody) return;
  // Apply sort
  const { col: rc, dir: rd } = stuSortState.requests;
  const sorted = [...reqs].sort((a, b) => {
    if (rc === 'status') return rd === 'asc' ? (a.status||'').localeCompare(b.status||'') : (b.status||'').localeCompare(a.status||'');
    // default: date
    return rd === 'asc' ? (a.date||'').localeCompare(b.date||'') : (b.date||'').localeCompare(a.date||'');
  });
  tbody.innerHTML = sorted.length ? sorted.map(r =>
    `<tr><td>${r.id}</td><td><span class="badge badge-info">${r.type}</span></td>
     <td>${r.description}</td><td>${fmtDate(r.date)}</td>
     <td><span class="badge ${r.status==='resolved'||r.status==='approved'?'badge-success':r.status==='rejected'?'badge-danger':'badge-warning'}">${r.status}</span></td>
     <td>${r.response || '—'}</td></tr>`
  ).join('') : '<tr><td colspan="6" class="text-center text-muted" style="padding:24px">No requests submitted</td></tr>';
}

function renderStudentProfile(student) {
  set('profileInitial', student.name[0]);
  set('profileFullName', student.name);
  set('profileRoleBadge', 'Student');
  setInput('editName', student.name);
  setInput('editEmail', student.email);
  setInput('editPhone', student.phone);
  setInput('editStudentId', student.studentId);
  setInput('editBloodGroup', student.bloodGroup);
  setInput('editEmergency', student.emergencyContact);
  setInput('editCourse', student.course);
  setInput('editYear', student.year);
  setInput('editFather', student.fatherName);
  setInput('editAddress', student.address);
}

function submitRequest(e) {
  e.preventDefault();
  const session = HMS.getSession();
  const type = document.getElementById('reqType').value;
  const desc = document.getElementById('reqDesc').value.trim();
  if (!desc) { notify('Please describe your request', 'warning'); return; }
  HMS.add('requests', { id: HMS.genId(), studentId: session.userId, type, description: desc, date: today(), status: 'pending', response: '' });
  notify('Request submitted successfully', 'success');
  closeModal('requestModal');
  e.target.reset();
  const student = HMS.findById('users', session.userId);
  renderStudentRequests(student);
}

// Pre-fills the amount field with the current pending due so the student
// sees exactly what they owe before editing it for a partial payment.
function openPaymentModal() {
  const session = HMS.getSession();
  const pending = HMS.where('payments', p => p.studentId === session.userId && p.status === 'pending');
  const amtEl = document.getElementById('payAmount');
  if (amtEl && pending.length) amtEl.value = pending[0].amount;
  openModal('paymentModal');
}

function submitPayment(e) {
  e.preventDefault();
  const session = HMS.getSession();
  const method = document.getElementById('payMethod').value;
  const amount = Number(document.getElementById('payAmount').value);
  if (!method || !amount) { notify('Please fill in all payment details', 'warning'); return; }

  const pending = HMS.where('payments', p => p.studentId === session.userId && p.status === 'pending');
  const txnId = 'TXN' + Date.now();

  if (pending.length) {
    const pendingAmt = Number(pending[0].amount);
    if (amount >= pendingAmt) {
      // Paying full amount or more — mark the pending record as paid with the actual due amount
      HMS.update('payments', pending[0].id, { amount: pendingAmt, method, status: 'paid', txnId });
    } else {
      // Partial payment — create a new paid record for the amount entered,
      // and reduce the pending balance by that amount
      HMS.add('payments', { id: HMS.genPaymentId(), bookingId: pending[0].bookingId, studentId: session.userId, amount, method, date: today(), status: 'paid', type: pending[0].type || 'Monthly Rent', txnId });
      HMS.update('payments', pending[0].id, { amount: pendingAmt - amount });
    }
  } else {
    // No pending record — just log a new paid payment
    HMS.add('payments', { id: HMS.genPaymentId(), bookingId: '', studentId: session.userId, amount, method, date: today(), status: 'paid', type: 'Monthly Rent', txnId });
  }

  notify(`Payment of ${fmtCurrency(amount)} made successfully via ${method}!`, 'success');
  closeModal('paymentModal');
  e.target.reset();
  renderStudentPayments(HMS.findById('users', session.userId));
  renderStudentDashboard(HMS.findById('users', session.userId));
}

function updateProfile(e) {
  e.preventDefault();
  const session = HMS.getSession();
  HMS.update('users', session.userId, {
    name: document.getElementById('editName').value,
    email: document.getElementById('editEmail').value,
    phone: document.getElementById('editPhone').value,
    bloodGroup: document.getElementById('editBloodGroup').value,
    emergencyContact: document.getElementById('editEmergency').value,
    course: document.getElementById('editCourse').value,
    year: document.getElementById('editYear').value,
    fatherName: document.getElementById('editFather').value,
    address: document.getElementById('editAddress').value,
  });
  notify('Profile updated successfully', 'success');
  const updated = HMS.findById('users', session.userId);
  HMS.setSession({ ...session, name: updated.name });
  initTopbar(HMS.getSession());
  renderStudentProfile(updated);
}

async function changePassword(e) {
  e.preventDefault();
  const session = HMS.getSession();
  const user = HMS.findById('users', session.userId);
  const old = document.getElementById('oldPass').value;
  const np  = document.getElementById('newPass').value;
  const cp  = document.getElementById('confirmPass').value;
  if (np.length < 6) { notify('New password must be at least 6 characters', 'warning'); return; }
  if (np !== cp) { notify('New passwords do not match', 'error'); return; }

  try {
    const res = await fetch('api/change-password.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.userId, oldPassword: old, newPassword: np }),
    });
    const data = await res.json();
    if (!data.success) { notify(data.error || 'Current password is incorrect', 'error'); return; }
  } catch (err) {
    // Offline fallback: verify against localStorage plaintext
    if (user.password && user.password !== old) { notify('Current password is incorrect', 'error'); return; }
  }

  HMS.update('users', session.userId, { password: np });
  notify('Password changed successfully', 'success');
  e.target.reset();
}

function printReceipt(paymentId) {
  const p = HMS.findById('payments', paymentId);
  if (!p) return;
  const student = HMS.findById('users', p.studentId);
  const w = window.open('', '_blank');
  w.document.head.innerHTML = `<title>Receipt</title><style>body{font-family:Arial;padding:40px;max-width:500px;margin:0 auto}h2{color:#4338ca}.amount{font-size:24px;font-weight:700;color:#10b981}p{margin:8px 0}hr{border:none;border-top:1px solid #eee;margin:16px 0}</style>`;
  w.document.body.innerHTML = `<h2>Hostel Pro - Payment Receipt</h2><hr>
    <p><strong>Transaction ID:</strong> ${p.txnId}</p>
    <p><strong>Date:</strong> ${fmtDate(p.date)}</p>
    <p><strong>Student:</strong> ${student?.name}</p>
    <p><strong>Payment Type:</strong> ${p.type}</p>
    <p><strong>Method:</strong> ${p.method}</p>
    <p class="amount">Amount: ${fmtCurrency(p.amount)}</p>
    <p><strong>Status:</strong> PAID</p><hr>
    <p style="font-size:12px;color:#666">This is a computer-generated receipt. No signature required.</p>`;
  w.print();
}

// ===== NOTICES =====
function renderNotices() {
  const notices = HMS.get('notices');
  const containers = document.querySelectorAll('.notices-list');
  if (!containers.length) return;
  const html = notices.length ? [...notices].reverse().map(n =>
    `<div class="notice-item ${n.type}">
      <div class="notice-title">${n.title}</div>
      <div class="notice-body">${n.body}</div>
      <div class="notice-meta">Posted by ${n.author} · ${fmtDate(n.date)}</div>
    </div>`
  ).join('') : '<p class="text-muted text-sm">No notices posted</p>';
  containers.forEach(c => c.innerHTML = html);
}

// ===== ADMIN SORT STATE =====
const adminSortState = {
  students: { col: 'id', dir: 'asc' },
  payments: { col: 'date', dir: 'desc' }
};
// ===== RECEPTIONIST SORT STATE =====
const recSortState = {
  students:   { col: 'name',  dir: 'asc'  },
  visitors:   { col: 'date',  dir: 'desc' },
  attendance: { col: 'name',  dir: 'asc'  },
  payments:   { col: 'date',  dir: 'desc' }
};
// ===== STUDENT SORT STATE =====
const stuSortState = {
  payments: { col: 'date', dir: 'desc' },
  requests: { col: 'date', dir: 'desc' }
};

// ===== ADMIN DASHBOARD =====
function reconcileRooms() {
  // Recalculate room occupancy from actual student assignments (fixes stale/wrong counts)
  const rooms = HMS.get('rooms');
  rooms.forEach(room => {
    const occupants = HMS.where('users', u => u.role === 'student' && u.roomId === room.id);
    const actual = occupants.length;
    let newStatus = room.status;
    if (room.status !== 'maintenance') {
      if (actual === 0) newStatus = 'available';
      else if (actual >= room.beds) newStatus = 'occupied';
      else newStatus = 'partial';
    }
    if (room.occupied !== actual || room.status !== newStatus) {
      HMS.update('rooms', room.id, { occupied: actual, status: newStatus });
    }
  });
}

async function initAdminDashboard() {
  const session = requireAuth('admin');
  if (!session) return;
  initTopbar(session);
  showPage('dashboard');
  await HMS.syncFromDB();
  reconcileRooms();
  renderAdminStats(); renderAdminRooms(); renderAdminStudents();
  renderAdminRequests(); renderAdminPayments(); renderAdminActivity();
  renderNoticesAdmin(); populateRoomDropdowns();
  setTimeout(initCharts, 100);
}

function renderAdminStats() {
  const rooms = HMS.get('rooms');
  const students = HMS.where('users', u => u.role === 'student');
  const payments = HMS.get('payments');
  const requests = HMS.where('requests', r => r.status === 'pending');
  const curMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-05"
  const monthlyRev = payments.filter(p => p.status==='paid' && p.date?.startsWith(curMonth)).reduce((s,p) => s+p.amount, 0);
  const occupied = rooms.filter(r => r.status === 'occupied' || r.status === 'partial').length;

  set('statTotalRooms', rooms.length);
  set('statOccupied', `${occupied}/${rooms.length}`);
  set('statStudents', students.length);
  set('statMonthRevenue', fmtCurrency(monthlyRev));
  set('statPendingReqs', requests.length);
  const pendingPayAmt = payments.filter(p=>p.status==='pending').reduce((s,p)=>s+p.amount,0);
  set('statPendingPay', fmtCurrency(pendingPayAmt));

  // Update sidebar badge
  const badge = document.getElementById('pendingReqBadge');
  if (badge) { badge.textContent = requests.length || ''; badge.style.display = requests.length ? '' : 'none'; }
  // Also sync analytics page stats
  set('statMonthRevenue2', fmtCurrency(monthlyRev));
  set('statOccupied2', `${occupied}/${rooms.length}`);
  set('statStudents2', students.length);
}

function renderAdminRooms() {
  const statusFilter = document.getElementById('roomStatusFilter')?.value || '';
  let rooms = HMS.get('rooms');
  if (statusFilter) rooms = rooms.filter(r => r.status === statusFilter);
  const container = document.getElementById('roomsContainer');
  if (!container) return;
  container.innerHTML = rooms.map(r => {
    const occupants = HMS.where('users', u => u.role === 'student' && u.roomId === r.id);
    const actualOccupied = occupants.length;
    const pct = r.beds > 0 ? Math.round((actualOccupied / r.beds) * 100) : 0;
    const color = pct === 100 ? 'red' : pct > 50 ? 'orange' : 'green';
    const statusBadge = { occupied:'badge-danger', partial:'badge-warning', available:'badge-success', maintenance:'badge-secondary' }[r.status] || 'badge-secondary';
    const amenities = (r.amenities||[]).map(a => `<span class="amenity-tag">${a}</span>`).join('');
    return `<div class="room-card">
      <div class="room-card-header">
        <div class="room-card-top">
          <div><div class="room-card-number">${r.number}</div><div class="room-card-type">${r.type} · ${r.floor}</div></div>
          <div class="text-right"><div class="room-card-rent">${fmtCurrency(r.rent)}</div><div class="room-card-rent-label">/month</div></div>
        </div>
      </div>
      <div class="room-card-body">
        <div class="room-info-row"><span>Beds</span><strong>${r.beds}</strong></div>
        <div class="room-info-row"><span>Occupied</span><strong>${actualOccupied}/${r.beds}</strong></div>
        <div class="room-info-row"><span>Bathroom</span><strong>${r.bathrooms}</strong></div>
        <div class="room-info-row"><span>Status</span><span class="badge ${statusBadge}">${r.status}</span></div>
        <div class="room-occupancy">
          <div class="occupancy-text"><span>Occupancy</span><span>${pct}%</span></div>
          <div class="progress-bar"><div class="progress-fill ${color}" style="width:${pct}%"></div></div>
        </div>
        ${amenities ? `<div class="room-amenities">${amenities}</div>` : ''}
      </div>
      <div class="room-card-footer">
        <button class="btn btn-sm btn-outline" onclick="openEditRoom('${r.id}')"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>Edit</button>
        <button class="btn btn-sm btn-secondary" onclick="deleteRoom('${r.id}')"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>Delete</button>
      </div>
    </div>`;
  }).join('');
}

function renderAdminStudents() {
  let students = HMS.where('users', u => u.role === 'student');
  // Apply check-in date range filter if set
  const fromEl = document.getElementById('stuDateFrom');
  const toEl = document.getElementById('stuDateTo');
  const from = fromEl ? fromEl.value : '';
  const to = toEl ? toEl.value : '';
  if (from || to) {
    students = students.filter(s => {
      const booking = HMS.where('bookings', b => b.studentId === s.id && b.status === 'active')[0];
      const checkIn = booking ? booking.checkIn : '';
      if (!checkIn) return false;
      if (from && checkIn < from) return false;
      if (to && checkIn > to) return false;
      return true;
    });
  }
  const { col, dir } = adminSortState.students;
  students = [...students].sort((a, b) => {
    let va = '', vb = '';
    if (col === 'id') { va = a.studentId || ''; vb = b.studentId || ''; }
    else if (col === 'name') { va = a.name || ''; vb = b.name || ''; }
    else if (col === 'room') {
      va = a.roomId ? (HMS.findById('rooms', a.roomId)?.number || '') : '';
      vb = b.roomId ? (HMS.findById('rooms', b.roomId)?.number || '') : '';
    }
    return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });
  const tbody = document.getElementById('studentsBody');
  if (!tbody) return;
  tbody.innerHTML = students.length ? students.map(s => {
    const room = s.roomId ? HMS.findById('rooms', s.roomId) : null;
    const booking = HMS.where('bookings', b => b.studentId === s.id && b.status === 'active')[0];
    const cl = avatarColor(s.name);
    return `<tr>
      <td>${s.studentId || '-'}</td>
      <td><div class="td-name"><div class="avatar ${cl} sm">${avatarLetter(s.name)}</div><div><div class="fw-600">${s.name}</div><div class="td-sub">${s.email}</div></div></div></td>
      <td>${s.phone || '-'}</td>
      <td>${room ? room.number : '<span class="text-muted">Not assigned</span>'}</td>
      <td>${s.course || '-'}</td>
      <td><span class="badge ${booking?'badge-success':'badge-secondary'}">${booking?'Active':'Inactive'}</span></td>
      <td class="btn-group">
        <button class="btn btn-sm btn-outline" onclick="viewStudent('${s.id}')">View</button>
        <button class="btn btn-sm btn-secondary" onclick="editStudent('${s.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteStudent('${s.id}')">Remove</button>
      </td></tr>`;
  }).join('') : '<tr><td colspan="7" class="text-center text-muted" style="padding:24px">No students found</td></tr>';
}

function renderAdminRequests() {
  const requests = HMS.get('requests');
  const tbody = document.getElementById('requestsAdminBody');
  if (!tbody) return;
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const badge = document.getElementById('adminReqBadge');
  if (badge) { badge.textContent = pendingCount || ''; badge.style.display = pendingCount ? '' : 'none'; }
  tbody.innerHTML = requests.length ? [...requests].reverse().map(r => {
    const student = HMS.findById('users', r.studentId);
    const cls = r.status==='resolved'||r.status==='approved' ? 'badge-success' : r.status==='rejected' ? 'badge-danger' : 'badge-warning';
    const canRespond = r.status === 'pending' || r.status === 'approved';
    return `<tr>
      <td style="font-size:11px;color:var(--text-2)">#${r.id?.slice(-6)||'-'}</td>
      <td><div class="fw-600">${student?.name||'Unknown'}</div><div style="font-size:11px;color:var(--text-2)">${student?.studentId||''}</div></td>
      <td><span class="badge badge-secondary" style="font-size:11px">${r.type||'General'}</span></td>
      <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px" title="${r.description||''}">${r.description||'-'}</td>
      <td style="font-size:12px">${r.date ? new Date(r.date).toLocaleDateString('en-IN') : '-'}</td>
      <td><span class="badge ${cls}">${r.status||'pending'}</span></td>
      <td>${canRespond
        ? `<button class="btn btn-sm btn-primary" onclick="openAdminRespond('${r.id}')">Respond</button>`
        : `<span style="font-size:12px;color:var(--text-2)">${r.response||'—'}</span>`}
      </td></tr>`;
  }).join('') : '<tr><td colspan="7" class="text-center text-muted" style="padding:24px">No requests found</td></tr>';
}

function openAdminRespond(id) {
  const req = HMS.findById('requests', id);
  if (!req) return;
  const s = HMS.findById('users', req.studentId);
  setInput('adminRespondId', id);
  const info = document.getElementById('adminRespondInfo');
  if (info) info.innerHTML = `<strong>${s?.name||'Unknown'}</strong> — <em>${req.type||'General'}</em><br><span style="color:var(--text-2);margin-top:4px;display:block">${req.description||''}</span>`;
  const note = document.getElementById('adminRespondNote');
  if (note) note.value = req.response || '';
  openModal('adminRespondModal');
}

function adminActOnRequest(newStatus) {
  const id = document.getElementById('adminRespondId')?.value;
  const note = document.getElementById('adminRespondNote')?.value.trim() || '';
  if (!id) return;
  HMS.update('requests', id, {
    status: newStatus,
    response: note || (newStatus==='approved'?'Request approved.':newStatus==='rejected'?'Request rejected.':'Issue resolved.'),
    resolvedAt: new Date().toISOString(),
    resolvedBy: HMS.getSession()?.name || 'Admin'
  });
  closeModal('adminRespondModal');
  notify('Request ' + newStatus + ' successfully', newStatus==='rejected'?'warning':'success');
  renderAdminRequests(); renderAdminStats();
  if (typeof populateQuickRequests === 'function') populateQuickRequests();
}

function renderAdminPayments() {
  let payments = HMS.get('payments');
  const { col, dir } = adminSortState.payments;
  // Apply date range filter if set
  const fromEl = document.getElementById('payDateFrom');
  const toEl = document.getElementById('payDateTo');
  const from = fromEl ? fromEl.value : '';
  const to = toEl ? toEl.value : '';
  if (from) payments = payments.filter(p => p.date && p.date >= from);
  if (to)   payments = payments.filter(p => p.date && p.date <= to);
  // FIX: Use direct < > comparison for date sort — locale-safe for YYYY-MM-DD on all Windows locales.
  payments = [...payments].sort((a, b) => {
    if (col === 'date') {
      const da = a.date || '', db = b.date || '';
      return dir === 'asc' ? (da < db ? -1 : da > db ? 1 : 0) : (db < da ? -1 : db > da ? 1 : 0);
    }
    let va = '', vb = '';
    if (col === 'name') {
      va = HMS.findById('users', a.studentId)?.name || '';
      vb = HMS.findById('users', b.studentId)?.name || '';
    } else if (col === 'id') {
      va = HMS.findById('users', a.studentId)?.studentId || '';
      vb = HMS.findById('users', b.studentId)?.studentId || '';
    }
    return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });
  const tbody = document.getElementById('paymentsAdminBody');
  if (!tbody) return;
  tbody.innerHTML = payments.length ? payments.map(p => {
    const student = HMS.findById('users', p.studentId);
    return `<tr>
      <td>${p.txnId || '-'}</td>
      <td>${student?.name || '-'}</td>
      <td>${student?.studentId || '-'}</td>
      <td>${p.type}</td>
      <td>${fmtCurrency(p.amount)}</td>
      <td>${p.method || '-'}</td>
      <td>${fmtDate(p.date)}</td>
      <td><span class="badge ${p.status==='paid'?'badge-success':'badge-warning'}">${p.status}</span></td>
    </tr>`;
  }).join('') : '<tr><td colspan="8" class="text-center text-muted" style="padding:24px">No payments</td></tr>';
}

function renderAdminActivity() {
  const container = document.getElementById('activityFeed');
  if (!container) return;
  const activities = [
    { text:'Arjun Sharma made payment of ₹5,000 via UPI', time:'2 hours ago', color:'green' },
    { text:'New request submitted by Rahul Verma: Room Change', time:'4 hours ago', color:'blue' },
    { text:'Visitor Meena Sharma checked in for Arjun Sharma', time:'5 hours ago', color:'orange' },
    { text:'Room A-101 maintenance request resolved', time:'Yesterday', color:'purple' },
    { text:'New student Sneha Singh registered and assigned Room B-201', time:'2 days ago', color:'green' },
  ];
  container.innerHTML = activities.map(a =>
    `<div class="activity-item"><div class="activity-dot ${a.color}"></div><div class="activity-body"><div class="activity-text">${a.text}</div><div class="activity-time">${a.time}</div></div></div>`
  ).join('');
}

function renderNoticesAdmin() {
  const notices = HMS.get('notices');
  const container = document.getElementById('noticesAdminList');
  if (!container) return;
  container.innerHTML = notices.length ? [...notices].reverse().map(n =>
    `<div class="notice-item ${n.type}">
      <div class="notice-title">${n.title}
        <button class="btn btn-sm btn-ghost" style="margin-left:8px" onclick="deleteNotice('${n.id}')"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
      </div>
      <div class="notice-body">${n.body}</div>
      <div class="notice-meta">Posted by ${n.author} · ${fmtDate(n.date)}</div>
    </div>`
  ).join('') : '<p class="text-muted text-sm">No notices posted yet</p>';
}

// Admin CRUD
function addRoom(e) {
  e.preventDefault();
  const amenities = document.getElementById('roomAmenities').value.split(',').map(a=>a.trim()).filter(Boolean);
  const newRoom = {
    id: HMS.genId(), number: document.getElementById('roomNumber').value,
    floor: document.getElementById('roomFloor').value, type: document.getElementById('roomType').value,
    beds: Number(document.getElementById('roomBeds').value), occupied: 0,
    bathrooms: document.getElementById('roomBath').value,
    rent: Number(document.getElementById('roomRent').value),
    status: 'available', amenities
  };
  HMS.add('rooms', newRoom);
  notify('Room added successfully', 'success');
  closeModal('addRoomModal');
  e.target.reset();
  renderAdminRooms(); renderAdminStats();
}

function openEditRoom(id) {
  const r = HMS.findById('rooms', id);
  if (!r) return;
  setInput('editRoomId', r.id); setInput('editRoomNumber', r.number);
  setInput('editRoomFloor', r.floor); setInput('editRoomType', r.type);
  setInput('editRoomBeds', r.beds); setInput('editRoomBath', r.bathrooms);
  setInput('editRoomRent', r.rent); setInput('editRoomStatus', r.status);
  setInput('editRoomAmenities', r.amenities.join(', '));
  // Populate current occupants
  const occupants = HMS.where('users', u => u.role === 'student' && u.roomId === id);
  const container = document.getElementById('editRoomOccupants');
  if (container) {
    if (occupants.length) {
      container.innerHTML = `<div class="form-label-d" style="margin-bottom:8px">Current Occupants (${occupants.length}/${r.beds})</div>` +
        occupants.map(s => {
          const cl = avatarColor(s.name);
          const booking = HMS.where('bookings', b => b.studentId === s.id && b.status === 'active')[0];
          return `<div class="occupant-row">
            <div class="td-name">
              <div class="avatar ${cl} sm">${avatarLetter(s.name)}</div>
              <div>
                <div class="fw-600">${s.name} <span class="text-muted text-sm">(${s.studentId||'-'})</span></div>
                <div class="td-sub">Check-in: ${booking ? fmtDate(booking.checkIn) : '-'}</div>
              </div>
            </div>
          </div>`;
        }).join('');
    } else {
      container.innerHTML = '<div class="text-muted text-sm" style="padding:8px 0">No students currently assigned to this room.</div>';
    }
  }
  openModal('editRoomModal');
}

function saveRoom(e) {
  e.preventDefault();
  const id = document.getElementById('editRoomId').value;
  const amenities = document.getElementById('editRoomAmenities').value.split(',').map(a=>a.trim()).filter(Boolean);
  HMS.update('rooms', id, {
    number: document.getElementById('editRoomNumber').value,
    floor: document.getElementById('editRoomFloor').value,
    type: document.getElementById('editRoomType').value,
    beds: Number(document.getElementById('editRoomBeds').value),
    bathrooms: document.getElementById('editRoomBath').value,
    rent: Number(document.getElementById('editRoomRent').value),
    status: document.getElementById('editRoomStatus').value,
    amenities
  });
  notify('Room updated successfully', 'success');
  closeModal('editRoomModal');
  renderAdminRooms(); renderAdminStats();
}

function deleteRoom(id) {
  if (!confirm('Delete this room? This action cannot be undone.')) return;
  HMS.remove('rooms', id);
  notify('Room deleted', 'success');
  renderAdminRooms(); renderAdminStats();
}

function addStudent(e) {
  e.preventDefault();
  const roomId = document.getElementById('newStudentRoom').value;
  const username = document.getElementById('newStudentUser').value;
  const existing = HMS.where('users', u => u.username === username);
  if (existing.length) { notify('Username already exists', 'error'); return; }
  const newStudent = {
    id: HMS.genId(), username, password: document.getElementById('newStudentPass').value,
    role: 'student', name: document.getElementById('newStudentName').value,
    email: document.getElementById('newStudentEmail').value,
    phone: document.getElementById('newStudentPhone').value,
    studentId: 'STU' + String(HMS.where('users', u=>u.role==='student').length + 1).padStart(3,'0'),
    roomId, course: document.getElementById('newStudentCourse').value,
    year: document.getElementById('newStudentYear').value,
    bloodGroup: '', emergencyContact: '', fatherName: '', address: ''
  };
  HMS.add('users', newStudent);
  if (roomId) {
    const room = HMS.findById('rooms', roomId);
    if (room) {
      const newOccupied = Math.min(room.occupied + 1, room.beds);
      HMS.update('rooms', roomId, { occupied: newOccupied, status: newOccupied >= room.beds ? 'occupied' : 'partial' });
      const bookingId = HMS.genId();
      HMS.add('bookings', { id: bookingId, studentId: newStudent.id, roomId, checkIn: today(), checkOut: '', amount: room.rent, status: 'active' });
      // FIX: Automatically create a pending payment for the current month when a room is assigned.
      // Without this, new students showed ₹0 dues even though they had an active booking.
      const monthStart = today().slice(0, 7) + '-01';
      HMS.add('payments', { id: HMS.genPaymentId(), bookingId, studentId: newStudent.id, amount: room.rent, method: '', date: monthStart, status: 'pending', type: 'Monthly Rent', txnId: '' });
    }
  }
  notify('Student added successfully', 'success');
  closeModal('addStudentModal');
  e.target.reset(); populateRoomDropdowns();
  renderAdminStudents(); renderAdminStats(); renderAdminRooms();
}

function viewStudent(id) {
  const s = HMS.findById('users', id);
  const room = s.roomId ? HMS.findById('rooms', s.roomId) : null;
  const booking = HMS.where('bookings', b => b.studentId === id && b.status === 'active')[0];
  const body = document.getElementById('viewStudentBody');
  if (body) body.innerHTML = `
    <div style="text-align:center;padding:0 0 20px;border-bottom:1px solid var(--border);margin-bottom:20px">
      <div class="profile-avatar-large" style="margin:0 auto 12px">${s.name[0]}</div>
      <div class="profile-name">${s.name}</div>
      <div class="profile-role">${s.course || 'Student'} · ${s.year || ''}</div>
    </div>
    <div class="info-row"><span class="info-label">Student ID</span><span class="info-value">${s.studentId||'-'}</span></div>
    <div class="info-row"><span class="info-label">Email</span><span class="info-value">${s.email||'-'}</span></div>
    <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${s.phone||'-'}</span></div>
    <div class="info-row"><span class="info-label">Room</span><span class="info-value fw-600 color-primary">${room?room.number:'Not Assigned'}</span></div>
    <div class="info-row"><span class="info-label">Blood Group</span><span class="info-value">${s.bloodGroup||'-'}</span></div>
    <div class="info-row"><span class="info-label">Emergency Contact</span><span class="info-value">${s.emergencyContact||'-'}</span></div>
    <div class="info-row"><span class="info-label">Father's Name</span><span class="info-value">${s.fatherName||'-'}</span></div>
    <div class="info-row"><span class="info-label">Address</span><span class="info-value">${s.address||'-'}</span></div>
    ${booking?`<div class="info-row"><span class="info-label">Check-In</span><span class="info-value">${fmtDate(booking.checkIn)}</span></div>`:''}
  `;
  openModal('viewStudentModal');
}

function editStudent(id) {
  const s = HMS.findById('users', id);
  setInput('editStudentId', s.id); setInput('editStudentName', s.name);
  setInput('editStudentEmail', s.email); setInput('editStudentPhone', s.phone);
  setInput('editStudentCourse', s.course); setInput('editStudentYear', s.year);
  setInput('editStudentBlood', s.bloodGroup);
  // Clear password fields
  setInput('editStudentNewPass', ''); setInput('editStudentConfirmPass', '');
  const roomSel = document.getElementById('editStudentRoom');
  if (roomSel) {
    populateRoomDropdown(roomSel);
    roomSel.value = s.roomId || '';
  }
  openModal('editStudentModal');
}

// FIX: saveStudent now fully handles room changes — releases old room/booking, creates new booking,
// updates occupancy counts on both rooms, and creates a pending payment for the new room if needed.
function saveStudent(e) {
  e.preventDefault();
  const id = document.getElementById('editStudentId').value;
  const newRoomId = document.getElementById('editStudentRoom').value;
  const existing = HMS.findById('users', id);
  const oldRoomId = existing ? existing.roomId : '';
  const updates = {
    name: document.getElementById('editStudentName').value,
    email: document.getElementById('editStudentEmail').value,
    phone: document.getElementById('editStudentPhone').value,
    course: document.getElementById('editStudentCourse').value,
    year: document.getElementById('editStudentYear').value,
    bloodGroup: document.getElementById('editStudentBlood').value,
    roomId: newRoomId,
  };
  // Handle optional password change
  const newPass = (document.getElementById('editStudentNewPass')?.value || '').trim();
  const confirmPass = (document.getElementById('editStudentConfirmPass')?.value || '').trim();
  if (newPass) {
    if (newPass.length < 6) { notify('Password must be at least 6 characters', 'error'); return; }
    if (newPass !== confirmPass) { notify('Passwords do not match', 'error'); return; }
    updates.password = newPass;
  }
  HMS.update('users', id, updates);
  // Handle room assignment change
  if (newRoomId !== oldRoomId) {
    // Release old room
    if (oldRoomId) {
      const oldRoom = HMS.findById('rooms', oldRoomId);
      if (oldRoom) {
        const occ = Math.max(0, oldRoom.occupied - 1);
        HMS.update('rooms', oldRoomId, { occupied: occ, status: occ <= 0 ? 'available' : occ < oldRoom.beds ? 'partial' : 'occupied' });
      }
      // Close old active booking
      const oldBooking = HMS.where('bookings', b => b.studentId === id && b.status === 'active')[0];
      if (oldBooking) HMS.update('bookings', oldBooking.id, { status: 'inactive', checkOut: today() });
    }
    // Assign new room
    if (newRoomId) {
      const newRoom = HMS.findById('rooms', newRoomId);
      if (newRoom) {
        const newOcc = Math.min(newRoom.occupied + 1, newRoom.beds);
        HMS.update('rooms', newRoomId, { occupied: newOcc, status: newOcc >= newRoom.beds ? 'occupied' : 'partial' });
        const bookingId = HMS.genId();
        HMS.add('bookings', { id: bookingId, studentId: id, roomId: newRoomId, checkIn: today(), checkOut: '', amount: newRoom.rent, status: 'active' });
        // Create pending payment only if no existing pending payment for this student
        const hasPending = HMS.where('payments', p => p.studentId === id && p.status === 'pending').length > 0;
        if (!hasPending) {
          const monthStart = today().slice(0, 7) + '-01';
          HMS.add('payments', { id: HMS.genPaymentId(), bookingId, studentId: id, amount: newRoom.rent, method: '', date: monthStart, status: 'pending', type: 'Monthly Rent', txnId: '' });
        }
      }
    }
    renderAdminRooms();
  }
  // Clear password fields
  if (document.getElementById('editStudentNewPass')) document.getElementById('editStudentNewPass').value = '';
  if (document.getElementById('editStudentConfirmPass')) document.getElementById('editStudentConfirmPass').value = '';
  notify('Student updated successfully' + (newPass ? ' (password changed)' : ''), 'success');
  closeModal('editStudentModal');
  renderAdminStudents(); renderAdminStats();
}

function deleteStudent(id) {
  if (!confirm('Remove this student? All their records will remain in the system.')) return;
  const s = HMS.findById('users', id);
  if (s?.roomId) {
    const room = HMS.findById('rooms', s.roomId);
    if (room) HMS.update('rooms', s.roomId, { occupied: Math.max(0, room.occupied-1), status: room.occupied-1 <= 0 ? 'available' : room.occupied-1 < room.beds ? 'partial' : 'occupied' });
  }
  HMS.remove('users', id);
  notify('Student removed', 'success');
  renderAdminStudents(); renderAdminStats(); renderAdminRooms();
}

// respondRequest / resolveRequest kept for backward compatibility if called elsewhere
function respondRequest(id, status) {
  openAdminRespond(id);
}
function resolveRequest(id) {
  openAdminRespond(id);
}

function postNotice(e) {
  e.preventDefault();
  HMS.add('notices', {
    id: HMS.genId(),
    title: document.getElementById('noticeTitle').value,
    body: document.getElementById('noticeBody').value,
    type: document.getElementById('noticeType').value,
    date: today(), author: 'Admin'
  });
  notify('Notice posted successfully', 'success');
  closeModal('noticeModal');
  e.target.reset();
  renderNoticesAdmin();
}

function deleteNotice(id) {
  HMS.remove('notices', id);
  notify('Notice deleted', 'success');
  renderNoticesAdmin();
}

function populateRoomDropdowns() {
  const rooms = HMS.get('rooms');
  document.querySelectorAll('.room-dropdown').forEach(sel => populateRoomDropdown(sel, rooms));
}

function populateRoomDropdown(sel, rooms) {
  if (!rooms) rooms = HMS.get('rooms');
  sel.innerHTML = '<option value="">Select Room</option>' + rooms.map(r => {
    const free = r.beds - r.occupied;
    const full = free <= 0 || r.status === 'occupied';
    const label = full
      ? `${r.number} (${r.type}) – FULL – ${fmtCurrency(r.rent)}/mo`
      : `${r.number} (${r.type}) – ${free} bed${free > 1 ? 's' : ''} free – ${fmtCurrency(r.rent)}/mo`;
    return `<option value="${r.id}" ${full ? 'disabled style="color:var(--text-muted,#aaa)"' : ''}>${label}</option>`;
  }).join('');
}

// ===== CHARTS =====
const chartInstances = { revenue: null, occupancy: null, payStatus: null };

function destroyCharts() {
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
      chartInstances[key] = null;
    }
  });
}

function initCharts() {
  if (typeof Chart === 'undefined') return;
  destroyCharts();
  
  const payments = HMS.get('payments').filter(p => p.status === 'paid');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const revData = months.map((_, i) => {
    const m = String(i+1).padStart(2,'0');
    return payments.filter(p => p.date?.includes(`-${m}-`) || p.date?.includes(`-${m}-2025`)).reduce((s,p) => s+p.amount, 0);
  });

  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    chartInstances.revenue = new Chart(revenueCtx, {
      type:'line',
      data:{ labels:months, datasets:[{ label:'Revenue (₹)', data:revData, borderColor:'#4338ca', backgroundColor:'rgba(67,56,202,0.08)', tension:0.4, fill:true, pointBackgroundColor:'#4338ca', pointRadius:4 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true, grid:{color:'#f1f5f9'}, ticks:{callback:v=>'₹'+Number(v).toLocaleString('en-IN')} }, x:{ grid:{display:false} } } }
    });
  }

  const rooms = HMS.get('rooms');
  const occCtx = document.getElementById('occupancyChart');
  if (occCtx) {
    const occ = rooms.filter(r=>r.status==='occupied').length;
    const part = rooms.filter(r=>r.status==='partial').length;
    const avail = rooms.filter(r=>r.status==='available').length;
    chartInstances.occupancy = new Chart(occCtx, {
      type:'doughnut',
      data:{ labels:['Occupied','Partial','Available'], datasets:[{ data:[occ,part,avail], backgroundColor:['#ef4444','#f59e0b','#10b981'], borderWidth:0, hoverOffset:4 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom'} }, cutout:'65%' }
    });
  }

  const payStatusCtx = document.getElementById('payStatusChart');
  if (payStatusCtx) {
    const allPay = HMS.get('payments');
    const paid = allPay.filter(p=>p.status==='paid').length;
    const pend = allPay.filter(p=>p.status==='pending').length;
    chartInstances.payStatus = new Chart(payStatusCtx, {
      type:'bar',
      data:{ labels:['Paid','Pending'], datasets:[{ data:[paid,pend], backgroundColor:['#10b981','#f59e0b'], borderRadius:6, borderWidth:0 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ y:{beginAtZero:true,grid:{color:'#f1f5f9'}}, x:{grid:{display:false}} } }
    });
  }
}

// ===== RECEPTIONIST DASHBOARD =====
async function initReceptionistDashboard() {
  const session = requireAuth('receptionist');
  if (!session) return;
  initTopbar(session);
  showPage('dashboard');
  await HMS.syncFromDB();
  reconcileRooms();
  renderReceptionistStats(); renderStudentsList(); renderRoomsList();
  renderVisitorsList(); renderAttendanceLog(); populateStudentDropdowns();
  // Render dashboard widgets defined in inline script (available after DOMContentLoaded)
  setTimeout(() => {
    if (typeof renderOutpassList === 'function') renderOutpassList();
    if (typeof renderRecRequests === 'function') renderRecRequests();
    if (typeof renderRecPayments === 'function') renderRecPayments();
    if (typeof renderRecNotices === 'function') renderRecNotices();
  }, 0);
}

function renderReceptionistStats() {
  const students = HMS.where('users', u => u.role === 'student');
  const attendance = HMS.where('attendance', a => a.date === today());
  const present = attendance.filter(a => a.status === 'present').length;
  const visitors = HMS.where('visitors', v => v.status === 'active');
  const pendingReqs = HMS.where('requests', r => r.status === 'pending').length;
  const activeOutpasses = (HMS.get('outpasses') || []).filter(op => op.status === 'active').length;

  set('recStatStudents', students.length);
  set('recStatPresent', present);
  set('recStatOut', students.length - present);
  set('recStatVisitors', visitors.length);
  set('recStatPendingReqs', pendingReqs);
  set('recStatOutpass', activeOutpasses);

  // Dashboard today's attendance widget
  const tbody = document.getElementById('attendanceBody');
  if (tbody) {
    const records = [...attendance].sort((a,b) => (b.checkIn||'').localeCompare(a.checkIn||''));
    tbody.innerHTML = records.length ? records.slice(0,8).map(a => {
      const s = HMS.findById('users', a.studentId);
      const room = s?.roomId ? HMS.findById('rooms', s.roomId) : null;
      const statusCls = a.status==='present'?'badge-success':a.status==='out-pass'?'badge-warning':a.status==='out'?'badge-secondary':'badge-secondary';
      return `<tr>
        <td><div class="td-name"><div class="avatar sm" style="background:${avatarColor(s?.name||'?')}">${avatarLetter(s?.name||'?')}</div><div><div class="fw-600" style="font-size:13px">${s?.name||'Unknown'}</div><div class="td-sub">${s?.studentId||''}</div></div></div></td>
        <td style="font-size:13px">${room?.number||'—'}</td>
        <td style="font-size:12px">${a.checkIn||'—'}</td>
        <td style="font-size:12px;color:${a.checkOut?'var(--danger)':'var(--text-3)'}">${a.checkOut||'—'}</td>
        <td><span class="badge ${statusCls}">${a.status}</span></td>
      </tr>`;
    }).join('') : '<tr><td colspan="5" class="text-center text-muted" style="padding:16px">No attendance records today</td></tr>';
  }
}

function renderStudentsList() {
  let students = HMS.where('users', u => u.role === 'student');
  // Apply sort
  const { col, dir } = recSortState.students;
  students = [...students].sort((a, b) => {
    let va = '', vb = '';
    if (col === 'id') { va = a.studentId || ''; vb = b.studentId || ''; }
    else if (col === 'room') {
      va = a.roomId ? (HMS.findById('rooms', a.roomId)?.number || '') : '';
      vb = b.roomId ? (HMS.findById('rooms', b.roomId)?.number || '') : '';
    } else { va = a.name || ''; vb = b.name || ''; }
    return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });
  const tbody = document.getElementById('studentsListBody');
  if (!tbody) return;
  tbody.innerHTML = students.map(s => {
    const room = s.roomId ? HMS.findById('rooms', s.roomId) : null;
    const att = HMS.where('attendance', a => a.studentId === s.id && a.date === today())[0];
    const present = att?.status === 'present';
    const pendingPay = HMS.where('payments', p => p.studentId === s.id && p.status === 'pending').length;
    const attStatus = att?.status || 'absent';
    const attCls = present ? 'badge-success' : attStatus === 'out-pass' ? 'badge-warning' : 'badge-secondary';
    return `<tr>
      <td style="font-size:11px;color:var(--text-2)">${s.studentId||s.id||'-'}</td>
      <td><div class="td-name"><div class="avatar sm" style="background:${avatarColor(s.name)}">${avatarLetter(s.name)}</div><div class="fw-600">${s.name}</div></div></td>
      <td>${room?room.number:'—'}</td>
      <td>${s.phone||'-'}</td>
      <td style="font-size:12px;color:var(--text-2)">${s.course||'-'}</td>
      <td>${pendingPay > 0 ? `<span class="badge badge-danger">${pendingPay} pending</span>` : '<span class="badge badge-success">Clear</span>'}</td>
      <td><span class="badge ${attCls}">${present?'Present':attStatus}</span></td>
      <td class="btn-group">
        <button class="btn btn-sm btn-primary" onclick="viewRecStudent('${s.id}')">View</button>
        ${!present?`<button class="btn btn-sm btn-success" onclick="quickCheckIn('${s.id}')">In</button>`:`<button class="btn btn-sm btn-secondary" onclick="markOut('${s.id}')">Out</button>`}
      </td></tr>`;
  }).join('');
}

function renderRoomsList() {
  const statusFilter = document.getElementById('recRoomStatusFilter')?.value || '';
  let rooms = HMS.get('rooms');
  if (statusFilter) rooms = rooms.filter(r => r.status === statusFilter);
  const container = document.getElementById('recRoomsContainer');
  if (!container) return;
  if (!rooms.length) {
    container.innerHTML = '<div class="text-center text-muted" style="padding:40px;grid-column:1/-1">No rooms found</div>';
    return;
  }
  container.innerHTML = rooms.map(r => {
    // Calculate actual occupancy from students
    const occupants = HMS.where('users', u => u.role === 'student' && u.roomId === r.id);
    const actualOccupied = occupants.length;
    const pct = r.beds > 0 ? Math.round((actualOccupied / r.beds) * 100) : 0;
    const color = pct === 100 ? 'red' : pct > 50 ? 'orange' : 'green';
    const statusBadge = {occupied:'badge-danger',partial:'badge-warning',available:'badge-success',maintenance:'badge-secondary'}[r.status]||'badge-secondary';
    const amenities = (r.amenities||[]).map(a => `<span class="amenity-tag">${a}</span>`).join('');
    return `<div class="room-card">
      <div class="room-card-header">
        <div class="room-card-top">
          <div><div class="room-card-number">${r.number}</div><div class="room-card-type">${r.type} · ${r.floor}</div></div>
          <div class="text-right"><div class="room-card-rent">${fmtCurrency(r.rent||0)}</div><div class="room-card-rent-label">/month</div></div>
        </div>
      </div>
      <div class="room-card-body">
        <div class="room-info-row"><span>Beds</span><strong>${r.beds}</strong></div>
        <div class="room-info-row"><span>Occupied</span><strong>${actualOccupied}/${r.beds}</strong></div>
        <div class="room-info-row"><span>Bathroom</span><strong>${r.bathrooms||'—'}</strong></div>
        <div class="room-info-row"><span>Status</span><span class="badge ${statusBadge}">${r.status}</span></div>
        <div class="room-occupancy">
          <div class="occupancy-text"><span>Occupancy</span><span>${pct}%</span></div>
          <div class="progress-bar"><div class="progress-fill ${color}" style="width:${pct}%"></div></div>
        </div>
        ${amenities ? `<div class="room-amenities">${amenities}</div>` : ''}
      </div>
      <div class="room-card-footer">
        <button class="btn btn-sm btn-outline" onclick="openEditRoomRec('${r.id}')">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>Edit Status
        </button>
      </div>
    </div>`;
  }).join('');
}

function filterRecRooms() {
  renderRoomsList();
}

function openEditRoomRec(id) {
  const r = HMS.findById('rooms', id);
  if (!r) return;
  setInput('editRoomId', r.id);
  setInput('editRoomNumber', r.number);
  setInput('editRoomFloor', r.floor);
  setInput('editRoomType', r.type);
  setInput('editRoomBeds', r.beds);
  setInput('editRoomRent', r.rent);
  setInput('editRoomStatus', r.status);
  // Show current occupants
  const occupants = HMS.where('users', u => u.role === 'student' && u.roomId === id);
  const container = document.getElementById('editRoomOccupants');
  if (container) {
    container.innerHTML = occupants.length
      ? `<div class="form-label-d" style="margin-bottom:8px">Current Occupants (${occupants.length}/${r.beds})</div>` +
        occupants.map(s => {
          const booking = HMS.where('bookings', b => b.studentId === s.id && b.status === 'active')[0];
          return `<div class="occupant-row"><div class="td-name"><div class="avatar sm" style="background:${avatarColor(s.name)}">${avatarLetter(s.name)}</div><div><div class="fw-600">${s.name} <span class="text-muted text-sm">(${s.studentId||'-'})</span></div><div class="td-sub">Since: ${booking ? fmtDate(booking.checkIn) : '-'}</div></div></div></div>`;
        }).join('')
      : '<div class="text-muted text-sm" style="padding:8px 0">No students assigned to this room.</div>';
  }
  openModal('editRoomModal');
}

function saveRoomRec(e) {
  e.preventDefault();
  const id = document.getElementById('editRoomId').value;
  HMS.update('rooms', id, { status: document.getElementById('editRoomStatus').value });
  notify('Room status updated', 'success');
  closeModal('editRoomModal');
  renderRoomsList();
}

function renderVisitorsList() {
  let visitors = HMS.get('visitors');
  // Apply date range filter if set
  const fromEl = document.getElementById('visDateFrom');
  const toEl = document.getElementById('visDateTo');
  const from = fromEl ? fromEl.value : '';
  const to = toEl ? toEl.value : '';
  if (from || to) {
    visitors = visitors.filter(v => {
      const d = v.checkIn ? v.checkIn.slice(0, 10) : '';
      if (!d) return false;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }
  const tbody = document.getElementById('visitorsBody');
  if (!tbody) return;
  // Apply sort state
  const { col: vc, dir: vd } = recSortState.visitors;
  const visitorsArr = [...visitors].sort((a, b) => {
    if (vc === 'name') return vd === 'asc' ? (a.name||'').localeCompare(b.name||'') : (b.name||'').localeCompare(a.name||'');
    if (vc === 'student') {
      const sa = HMS.findById('users', a.studentId)?.name || '';
      const sb = HMS.findById('users', b.studentId)?.name || '';
      return vd === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
    }
    if (vc === 'status') return vd === 'asc' ? (a.status||'').localeCompare(b.status||'') : (b.status||'').localeCompare(a.status||'');
    // default: date desc — direct string comparison (locale-safe)
    const ca = a.checkIn || '', cb = b.checkIn || '';
    return vd === 'asc' ? (ca < cb ? -1 : ca > cb ? 1 : 0) : (cb < ca ? -1 : cb > ca ? 1 : 0);
  });
  tbody.innerHTML = visitorsArr.length ? visitorsArr.map(v => {
    const student = HMS.findById('users', v.studentId);
    const isActive = v.status === 'active';
    return `<tr>
      <td><div class="td-name"><div class="avatar sm" style="background:#f59e0b;color:#fff">${(v.name||'?')[0].toUpperCase()}</div><div><div class="fw-600">${v.name}</div><div class="td-sub">${v.phone||''}</div></div></div></td>
      <td>${student?.name||'-'}</td>
      <td style="font-size:12px;color:var(--text-2)">${v.relation||'—'}</td>
      <td>${v.purpose||'-'}</td>
      <td style="font-size:12px">${v.checkIn||'—'}</td>
      <td style="font-size:12px">${v.checkOut||'—'}</td>
      <td><span class="badge ${isActive?'badge-success':'badge-secondary'}">${isActive?'Active':'Checked-Out'}</span></td>
      <td>${isActive?`<button class="btn btn-sm btn-warning" onclick="checkoutVisitor('${v.id}')">Check Out</button>`:'—'}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="8" class="text-center text-muted" style="padding:24px">No visitors found</td></tr>';
}

function renderAttendanceLog() {
  // Update the full check-in/out log table (on the check-in/out page)
  let attendance = HMS.where('attendance', a => a.date === today());
  const tbody = document.getElementById('fullAttendanceBody');
  if (!tbody) return;
  if (!attendance.length) { tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:24px">No attendance records for today</td></tr>'; return; }
  // Apply sort
  const { col: ac, dir: ad } = recSortState.attendance;
  attendance = [...attendance].sort((a, b) => {
    if (ac === 'room') {
      const ra = HMS.findById('users', a.studentId)?.roomId;
      const rb = HMS.findById('users', b.studentId)?.roomId;
      const rna = ra ? (HMS.findById('rooms', ra)?.number || '') : '';
      const rnb = rb ? (HMS.findById('rooms', rb)?.number || '') : '';
      return ad === 'asc' ? rna.localeCompare(rnb) : rnb.localeCompare(rna);
    }
    if (ac === 'checkIn') { const ca = a.checkIn||'', cb = b.checkIn||''; return ad === 'asc' ? (ca < cb ? -1 : ca > cb ? 1 : 0) : (cb < ca ? -1 : cb > ca ? 1 : 0); }
    if (ac === 'status') return ad === 'asc' ? (a.status||'').localeCompare(b.status||'') : (b.status||'').localeCompare(a.status||'');
    // default: name
    const na = HMS.findById('users', a.studentId)?.name || '';
    const nb = HMS.findById('users', b.studentId)?.name || '';
    return ad === 'asc' ? na.localeCompare(nb) : nb.localeCompare(na);
  });
  tbody.innerHTML = attendance.map(a => {
    const student = HMS.findById('users', a.studentId);
    const room = student?.roomId ? HMS.findById('rooms', student.roomId) : null;
    const cls = a.status==='present'?'badge-success':a.status==='out-pass'?'badge-warning':'badge-secondary';
    return `<tr>
      <td style="font-size:12px;color:var(--text-2)">${student?.studentId||'-'}</td>
      <td><div class="fw-600">${student?.name||'-'}</div></td>
      <td>${room?.number||'-'}</td>
      <td style="font-size:12px">${a.checkIn||'—'}</td>
      <td style="font-size:12px">${a.checkOut||'—'}</td>
      <td><span class="badge ${cls}">${a.status}</span></td>
      <td>${a.status !== 'present' ? `<button class="btn btn-sm btn-success" onclick="quickCheckIn('${a.studentId}')">Check In</button>` : `<button class="btn btn-sm btn-secondary" onclick="markOut('${a.studentId}')">Check Out</button>`}</td>
    </tr>`;
  }).join('');
}

function quickCheckIn(studentId) {
  const time = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  const existing = HMS.where('attendance', a => a.studentId === studentId && a.date === today());
  if (existing.length) {
    HMS.update('attendance', existing[0].id, { status:'present', checkIn: time });
  } else {
    HMS.add('attendance', { id:HMS.genId(), studentId, date:today(), status:'present', checkIn:time, checkOut:null });
  }
  const student = HMS.findById('users', studentId);
  notify(`${student?.name} checked in at ${time}`, 'success');
  renderStudentsList(); renderReceptionistStats(); renderAttendanceLog();
}

function markOut(studentId) {
  const time = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  const existing = HMS.where('attendance', a => a.studentId === studentId && a.date === today());
  if (existing.length) HMS.update('attendance', existing[0].id, { status:'out', checkOut: time });
  const student = HMS.findById('users', studentId);
  notify(`${student?.name} marked as out at ${time}`, 'info');
  renderStudentsList(); renderReceptionistStats();
}

function handleCheckIn(e) {
  e.preventDefault();
  const studentId = document.getElementById('ciStudentId').value;
  const student = HMS.where('users', u => (u.studentId === studentId || u.id === studentId) && u.role === 'student')[0];
  if (!student) { notify('Student not found. Check the ID.', 'error'); return; }
  quickCheckIn(student.id);
  closeModal('checkInModal');
  e.target.reset();
}

function handleCheckOut(e) {
  e.preventDefault();
  const studentId = document.getElementById('coStudentId').value;
  const reason = document.getElementById('coReason').value;
  const student = HMS.where('users', u => (u.studentId === studentId || u.id === studentId) && u.role === 'student')[0];
  if (!student) { notify('Student not found. Check the ID.', 'error'); return; }
  const time = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  const existing = HMS.where('attendance', a => a.studentId === student.id && a.date === today());
  const status = reason === 'on-pass' ? 'out-pass' : 'out';
  if (existing.length) HMS.update('attendance', existing[0].id, { status, checkOut: time });
  else HMS.add('attendance', { id:HMS.genId(), studentId:student.id, date:today(), status, checkIn:null, checkOut:time });
  notify(`${student.name} checked out (${reason}) at ${time}`, 'info');
  closeModal('checkOutModal');
  e.target.reset();
  renderStudentsList(); renderReceptionistStats(); renderAttendanceLog();
}

function registerVisitor(e) {
  e.preventDefault();
  const studentId = document.getElementById('visitorForStudent').value;
  const student = HMS.findById('users', studentId);
  const checkInTime = new Date().toLocaleString('en-IN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  HMS.add('visitors', {
    id: HMS.genId(),
    name: document.getElementById('visitorName').value,
    studentId, phone: document.getElementById('visitorPhone').value,
    relation: (document.getElementById('visitorRelation') || {}).value || '',
    idProof: (document.getElementById('visitorIdProof') || {}).value || '',
    purpose: document.getElementById('visitorPurpose').value,
    checkIn: checkInTime, checkOut: null, status: 'active'
  });
  notify(`Visitor registered for ${student?.name}`, 'success');
  closeModal('visitorModal');
  e.target.reset();
  renderVisitorsList(); renderReceptionistStats();
}

function checkoutVisitor(id) {
  const time = new Date().toLocaleString('en-IN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  HMS.update('visitors', id, { status:'checked-out', checkOut: time });
  notify('Visitor checked out', 'success');
  renderVisitorsList(); renderReceptionistStats();
}

function populateStudentDropdowns() {
  const students = HMS.where('users', u => u.role === 'student');
  document.querySelectorAll('.student-dropdown').forEach(sel => {
    sel.innerHTML = '<option value="">Select Student</option>' + students.map(s =>
      `<option value="${s.id}">${s.name} (${s.studentId||s.id})</option>`
    ).join('');
  });
}

// ===== HELPERS =====
function set(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function setInput(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }

// Password toggle for login
document.addEventListener('DOMContentLoaded', () => {
  HMS.init();
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
});
