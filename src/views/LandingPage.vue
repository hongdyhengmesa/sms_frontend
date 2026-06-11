<template>
  <div class="landing">
    <nav class="lp-nav" :class="{ scrolled: scrolled }">
      <div class="lp-container lp-nav-inner">
        <!-- Logo -->
        <router-link to="/" class="lp-logo">
          <div class="lp-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <span class="lp-logo-text">Edu<span style="color: var(--indigo);">Core</span></span>
        </router-link>

        <!-- Desktop links -->
        <div class="lp-nav-links">
          <a href="#features">Features</a>
          <a href="#attendance">Attendance</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#faq">FAQ</a>
        </div>

        <div class="lp-nav-cta">
          <router-link :to="{name:'login'}" class="lp-btn-ghost">Log In</router-link>
          <a href="#pricing" class="lp-btn-primary">Get Started Free</a>
        </div>

        <!-- Mobile menu toggle -->
        <button class="lp-menu-toggle" @click="mobileMenu = !mobileMenu" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      <!-- Mobile drawer -->
      <transition name="slide-down">
        <div v-if="mobileMenu" class="lp-mobile-menu">
          <a href="#features" @click="mobileMenu=false">Features</a>
          <a href="#attendance" @click="mobileMenu=false">Attendance</a>
          <a href="#how-it-works" @click="mobileMenu=false">How It Works</a>
          <a href="#pricing" @click="mobileMenu=false">Pricing</a>
          <a href="#testimonials" @click="mobileMenu=false">Testimonials</a>
          <a href="#faq" @click="mobileMenu=false">FAQ</a>
          <router-link :to="{name:'login'}" class="lp-mobile-login">Log In to Dashboard →</router-link>
        </div>
      </transition>
    </nav>

    <!-- ═══════════════════════════════════════════════════
         HERO SECTION
    ════════════════════════════════════════════════════ -->
    <section class="lp-hero">
      <div class="lp-hero-grid" aria-hidden="true"></div>
      <div class="lp-blob lp-blob-1" aria-hidden="true"></div>
      <div class="lp-blob lp-blob-2" aria-hidden="true"></div>

      <div class="lp-container lp-hero-content">
        <div class="lp-hero-badge animate-fade-up">
          <span class="lp-badge-dot"></span>
          🎓 New — Attendance & Grade Management System
        </div>

        <h1 class="lp-hero-title animate-fade-up animate-delay-1">
          Modern School<br />
          <span class="lp-gradient-text">Management Platform</span>
        </h1>

        <p class="lp-hero-sub animate-fade-up animate-delay-2">
          Complete solution for attendance tracking, grade management, report cards, 
          and student performance analytics. Designed for modern schools.
        </p>

        <div class="lp-hero-actions animate-fade-up animate-delay-3">
          <a href="#pricing" class="lp-btn-primary lp-btn-lg">
            Start Free Trial
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#how-it-works" class="lp-btn-outline lp-btn-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            Watch Demo
          </a>
        </div>

        <div class="lp-hero-proof animate-fade-up animate-delay-4">
          <div class="lp-proof-avatars">
            <img v-for="(a, i) in avatars" :key="i" :src="a" :style="{ zIndex: avatars.length - i }" alt="User avatar" />
          </div>
          <p class="lp-proof-text"><strong>2,400+</strong> schools use EduCore worldwide</p>
        </div>
      </div>

      <!-- Hero dashboard mockup - Responsive -->
      <div class="lp-container lp-hero-mockup-wrap">
        <div class="lp-mockup-frame animate-scale-up">
          <div class="lp-mockup-bar">
            <span></span><span></span><span></span>
            <div class="lp-mockup-url">educore.app/attendance</div>
          </div>
          <div class="lp-mockup-body">
            <div class="lp-attendance-preview">
              <div class="lp-preview-header">
                <div class="lp-preview-title">
                  📋 Attendance Management - 7A
                </div>
                <div class="lp-preview-date">Today, 9:00 AM</div>
              </div>
              <div class="lp-preview-stats">
                <div class="lp-preview-stat"><span>24</span> Present</div>
                <div class="lp-preview-stat"><span>2</span> Late</div>
                <div class="lp-preview-stat"><span>3</span> Absent</div>
                <div class="lp-preview-stat"><span>92%</span> Rate</div>
              </div>
              <div class="lp-preview-table">
                <div class="lp-table-row" v-for="i in 4" :key="i">
                  <div class="lp-table-cell name">{{ ['Alice Chen', 'James Wilson', 'Sofia Rodriguez', 'Marcus Lee'][i-1] }}</div>
                  <div class="lp-table-cell status" :class="{ present: i !== 3, late: i === 3 }">
                    {{ i === 3 ? 'Late' : 'Present' }}
                  </div>
                  <div class="lp-table-cell time">{{ i === 3 ? '09:15 AM' : '08:45 AM' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         STATS BAND
    ════════════════════════════════════════════════════ -->
    <section class="lp-stats-band" id="stats">
      <div class="lp-container lp-stats-grid">
        <div v-for="s in stats" :key="s.label" class="lp-stat-item">
          <span class="lp-stat-number">{{ s.number }}</span>
          <span class="lp-stat-desc">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FEATURES SECTION
    ════════════════════════════════════════════════════ -->
    <section class="lp-section" id="features">
      <div class="lp-container">
        <div class="lp-section-header">
          <div class="lp-pill">Features</div>
          <h2 class="lp-section-title">Everything your school needs,<br />in one platform</h2>
          <p class="lp-section-sub">From attendance tracking to grade management — we've got you covered.</p>
        </div>

        <div class="lp-features-grid">
          <div v-for="(f, idx) in features" :key="f.title" class="lp-feature-card" :style="{ animationDelay: `${idx * 0.1}s` }">
            <div class="lp-feature-icon" :style="{ '--bg': f.bg, '--color': f.color }">
              <span v-html="f.icon"></span>
            </div>
            <h3 class="lp-feature-title">{{ f.title }}</h3>
            <p class="lp-feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         ATTENDANCE SECTION
    ════════════════════════════════════════════════════ -->
    <section class="lp-section lp-section-alt" id="attendance">
      <div class="lp-container">
        <div class="lp-section-header">
          <div class="lp-pill">Smart Attendance</div>
          <h2 class="lp-section-title">QR Code & Self Check-in System</h2>
          <p class="lp-section-sub">Students can check in using QR codes or web forms — no more manual roll calls.</p>
        </div>

        <div class="lp-attendance-showcase">
          <div class="lp-showcase-left">
            <div class="lp-showcase-card">
              <div class="lp-qr-mock">
                <div class="lp-qr-box"></div>
                <p class="text-sm text-gray-500 mt-2">Class 7A QR Code</p>
              </div>
              <div class="lp-checkin-form-mock">
                <div class="lp-mock-input">Student Code: STU2024001</div>
                <div class="lp-mock-input">Full Name: Alice Chen</div>
                <div class="lp-mock-btn">Check In →</div>
              </div>
            </div>
          </div>
          <div class="lp-showcase-right">
            <h3 class="text-xl md:text-2xl font-bold mb-3 md:mb-5">Instant attendance recording</h3>
            <ul>
              <li>✅ Students check in with QR code or web form</li>
              <li>✅ Automatic late detection (after 9:00 AM)</li>
              <li>✅ Real-time attendance dashboard for teachers</li>
              <li>✅ Export attendance reports to Excel</li>
              <li>✅ Class-specific QR codes (7A, 7B, 7C, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         HOW IT WORKS
    ════════════════════════════════════════════════════ -->
    <section class="lp-section" id="how-it-works">
      <div class="lp-container">
        <div class="lp-section-header">
          <div class="lp-pill">How It Works</div>
          <h2 class="lp-section-title">Simple 3-step process</h2>
          <p class="lp-section-sub">Get your school up and running in minutes.</p>
        </div>

        <div class="lp-steps">
          <div v-for="(step, i) in steps" :key="step.title" class="lp-step">
            <div class="lp-step-left">
              <div class="lp-step-number">{{ String(i + 1).padStart(2, '0') }}</div>
              <div v-if="i < steps.length - 1" class="lp-step-line"></div>
            </div>
            <div class="lp-step-right">
              <div class="lp-step-icon-wrap" :style="{ '--bg': step.bg }">
                <span v-html="step.icon"></span>
              </div>
              <div>
                <h3 class="lp-step-title">{{ step.title }}</h3>
                <p class="lp-step-desc">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         PRICING SECTION
    ════════════════════════════════════════════════════ -->
    <section class="lp-section lp-section-alt" id="pricing">
      <div class="lp-container">
        <div class="lp-section-header">
          <div class="lp-pill">Pricing</div>
          <h2 class="lp-section-title">Simple, transparent pricing</h2>
          <p class="lp-section-sub">No hidden fees. Cancel any time. Every plan includes a 14-day free trial.</p>
        </div>

        <div class="lp-billing-toggle">
          <span :class="{ active: billing==='monthly' }" @click="billing='monthly'">Monthly</span>
          <div class="lp-toggle-track" @click="billing = billing==='monthly'?'yearly':'monthly'">
            <div class="lp-toggle-thumb" :class="{ right: billing==='yearly' }"></div>
          </div>
          <span :class="{ active: billing==='yearly' }" @click="billing='yearly'">
            Yearly <span class="lp-save-badge">Save 20%</span>
          </span>
        </div>

        <div class="lp-pricing-grid">
          <div v-for="plan in plans" :key="plan.name"
               class="lp-plan-card"
               :class="{ featured: plan.featured }">
            <div v-if="plan.featured" class="lp-plan-badge">Most Popular</div>
            <div class="lp-plan-name text-lg font-bold">{{ plan.name }}</div>
            <div class="lp-plan-price">
              <span class="lp-price-currency">$</span>
              <span class="lp-price-amount">{{ billing==='yearly' ? plan.yearlyPrice : plan.monthlyPrice }}</span>
              <span class="lp-price-period">/ mo</span>
            </div>
            <p class="lp-plan-desc text-sm text-gray-500 mt-2">{{ plan.desc }}</p>
            <ul class="lp-plan-features">
              <li v-for="feat in plan.features" :key="feat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {{ feat }}
              </li>
            </ul>
            <a href="#" class="lp-plan-btn" :class="{ 'lp-plan-btn-featured': plan.featured }">
              {{ plan.cta }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         TESTIMONIALS
    ════════════════════════════════════════════════════ -->
    <section class="lp-section" id="testimonials">
      <div class="lp-container">
        <div class="lp-section-header">
          <div class="lp-pill">Testimonials</div>
          <h2 class="lp-section-title">Trusted by educators worldwide</h2>
          <p class="lp-section-sub">See what school administrators and teachers are saying about EduCore.</p>
        </div>

        <div class="lp-testimonials-grid">
          <div v-for="t in testimonials" :key="t.name" class="lp-testimonial-card">
            <div class="lp-stars">
              <svg v-for="s in 5" :key="s" width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <p class="lp-testimonial-body">"{{ t.quote }}"</p>
            <div class="lp-testimonial-author">
              <div class="lp-author-avatar" :style="{ background: t.color }">{{ t.initials }}</div>
              <div>
                <p class="lp-author-name">{{ t.name }}</p>
                <p class="lp-author-role">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FAQ SECTION
    ════════════════════════════════════════════════════ -->
    <section class="lp-section lp-section-alt" id="faq">
      <div class="lp-container lp-faq-wrap">
        <div class="lp-section-header">
          <div class="lp-pill">FAQ</div>
          <h2 class="lp-section-title">Frequently asked questions</h2>
          <p class="lp-section-sub">Everything you need to know about EduCore.</p>
        </div>

        <div class="lp-faq-list">
          <div
            v-for="(item, i) in faqs"
            :key="i"
            class="lp-faq-item"
            :class="{ open: openFaq === i }"
            @click="openFaq = openFaq === i ? null : i"
          >
            <div class="lp-faq-q">
              <span>{{ item.q }}</span>
              <svg class="lp-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <transition name="faq-expand">
              <p v-if="openFaq === i" class="lp-faq-a">{{ item.a }}</p>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FINAL CTA BAND
    ════════════════════════════════════════════════════ -->
    <section class="lp-cta-band">
      <div class="lp-blob lp-blob-cta1" aria-hidden="true"></div>
      <div class="lp-blob lp-blob-cta2" aria-hidden="true"></div>
      <div class="lp-container lp-cta-content">
        <h2 class="lp-cta-title">Ready to transform your school?</h2>
        <p class="lp-cta-sub">Join 2,400+ schools already using EduCore. Start your free 14-day trial today.</p>
        <div class="lp-cta-actions">
          <a href="#pricing" class="lp-btn-white lp-btn-lg">
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <router-link :to="{name:'login'}" class="lp-btn-outline-white lp-btn-lg">Log In to Dashboard</router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FOOTER
    ════════════════════════════════════════════════════ -->
    <footer class="lp-footer">
      <div class="lp-container">
        <div class="lp-footer-top">
          <div class="lp-footer-brand">
            <div class="lp-logo" style="margin-bottom:12px;">
              <div class="lp-logo-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <span class="lp-logo-text">Edu<span style="color: var(--indigo);">Core</span></span>
            </div>
            <p class="lp-footer-tagline">Modern school management for the schools of tomorrow.</p>
            <div class="lp-footer-socials">
              <a href="#" aria-label="Twitter"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/></svg></a>
              <a href="#" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></a>
              <a href="#" aria-label="GitHub"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
            </div>
          </div>

          <div v-for="col in footerLinks" :key="col.title" class="lp-footer-col">
            <h4 class="lp-footer-col-title">{{ col.title }}</h4>
            <ul>
              <li v-for="link in col.links" :key="link"><a href="#">{{ link }}</a></li>
            </ul>
          </div>
        </div>

        <div class="lp-footer-bottom">
          <p>© {{ new Date().getFullYear() }} EduCore Inc. All rights reserved.</p>
          <div class="lp-footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Scroll state
const scrolled = ref(false)
const mobileMenu = ref(false)
const billing = ref('monthly')
const openFaq = ref(null)

function onScroll() { scrolled.value = window.scrollY > 40 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Data
const avatars = [
  'https://i.pravatar.cc/40?img=1',
  'https://i.pravatar.cc/40?img=2',
  'https://i.pravatar.cc/40?img=3',
  'https://i.pravatar.cc/40?img=4',
  'https://i.pravatar.cc/40?img=5',
]

const stats = [
  { number: '2,400+', label: 'Schools worldwide' },
  { number: '840K+', label: 'Students managed' },
  { number: '99.9%', label: 'Platform uptime' },
  { number: '4.9 / 5', label: 'Average rating' },
]

const svgIcon = (d) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${d}</svg>`

const features = [
  {
    title: 'Smart Attendance',
    desc: 'QR code and self check-in system. Auto late detection, real-time tracking, and Excel export.',
    icon: svgIcon('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
    bg: '#eff6ff', color: '#2563eb',
  },
  {
    title: 'Grade Management',
    desc: 'Record scores, auto-calculate GPA, track midterms, finals, and projects with ease.',
    icon: svgIcon('<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
    bg: '#eef2ff', color: '#4f46e5',
  },
  {
    title: 'Report Cards',
    desc: 'Generate beautiful, official-grade report cards per student per semester with one click.',
    icon: svgIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>'),
    bg: '#f0fdf4', color: '#16a34a',
  },
  {
    title: 'Class Management',
    desc: 'Manage 7A, 7B, 7C through 9B classes with student counts, schedules, and homeroom teachers.',
    icon: svgIcon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    bg: '#fdf4ff', color: '#9333ea',
  },
  {
    title: 'GPA Analytics',
    desc: 'Visualise trends, compare class performance, and benchmark against averages across semesters.',
    icon: svgIcon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
    bg: '#fff7ed', color: '#ea580c',
  },
  {
    title: 'Role-Based Access',
    desc: 'Teachers, admins, and principals each see what they need. Secure and audit-logged.',
    icon: svgIcon('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    bg: '#f8fafc', color: '#475569',
  },
]

const steps = [
  {
    title: 'Create your school',
    desc: 'Sign up, set your school name, academic year, and grading scale. Takes under two minutes.',
    icon: svgIcon('<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'),
    bg: '#eff6ff',
  },
  {
    title: 'Add your classes',
    desc: 'Set up classes (7A, 7B, 7C, 8A, etc.) and assign students and teachers.',
    icon: svgIcon('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>'),
    bg: '#eef2ff',
  },
  {
    title: 'Generate QR codes',
    desc: 'Each class gets a unique QR code. Students scan to check in — attendance is automatic.',
    icon: svgIcon('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>'),
    bg: '#f0fdf4',
  },
  {
    title: 'Track & export',
    desc: 'View real-time attendance, mark late/present/absent, and export reports to Excel.',
    icon: svgIcon('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
    bg: '#fdf4ff',
  },
]

const plans = [
  {
    name: 'Starter',
    monthlyPrice: '0',
    yearlyPrice: '0',
    desc: 'Perfect for small schools starting out.',
    features: [
      'Up to 150 students',
      '10 teacher accounts',
      '5 class sections',
      'Basic attendance tracking',
      'Manual check-in only',
      'Email support',
    ],
    cta: 'Start for Free',
    featured: false,
  },
  {
    name: 'School',
    monthlyPrice: '49',
    yearlyPrice: '39',
    desc: 'Everything a growing school needs.',
    features: [
      'Up to 1,000 students',
      'Unlimited teachers',
      'Unlimited classes',
      'QR code check-in',
      'Auto late detection',
      'Excel export',
      'GPA analytics',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'District',
    monthlyPrice: '149',
    yearlyPrice: '119',
    desc: 'Multi-school management at scale.',
    features: [
      'Unlimited students',
      'Multi-school admin dashboard',
      'District-wide analytics',
      'Custom branding',
      'API access',
      'SSO / SAML login',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
]

const testimonials = [
  {
    quote: "The QR code attendance system has saved us hours of manual roll call. Students love the self check-in feature.",
    name: 'Dr. Michelle Harper',
    role: 'Principal, Westview Academy',
    initials: 'MH',
    color: '#6366f1',
  },
  {
    quote: "Switching from spreadsheets to EduCore was the best decision. Attendance tracking is now effortless and accurate.",
    name: 'James Okoro',
    role: 'Academic Director',
    initials: 'JO',
    color: '#3b82f6',
  },
  {
    quote: "Our teachers can now focus on teaching instead of administrative tasks. The export to Excel feature is a lifesaver.",
    name: 'Priya Mehta',
    role: 'IT Coordinator',
    initials: 'PM',
    color: '#22c55e',
  },
]

const faqs = [
  {
    q: 'How does the QR code attendance work?',
    a: 'Each class gets a unique QR code. Teachers display it, students scan with their phones, enter their student ID, and attendance is automatically recorded. Late detection is automatic after 9:00 AM.',
  },
  {
    q: 'Can students check in without QR codes?',
    a: 'Yes! Students can also check in using the web form by selecting their class and entering their student code and name.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 compliant and follow FERPA guidelines.',
  },
  {
    q: 'Can I export attendance reports?',
    a: 'Absolutely. You can export attendance data to Excel format for any class and any date range.',
  },
  {
    q: 'What grading scales are supported?',
    a: 'We support 4.0 GPA scale, 10-point scales, and custom 100-point systems. Grading boundaries are fully configurable.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel your subscription anytime from Settings. Your data remains accessible for 30 days after cancellation.',
  },
]

const footerLinks = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'Status'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API Reference', 'Guides', 'Support', 'Blog'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Contact', 'Partners'],
  },
]
</script>

<style scoped>
/* ─────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────── */
.landing {
  --blue: #2563eb;
  --indigo: #4f46e5;
  --indigo-light: #eef2ff;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --white: #ffffff;
  --radius: 14px;
  --radius-sm: 10px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--gray-800);
  background: var(--white);
  overflow-x: hidden;
}

/* ─────────────────────────────────────────────────────────
   ANIMATIONS
───────────────────────────────────────────────────────── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(1.3); }
}

.animate-fade-up {
  animation: fadeUp 0.6s ease forwards;
  opacity: 0;
}

.animate-delay-1 { animation-delay: 0.1s; }
.animate-delay-2 { animation-delay: 0.2s; }
.animate-delay-3 { animation-delay: 0.3s; }
.animate-delay-4 { animation-delay: 0.4s; }

.animate-scale-up {
  animation: scaleUp 0.5s ease-out forwards;
}

/* ─────────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────────── */
.lp-container {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (min-width: 768px) {
  .lp-container {
    padding: 0 24px;
  }
}

.lp-gradient-text {
  background: linear-gradient(135deg, var(--blue), var(--indigo));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lp-pill {
  display: inline-block;
  padding: 5px 14px;
  background: var(--indigo-light);
  color: var(--indigo);
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.lp-section-header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 40px;
}

@media (min-width: 768px) {
  .lp-section-header {
    margin-bottom: 60px;
  }
}

.lp-section-title {
  font-size: clamp(24px, 5vw, 38px);
  font-weight: 800;
  color: var(--gray-900);
  line-height: 1.2;
  margin: 0 0 16px;
}

.lp-section-sub {
  font-size: 14px;
  color: var(--gray-500);
  line-height: 1.7;
  margin: 0;
}

@media (min-width: 768px) {
  .lp-section-sub {
    font-size: 16px;
  }
}

/* ─────────────────────────────────────────────────────────
   BUTTONS
───────────────────────────────────────────────────────── */
.lp-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--blue), var(--indigo));
  color: #fff;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: transform .15s, box-shadow .15s;
  box-shadow: 0 4px 14px rgba(79,70,229,.35);
  cursor: pointer;
}

.lp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,70,229,.45); }

.lp-btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-sm);
  color: var(--gray-700);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  background: var(--white);
  transition: border-color .15s, background .15s;
  cursor: pointer;
}

.lp-btn-outline:hover { border-color: var(--gray-300); background: var(--gray-50); }

.lp-btn-ghost {
  color: var(--gray-600);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background .15s;
}

@media (min-width: 768px) {
  .lp-btn-ghost {
    padding: 8px 14px;
  }
}

.lp-btn-ghost:hover { background: var(--gray-100); }

.lp-btn-lg { 
  padding: 12px 24px; 
  font-size: 14px; 
}

@media (min-width: 768px) {
  .lp-btn-lg { 
    padding: 14px 28px; 
    font-size: 15px; 
  }
}

.lp-btn-white {
  display: inline-flex; 
  align-items: center; 
  gap: 8px;
  padding: 12px 24px; 
  background: #fff; 
  color: var(--indigo);
  border-radius: var(--radius-sm); 
  font-weight: 700; 
  font-size: 14px;
  text-decoration: none; 
  box-shadow: 0 4px 14px rgba(0,0,0,.15);
  transition: transform .15s;
  cursor: pointer;
}

.lp-btn-white:hover { transform: translateY(-2px); }

.lp-btn-outline-white {
  display: inline-flex; 
  align-items: center; 
  gap: 8px;
  padding: 12px 24px; 
  border: 2px solid rgba(255,255,255,.4);
  border-radius: var(--radius-sm); 
  color: #fff; 
  font-weight: 600;
  font-size: 14px; 
  text-decoration: none;
  transition: border-color .15s, background .15s;
  cursor: pointer;
}

.lp-btn-outline-white:hover { border-color: rgba(255,255,255,.7); background: rgba(255,255,255,.08); }

/* ─────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────── */
.lp-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: rgba(255,255,255,.95);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid transparent;
  transition: border-color .2s, box-shadow .2s;
}

.lp-nav.scrolled {
  border-bottom-color: var(--gray-100);
  box-shadow: 0 2px 16px rgba(0,0,0,.06);
}

.lp-nav-inner {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 16px;
}

@media (min-width: 768px) {
  .lp-nav-inner {
    height: 64px;
    gap: 32px;
  }
}

.lp-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.lp-logo-icon {
  width: 30px; height: 30px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--blue), var(--indigo));
  box-shadow: 0 3px 8px rgba(79,70,229,.35);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .lp-logo-icon {
    width: 34px; height: 34px;
  }
}

.lp-logo-text {
  font-size: 16px;
  font-weight: 800;
  color: var(--gray-900);
}

@media (min-width: 768px) {
  .lp-logo-text {
    font-size: 18px;
  }
}

.lp-nav-links {
  display: none;
  gap: 4px;
  flex: 1;
}

@media (min-width: 1024px) {
  .lp-nav-links {
    display: flex;
  }
}

.lp-nav-links a {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-600);
  text-decoration: none;
  transition: background .15s, color .15s;
}

.lp-nav-links a:hover { background: var(--gray-100); color: var(--gray-900); }

.lp-nav-cta {
  display: none;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

@media (min-width: 1024px) {
  .lp-nav-cta {
    display: flex;
  }
}

.lp-menu-toggle {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}

@media (min-width: 1024px) {
  .lp-menu-toggle {
    display: none;
  }
}

.lp-menu-toggle span {
  display: block; width: 22px; height: 2px;
  background: var(--gray-700); border-radius: 2px;
  transition: all 0.2s;
}

.lp-mobile-menu {
  display: flex;
  flex-direction: column;
  padding: 12px 20px 16px;
  border-top: 1px solid var(--gray-100);
  background: #fff;
}

@media (min-width: 768px) {
  .lp-mobile-menu {
    padding: 12px 24px 16px;
  }
}

.lp-mobile-menu a {
  padding: 10px 0;
  color: var(--gray-700);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-bottom: 1px solid var(--gray-100);
}

.lp-mobile-login {
  margin-top: 12px;
  color: var(--indigo) !important;
  font-weight: 700 !important;
  border-bottom: none !important;
}

/* ─────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────── */
.lp-hero {
  padding: 100px 0 0;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .lp-hero {
    padding: 140px 0 0;
  }
}

.lp-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--gray-100) 1px, transparent 1px),
    linear-gradient(90deg, var(--gray-100) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: .45;
}

@media (min-width: 768px) {
  .lp-hero-grid {
    background-size: 48px 48px;
  }
}

.lp-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  opacity: .18;
}

.lp-blob-1 { width: 300px; height: 300px; background: #6366f1; top: -80px; right: -80px; }
.lp-blob-2 { width: 250px; height: 250px; background: #3b82f6; top: 200px; left: -120px; }

@media (min-width: 768px) {
  .lp-blob-1 { width: 480px; height: 480px; }
  .lp-blob-2 { width: 360px; height: 360px; }
}

.lp-hero-content { position: relative; z-index: 1; text-align: center; padding-bottom: 40px; }

@media (min-width: 768px) {
  .lp-hero-content { padding-bottom: 60px; }
}

.lp-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: var(--indigo-light);
  border: 1px solid #c7d2fe;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  color: var(--indigo);
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .lp-hero-badge {
    margin-bottom: 28px;
  }
}

.lp-badge-dot {
  width: 7px; height: 7px;
  background: var(--indigo);
  border-radius: 50%;
  animation: pulseDot 2s infinite;
}

.lp-hero-title {
  font-size: clamp(28px, 7vw, 62px);
  font-weight: 800;
  color: var(--gray-900);
  line-height: 1.1;
  margin: 0 0 16px;
}

@media (min-width: 768px) {
  .lp-hero-title {
    margin-bottom: 20px;
  }
}

.lp-hero-sub {
  font-size: 14px;
  color: var(--gray-500);
  max-width: 540px;
  margin: 0 auto 28px;
  line-height: 1.7;
}

@media (min-width: 768px) {
  .lp-hero-sub {
    font-size: 18px;
    margin-bottom: 36px;
  }
}

.lp-hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

@media (min-width: 768px) {
  .lp-hero-actions {
    margin-bottom: 36px;
  }
}

.lp-hero-proof {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.lp-proof-avatars {
  display: flex;
}

.lp-proof-avatars img {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -8px;
  object-fit: cover;
}

@media (min-width: 768px) {
  .lp-proof-avatars img {
    width: 32px; height: 32px;
  }
}

.lp-proof-avatars img:first-child { margin-left: 0; }

.lp-proof-text {
  font-size: 12px;
  color: var(--gray-500);
  margin: 0;
}

@media (min-width: 768px) {
  .lp-proof-text {
    font-size: 13px;
  }
}

.lp-proof-text strong { color: var(--gray-800); }

/* Hero Mockup */
.lp-hero-mockup-wrap {
  position: relative;
  z-index: 1;
  padding-bottom: 0;
}

.lp-mockup-frame {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  border: 1px solid var(--gray-200);
  border-bottom: none;
  box-shadow: 0 -4px 30px rgba(0,0,0,.08), 0 20px 50px rgba(79,70,229,.12);
  background: #fff;
}

@media (min-width: 768px) {
  .lp-mockup-frame {
    border-radius: 16px 16px 0 0;
  }
}

.lp-mockup-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-100);
}

@media (min-width: 768px) {
  .lp-mockup-bar {
    padding: 10px 16px;
  }
}

.lp-mockup-bar span {
  width: 9px; height: 9px;
  border-radius: 50%;
  background: var(--gray-200);
}

@media (min-width: 768px) {
  .lp-mockup-bar span {
    width: 11px; height: 11px;
  }
}

.lp-mockup-bar span:nth-child(1) { background: #ff5f56; }
.lp-mockup-bar span:nth-child(2) { background: #ffbd2e; }
.lp-mockup-bar span:nth-child(3) { background: #27c93f; }

.lp-mockup-url {
  flex: 1;
  margin-left: 8px;
  background: var(--gray-200);
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 10px;
  color: var(--gray-500);
  max-width: 160px;
}

@media (min-width: 768px) {
  .lp-mockup-url {
    padding: 4px 10px;
    font-size: 11px;
    max-width: 200px;
  }
}

.lp-attendance-preview {
  padding: 16px;
}

@media (min-width: 768px) {
  .lp-attendance-preview {
    padding: 20px;
  }
}

.lp-preview-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--gray-100);
}

.lp-preview-title {
  font-weight: 600;
  font-size: 13px;
  color: var(--gray-800);
}

@media (min-width: 768px) {
  .lp-preview-title {
    font-size: 14px;
  }
}

.lp-preview-date {
  font-size: 11px;
  color: var(--gray-400);
}

.lp-preview-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

@media (min-width: 768px) {
  .lp-preview-stats {
    gap: 20px;
    margin-bottom: 20px;
  }
}

.lp-preview-stat {
  font-size: 11px;
  color: var(--gray-500);
}

.lp-preview-stat span {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-800);
  margin-right: 4px;
}

@media (min-width: 768px) {
  .lp-preview-stat {
    font-size: 12px;
  }
  .lp-preview-stat span {
    font-size: 18px;
  }
}

.lp-preview-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lp-table-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: var(--gray-50);
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

@media (min-width: 480px) {
  .lp-table-row {
    flex-wrap: nowrap;
    gap: 0;
    padding: 10px;
  }
}

.lp-table-cell.name {
  font-weight: 500;
  font-size: 13px;
  color: var(--gray-700);
}

.lp-table-cell.status {
  font-size: 12px;
  font-weight: 600;
}

.lp-table-cell.status.present { color: #16a34a; }
.lp-table-cell.status.late { color: #f59e0b; }

.lp-table-cell.time {
  font-size: 11px;
  color: var(--gray-400);
}

/* Stats Band */
.lp-stats-band {
  padding: 40px 0;
  border-top: 1px solid var(--gray-100);
  border-bottom: 1px solid var(--gray-100);
  background: var(--gray-50);
}

@media (min-width: 768px) {
  .lp-stats-band {
    padding: 56px 0;
  }
}

.lp-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (min-width: 640px) {
  .lp-stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
}

.lp-stat-item {
  text-align: center;
}

.lp-stat-number {
  font-size: clamp(24px, 5vw, 40px);
  font-weight: 800;
  background: linear-gradient(135deg, var(--blue), var(--indigo));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.lp-stat-desc {
  font-size: 12px;
  color: var(--gray-500);
  font-weight: 500;
}

@media (min-width: 768px) {
  .lp-stat-desc {
    font-size: 14px;
  }
}

/* Sections */
.lp-section { padding: 60px 0; }

@media (min-width: 768px) {
  .lp-section { padding: 100px 0; }
}

.lp-section-alt { background: var(--gray-50); }

/* Features Grid */
.lp-features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .lp-features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .lp-features-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

.lp-feature-card {
  background: #fff;
  border: 1px solid var(--gray-100);
  border-radius: var(--radius);
  padding: 20px;
  transition: transform .2s, box-shadow .2s;
  animation: fadeUp 0.5s ease forwards;
  opacity: 0;
}

@media (min-width: 768px) {
  .lp-feature-card {
    padding: 28px 24px;
  }
}

.lp-feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0,0,0,.08);
}

.lp-feature-icon {
  width: 42px; height: 42px;
  border-radius: 12px;
  background: var(--bg);
  color: var(--color);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}

@media (min-width: 768px) {
  .lp-feature-icon {
    width: 46px; height: 46px;
  }
}

.lp-feature-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
}

.lp-feature-desc {
  font-size: 13px;
  color: var(--gray-500);
  line-height: 1.6;
  margin: 0;
}

/* Attendance Showcase */
.lp-attendance-showcase {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: center;
}

@media (min-width: 768px) {
  .lp-attendance-showcase {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
  }
}

.lp-showcase-card {
  background: #fff;
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,.08);
  text-align: center;
}

@media (min-width: 768px) {
  .lp-showcase-card {
    padding: 32px;
  }
}

.lp-qr-mock {
  margin-bottom: 20px;
}

.lp-qr-box {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  margin: 0 auto 12px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .lp-qr-box {
    width: 150px;
    height: 150px;
  }
}

.lp-qr-box::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: repeating-linear-gradient(90deg, #4f46e5, #4f46e5 4px, #fff 4px, #fff 8px);
  opacity: 0.3;
}

.lp-checkin-form-mock {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lp-mock-input {
  padding: 10px;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 12px;
  color: var(--gray-500);
  text-align: left;
}

@media (min-width: 768px) {
  .lp-mock-input {
    font-size: 13px;
    padding: 10px;
  }
}

.lp-mock-btn {
  padding: 10px;
  background: linear-gradient(135deg, var(--blue), var(--indigo));
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.lp-showcase-right h3 {
  font-size: 20px;
  margin-bottom: 16px;
}

@media (min-width: 768px) {
  .lp-showcase-right h3 {
    font-size: 24px;
    margin-bottom: 20px;
  }
}

.lp-showcase-right ul {
  list-style: none;
  padding: 0;
}

.lp-showcase-right li {
  padding: 8px 0;
  font-size: 14px;
  color: var(--gray-600);
}

@media (min-width: 768px) {
  .lp-showcase-right li {
    font-size: 15px;
  }
}

/* Steps */
.lp-steps {
  max-width: 640px;
  margin: 0 auto;
}

.lp-step {
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
}

@media (min-width: 768px) {
  .lp-step {
    gap: 24px;
    margin-bottom: 32px;
  }
}

.lp-step-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 36px;
}

@media (min-width: 768px) {
  .lp-step-left {
    width: 40px;
  }
}

.lp-step-number {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), var(--indigo));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .lp-step-number {
    width: 40px; height: 40px;
    font-size: 13px;
  }
}

.lp-step-line {
  width: 2px;
  flex: 1;
  background: var(--gray-100);
  margin: 6px 0;
  min-height: 24px;
}

.lp-step-right {
  display: flex;
  gap: 12px;
  flex: 1;
}

@media (min-width: 768px) {
  .lp-step-right {
    gap: 16px;
  }
}

.lp-step-icon-wrap {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lp-step-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 6px;
}

.lp-step-desc {
  font-size: 13px;
  color: var(--gray-500);
  line-height: 1.6;
  margin: 0;
}

@media (min-width: 768px) {
  .lp-step-title {
    font-size: 16px;
  }
  .lp-step-desc {
    font-size: 14px;
  }
}

/* Pricing */
.lp-billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

@media (min-width: 768px) {
  .lp-billing-toggle {
    margin-bottom: 48px;
  }
}

.lp-toggle-track {
  width: 44px; height: 24px;
  border-radius: 12px;
  background: var(--indigo);
  position: relative;
  cursor: pointer;
}

.lp-toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform .2s;
}

.lp-toggle-thumb.right { transform: translateX(20px); }

.lp-save-badge {
  display: inline-block;
  background: #dcfce7;
  color: #16a34a;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 4px;
}

.lp-pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .lp-pricing-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.lp-plan-card {
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 24px 20px;
  position: relative;
}

@media (min-width: 768px) {
  .lp-plan-card {
    padding: 32px 28px;
  }
}

.lp-plan-card.featured {
  background: linear-gradient(160deg, #1e3a8a, #312e81);
  border-color: transparent;
  color: #fff;
}

@media (min-width: 768px) {
  .lp-plan-card.featured {
    transform: translateY(-8px);
  }
}

.lp-plan-badge {
  position: absolute;
  top: -12px; left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--blue), var(--indigo));
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 99px;
  white-space: nowrap;
}

.lp-plan-name {
  font-size: 18px;
  font-weight: 700;
}

.lp-plan-price {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  margin: 16px 0;
}

.lp-price-amount {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}

@media (min-width: 768px) {
  .lp-price-amount {
    font-size: 48px;
  }
}

.lp-plan-desc {
  font-size: 13px;
  color: var(--gray-500);
  margin: 12px 0 0;
}

.lp-plan-card.featured .lp-plan-desc {
  color: rgba(255,255,255,.7);
}

.lp-plan-features {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (min-width: 768px) {
  .lp-plan-features {
    margin: 24px 0;
  }
}

.lp-plan-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.lp-plan-btn {
  display: block;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  background: var(--gray-100);
  color: var(--gray-800);
  transition: background .15s;
  cursor: pointer;
}

.lp-plan-btn:hover {
  background: var(--gray-200);
}

.lp-plan-btn-featured {
  background: rgba(255,255,255,.15);
  color: #fff;
}

.lp-plan-btn-featured:hover {
  background: rgba(255,255,255,.25);
}

/* Testimonials */
.lp-testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .lp-testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .lp-testimonials-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

.lp-testimonial-card {
  background: #fff;
  border: 1px solid var(--gray-100);
  border-radius: var(--radius);
  padding: 20px;
}

@media (min-width: 768px) {
  .lp-testimonial-card {
    padding: 28px;
  }
}

.lp-stars {
  display: flex;
  gap: 3px;
  margin-bottom: 16px;
}

.lp-testimonial-body {
  font-size: 14px;
  color: var(--gray-600);
  line-height: 1.7;
  margin-bottom: 20px;
}

.lp-testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lp-author-avatar {
  width: 40px; height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
}

.lp-author-name {
  font-size: 13px;
  font-weight: 700;
  margin: 0;
}

.lp-author-role {
  font-size: 12px;
  color: var(--gray-400);
  margin: 2px 0 0;
}

/* FAQ */
.lp-faq-list {
  max-width: 720px;
  margin: 0 auto;
}

.lp-faq-item {
  border-bottom: 1px solid var(--gray-100);
  cursor: pointer;
}

.lp-faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  font-weight: 600;
  font-size: 15px;
}

@media (min-width: 768px) {
  .lp-faq-q {
    padding: 20px 0;
    font-size: 16px;
  }
}

.lp-faq-chevron {
  transition: transform .2s;
  flex-shrink: 0;
}

.lp-faq-item.open .lp-faq-chevron { transform: rotate(180deg); }

.lp-faq-a {
  font-size: 14px;
  color: var(--gray-500);
  line-height: 1.7;
  padding-bottom: 20px;
  margin: 0;
}

/* CTA Band */
.lp-cta-band {
  padding: 60px 0;
  background: linear-gradient(135deg, #1e3a8a, #312e81);
  position: relative;
  overflow: hidden;
  text-align: center;
}

@media (min-width: 768px) {
  .lp-cta-band {
    padding: 100px 0;
  }
}

.lp-cta-title {
  font-size: clamp(24px, 6vw, 46px);
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
}

.lp-cta-sub {
  font-size: 14px;
  color: rgba(255,255,255,.7);
  max-width: 500px;
  margin: 0 auto 28px;
  padding: 0 20px;
}

@media (min-width: 768px) {
  .lp-cta-sub {
    font-size: 16px;
    margin-bottom: 36px;
  }
}

.lp-cta-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 0 20px;
}

/* Footer */
.lp-footer {
  background: var(--gray-900);
  color: var(--gray-400);
  padding: 40px 0 28px;
}

@media (min-width: 768px) {
  .lp-footer {
    padding: 64px 0 32px;
  }
}

.lp-footer-top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 40px;
}

@media (min-width: 640px) {
  .lp-footer-top {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .lp-footer-top {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 48px;
  }
}

.lp-footer-tagline {
  font-size: 13px;
  line-height: 1.6;
  margin: 12px 0 20px;
}

.lp-footer-socials {
  display: flex;
  gap: 12px;
}

.lp-footer-socials a {
  width: 34px; height: 34px;
  border-radius: 8px;
  background: rgba(255,255,255,.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
  text-decoration: none;
  transition: background .15s;
}

.lp-footer-socials a:hover {
  background: rgba(255,255,255,.12);
  color: #fff;
}

.lp-footer-col-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 16px;
}

.lp-footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lp-footer-col ul li {
  margin-bottom: 10px;
}

.lp-footer-col ul a {
  font-size: 13px;
  color: var(--gray-500);
  text-decoration: none;
  transition: color .15s;
}

.lp-footer-col ul a:hover { color: #fff; }

.lp-footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,.06);
  font-size: 11px;
}

@media (min-width: 640px) {
  .lp-footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
  }
}

.lp-footer-legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.lp-footer-legal a {
  color: var(--gray-500);
  text-decoration: none;
  transition: color .15s;
}

.lp-footer-legal a:hover { color: #fff; }

/* Transitions */
.slide-down-enter-active, .slide-down-leave-active {
  transition: max-height .25s, opacity .2s;
  overflow: hidden;
}

.slide-down-enter-from, .slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.faq-expand-enter-active, .faq-expand-leave-active {
  transition: max-height .2s ease;
  overflow: hidden;
}

.faq-expand-enter-from, .faq-expand-leave-to {
  max-height: 0;
}
</style>