/* ==========================================================================
   RoadReady RV & Motorhome Service Center - Owner Dashboard Control Center
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardNavigation();
  initDashboardCharts();
  initStatsCounters();
  initProfileForm();
  initInteractiveActions();
  
  // Re-initialize charts on theme toggle click
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      setTimeout(() => {
        initDashboardCharts();
      }, 50);
    });
  }
});

/* ==========================================================================
   Single-Page Section Switcher Navigation
   ========================================================================== */
function initDashboardNavigation() {
  const sidebarLinks = document.querySelectorAll('.dashboard-sidebar-link');
  const sections = document.querySelectorAll('.dashboard-section');
  const sectionTitle = document.getElementById('dashboardSectionTitle');
  
  if (sidebarLinks.length === 0) return;
  
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetSectionId = link.getAttribute('data-section');
      const targetSection = document.getElementById(targetSectionId);
      
      if (!targetSection) return;
      
      // Update active state in sidebar (desktop and mobile)
      sidebarLinks.forEach(l => {
        if (l.getAttribute('data-section') === targetSectionId) {
          l.classList.add('active');
        } else {
          l.classList.remove('active');
        }
      });
      
      // Switch sections
      sections.forEach(s => s.classList.add('d-none'));
      targetSection.classList.remove('d-none');
      
      // Update header section title
      if (sectionTitle) {
        const titleSpan = link.querySelector('span');
        if (titleSpan) {
          sectionTitle.textContent = titleSpan.textContent;
        }
      }
      
      // Close mobile offcanvas if it's active
      const offcanvasElement = document.getElementById('dashboardSidebarOffcanvas');
      if (offcanvasElement) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      }
      
      // Re-trigger scroll reveal for elements in the current section
      const activeReveals = targetSection.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      activeReveals.forEach(el => el.classList.add('active'));
    });
  });
}

/* ==========================================================================
   Chart.js Configurations (RV Diagnostics Radar & Mileage Trends)
   ========================================================================== */
let progressChartInstance = null;
let sessionsChartInstance = null;

function initDashboardCharts() {
  const isDark = document.body.classList.contains('dark-mode');
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 39, 68, 0.08)';
  const labelColor = isDark ? '#F8FAFC' : '#0F172A';
  const accentColor = isDark ? '#F59E0B' : '#E88024';
  const blueColor = isDark ? '#38BDF8' : '#0284C7';
  
  // 1. RV System Health Diagnostics Radar Chart
  const progressChartEl = document.getElementById('progressChart');
  if (progressChartEl && typeof Chart !== 'undefined') {
    if (progressChartInstance) {
      progressChartInstance.destroy();
    }
    
    progressChartInstance = new Chart(progressChartEl, {
      type: 'radar',
      data: {
        labels: [
          'Engine & Powertrain',
          'Brakes & Axles',
          'RV Appliances & HVAC',
          'Roof & Seal Integrity',
          '12V / Solar Electrical',
          'Plumbing & Water Tanks'
        ],
        datasets: [{
          label: 'Current Vehicle Health',
          data: [94, 88, 92, 85, 96, 90],
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.22)' : 'rgba(232, 128, 36, 0.2)',
          borderColor: accentColor,
          borderWidth: 2.5,
          pointBackgroundColor: accentColor,
          pointBorderColor: isDark ? '#0B131E' : '#0F2744',
          pointHoverBackgroundColor: isDark ? '#0B131E' : '#0F2744',
          pointHoverBorderColor: accentColor
        }, {
          label: 'Road-Ready Benchmark',
          data: [85, 85, 85, 85, 85, 85],
          backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)',
          borderColor: blueColor,
          borderWidth: 1.5,
          borderDash: [5, 5],
          pointBackgroundColor: blueColor,
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: blueColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: labelColor,
              font: {
                family: 'Outfit',
                size: 13,
                weight: '500'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${context.raw}% Condition`
            }
          }
        },
        scales: {
          r: {
            grid: {
              color: gridColor
            },
            angleLines: {
              color: gridColor
            },
            pointLabels: {
              color: labelColor,
              font: {
                family: 'Outfit',
                size: 11,
                weight: '500'
              }
            },
            ticks: {
              display: false,
              maxTicksLimit: 5
            },
            suggestedMin: 50,
            suggestedMax: 100
          }
        }
      }
    });
  }
  
  // 2. Annual Mileage & Service Frequency Line Chart
  const sessionsChartEl = document.getElementById('sessionsChart');
  if (sessionsChartEl && typeof Chart !== 'undefined') {
    if (sessionsChartInstance) {
      sessionsChartInstance.destroy();
    }
    
    sessionsChartInstance = new Chart(sessionsChartEl, {
      type: 'line',
      data: {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        datasets: [{
          label: 'Highway Miles Logged',
          data: [1200, 3100, 5800, 9400, 13200, 16800],
          borderColor: accentColor,
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(232, 128, 36, 0.08)',
          borderWidth: 3,
          tension: 0.35,
          fill: true,
          yAxisID: 'y'
        }, {
          label: 'System Diagnostic Score (%)',
          data: [98, 97, 95, 92, 95, 96],
          borderColor: blueColor,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.3,
          yAxisID: 'y1'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: labelColor,
              font: {
                family: 'Outfit',
                size: 12
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: isDark ? '#94A3B8' : '#475569',
              font: { family: 'Outfit' }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: gridColor },
            ticks: {
              color: accentColor,
              font: { family: 'Outfit' }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            suggestedMin: 80,
            suggestedMax: 100,
            ticks: {
              color: blueColor,
              font: { family: 'Outfit' }
            }
          }
        }
      }
    });
  }
}

/* ==========================================================================
   Animated Numeric Counter Statistics
   ========================================================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll('.dashboard-stat-counter');
  if (counters.length === 0) return;
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1200; // 1.2 seconds
    const start = 0;
    const increment = target / (duration / 16); // ~60fps
    
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 16);
  });
}

/* ==========================================================================
   Dashboard Interactive Actions (Approve Estimates, Vehicle Selector, etc.)
   ========================================================================== */
function initInteractiveActions() {
  // 1. Vehicle Selector in Maintenance History
  const vehicleFilter = document.getElementById('vehicleSelectFilter');
  if (vehicleFilter) {
    vehicleFilter.addEventListener('change', (e) => {
      const selected = e.target.value;
      const historyRows = document.querySelectorAll('.maintenance-history-row');
      
      historyRows.forEach(row => {
        const rowVehicle = row.getAttribute('data-vehicle');
        if (selected === 'all' || rowVehicle === selected) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
      
      showToastNotice(`Filtered records for: ${e.target.options[e.target.selectedIndex].text}`);
    });
  }
  
  // 2. Estimate Approval Buttons
  document.querySelectorAll('.btn-approve-estimate').forEach(btn => {
    btn.addEventListener('click', function() {
      const estimateId = this.getAttribute('data-estimate-id');
      const badge = document.getElementById(`badge-est-${estimateId}`);
      if (badge) {
        badge.className = 'badge bg-success';
        badge.textContent = 'Approved by Owner';
      }
      this.disabled = true;
      this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-check-lg me-1" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/></svg> Approved';
      this.classList.remove('btn-premium-primary');
      this.classList.add('btn-success');
      showToastNotice(`Estimate #${estimateId} approved! Service bay schedule dispatched.`);
    });
  });

  // 3. Quick Bay Booking Modal / Form Submit
  const quickBookingForm = document.getElementById('dashboardQuickBookingForm');
  if (quickBookingForm) {
    quickBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const serviceType = document.getElementById('quickServiceType')?.value || 'Maintenance';
      const dateVal = document.getElementById('quickServiceDate')?.value || 'Upcoming Date';
      showToastNotice(`Service Appointment Confirmed for ${dateVal}! Bay #3 reserved.`);
      quickBookingForm.reset();
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('newAppointmentModal'));
      if (modal) modal.hide();
    });
  }
}

/* Helper Toast Notification */
function showToastNotice(message) {
  const existing = document.querySelector('.toast-container');
  if (existing) existing.remove();
  
  const toastHtml = `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1080;">
      <div class="toast show align-items-center text-white bg-primary border-0 rounded-4 glass-card p-2" role="alert">
        <div class="d-flex align-items-center">
          <div class="toast-body d-flex align-items-center gap-2">
            <span class="d-inline-flex" style="color: var(--accent);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16"><path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.552-.448-1-1-1a.998.998 0 0 0-.707.293L11.65 4.936l-2.64-2.64A1 1 0 0 1 8.717 1.587V1.52a1 1 0 0 0-.419-.816L5.217 0H1zm1.5 1.5.834.834a1 1 0 0 0 .708.293h.334l2.125 2.125-.707.707-2.125-2.125v-.334a1 1 0 0 0-.293-.708L2.5 1.5z"/></svg></span>
            <strong>${message}</strong>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', toastHtml);
  
  setTimeout(() => {
    const t = document.querySelector('.toast-container');
    if (t) t.remove();
  }, 4000);
}

/* ==========================================================================
   Dashboard Profile Settings Submission Updates
   ========================================================================== */
function initProfileForm() {
  const profileForm = document.getElementById('profileSettingsForm');
  if (!profileForm) return;
  
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = profileForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
    
    setTimeout(() => {
      showToastNotice('RV Profile & Maintenance notifications updated successfully!');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1000);
  });
}
