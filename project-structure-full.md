# هيكلة المشروع الكاملة - Number1 Exchange

**المجلد الرئيسي**: `c:/Users/alaap/OneDrive/سطح المكتب/number1`

## 📁 **number1-backend/** (Backend - Node.js/Express/MongoDB)

```
number1-backend/
├── .gitignore
├── package-lock.json
├── package.json
├── server.js
├── middleware/
│   └── auth.js
├── models/
│   ├── Deposit.js
│   ├── Order.js
│   ├── Rate.js
│   ├── Setting.js
│   ├── Transaction.js
│   ├── User.js
│   └── Wallet.js
├── routes/
│   ├── admin.js
│   ├── auth.js
│   ├── orders.js
│   ├── public.js
│   └── wallet.js
└── services/
    ├── cloudinary.js
    ├── telegram.js
    └── trongrid.js
```

## 📁 **number1-exchange-main/** (Frontend - React 18 / Vite / shadcn/ui)

```
number1-exchange-main/
├── .gitignore
├── clean-structure.txt
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vercel.json
├── vite.config.js
├── public/
│   ├── favicon.png
│   ├── icons.svg
│   └── images/
│       ├── chatbot.png
│       ├── etisalat.png
│       ├── etisalat.png.png
│       ├── feature-limits.png
│       ├── feature-security.png
│       ├── feature-support.png
│       ├── instapay.png
│       ├── moneygo.png
│       ├── N1.jpg
│       ├── telegram.png
│       ├── usdt.png
│       ├── vodafone.png
│       └── whatsapp.png
└── src/
    ├── App.css
    ├── App.jsx
    ├── enhance.css
    ├── index.css
    ├── main.jsx
    ├── mobile.css
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   ├── RobotImg.js
    │   └── vite.svg
    ├── components/
    │   ├── AuthModal.jsx
    │   ├── RobotImg.js
    │   ├── admin/
    │   │   ├── adminConstants.js
    │   │   ├── AdminLayout.jsx
    │   │   ├── adminShared.jsx
    │   │   └── AdminStatusBadge.jsx
    │   ├── auth/
    │   │   ├── NotificationsBell.jsx
    │   │   ├── SettingsModal.jsx
    │   │   └── UserPanel.jsx
    │   ├── common/
    │   │   ├── AuthModal.jsx
    │   │   ├── ChatBot.jsx
    │   │   ├── Footer.jsx
    │   │   ├── MobileBottomNav.jsx
    │   │   ├── Navbar.jsx
    │   │   └── SupportFAB.jsx
    │   ├── home/
    │   │   ├── ConfirmModal.jsx
    │   │   ├── CurrencyDropdown.jsx
    │   │   ├── ExchangeForm.jsx
    │   │   ├── FeaturesSection.jsx
    │   │   ├── HeroSection.jsx
    │   │   ├── PairsSidebar.jsx
    │   │   ├── PromoBanner.jsx
    │   │   └── ReviewsSidebar.jsx
    │   ├── shared/
    │   │   └── FlowDots.jsx
    │   └── ui/ (50+ مكون shadcn/ui)
    │       ├── accordion.jsx
    │       ├── alert-dialog.jsx
    │       ├── alert.jsx
    │       ├── aspect-ratio.jsx
    │       ├── avatar.jsx
    │       ├── badge.jsx
    │       ├── breadcrumb.jsx
    │       ├── button.jsx
    │       ├── calendar.jsx
    │       ├── card.jsx
    │       ├── carousel.jsx
    │       ├── checkbox.jsx
    │       ├── collapsible.jsx
    │       ├── command.jsx
    │       ├── context-menu.jsx
    │       ├── dialog.jsx
    │       ├── drawer.jsx
    │       ├── dropdown-menu.jsx
    │       ├── form.jsx
    │       ├── gooey-text-morphing.jsx
    │       ├── hover-card.jsx
    │       ├── input-otp.jsx
    │       ├── input.jsx
    │       ├── label.jsx
    │       ├── menubar.jsx
    │       ├── navigation-menu.jsx
    │       ├── pagination.jsx
    │       ├── popover.jsx
    │       ├── progress.jsx
    │       ├── radio-group.jsx
    │       ├── resizable.jsx
    │       ├── scroll-area.jsx
    │       ├── select.jsx
    │       ├── separator.jsx
    │       ├── sheet.jsx
    │       ├── skeleton.jsx
    │       ├── slider.jsx
    │       ├── sonner.jsx
    │       ├── switch.jsx
    │       ├── table.jsx
    │       ├── tabs.jsx
    │       ├── textarea.jsx
    │       ├── toast.jsx
    │       ├── toaster.jsx
    │       ├── toggle-group.jsx
    │       ├── toggle.jsx
    │       └── tooltip.jsx
    ├── context/
    │   ├── AuthContext.jsx
    │   ├── LanguageContext.jsx
    │   ├── ThemeContext.jsx
    │   ├── useAuth.js
    │   ├── useLang.js
    │   └── useTheme.js
    ├── data/
    │   └── currencies.js
    ├── hooks/
    │   └── useIsMobile.js
    ├── locales/
    │   ├── ar.js
    │   └── en.js
    ├── pages/
    │   ├── About.jsx
    │   ├── Contact.jsx
    │   ├── ExchangeFormPage.jsx
    │   ├── ExchangeOrder.jsx
    │   ├── ExchangeSelect.jsx
    │   ├── FAQ.jsx
    │   ├── Home.jsx
    │   ├── HowItWorks.jsx
    │   ├── MyOrders.jsx
    │   ├── NotFound.jsx
    │   ├── OrderConfirmPage.jsx
    │   ├── OrderTrack.jsx
    │   ├── OtherPages.jsx
    │   ├── Rates.jsx
    │   ├── Reviews.jsx
    │   ├── Wallet.jsx
    │   ├── admin/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminDeposits.jsx
    │   │   ├── AdminLogin.jsx
    │   │   ├── AdminOrders.jsx
    │   │   ├── AdminPaymentMethods.jsx
    │   │   ├── AdminRates.jsx
    │   │   ├── AdminSettings.jsx
    │   │   ├── AdminUsers.jsx
    │   │   └── AdminWallets.jsx
    │   ├── admin/settings/
    │   │   ├── SettingsShared.jsx
    │   │   ├── TabGeneral.jsx
    │   │   ├── TabIntegrations.jsx
    │   │   ├── TabNotifications.jsx
    │   │   ├── TabOrders.jsx
    │   │   └── TabSecurity.jsx
    │   └── legal/
    │       ├── AML.jsx
    │       ├── Cookies.jsx
    │       ├── LegalLayout.jsx
    │       ├── Privacy.jsx
    │       └── Terms.jsx
    └── services/
        ├── api.js
        ├── orderSession.js
        └── rateEngine.js
```

## 📋 **ملخص التقنيات**

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth, Cloudinary, Telegram Bot, TRON (USDT)
- **Frontend**: React 18, Vite, shadcn/ui, TailwindCSS, Context API, i18n (عربي/إنجليزي), Mobile Responsive
- **Deployment**: Vercel (Frontend), Heroku/Railway (Backend)

## 🚀 **أوامر التشغيل**

```bash
# Backend
cd number1-backend
npm install
npm start

# Frontend (مجلد منفصل)
cd number1-exchange-main
npm install
npm run dev
```

تم إنشاء هذه الملف كـ `project-structure-full.md` في مجلدك الرئيسي.
