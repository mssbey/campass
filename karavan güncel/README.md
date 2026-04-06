# Camppass Karavan — Premium Kurumsal Web Sitesi

> Camppass karavanları için geliştirilen, sinematik karanlık tema tasarımlı, Odoo 17 uyumlu, production-ready premium kurumsal web sitesi.

![Odoo 17](https://img.shields.io/badge/Odoo-17.0-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/License-LGPL--3-green?style=flat-square)
![Pages](https://img.shields.io/badge/Pages-8-gold?style=flat-square)
![Models](https://img.shields.io/badge/Karavan_Modelleri-7-orange?style=flat-square)

---

## Genel Bakış

Camppass, premium karavan üreticisi için tasarlanmış sinematik dark-theme kurumsal web sitesidir. Proje iki ana Odoo modülünden oluşur:

| Modül | Açıklama |
|-------|----------|
| **caravan_theme** | Ana web sitesi teması — 8 sayfa, sinematik UI/UX, responsive |
| **caravan_configurator** | 3D karavan konfigüratör & sipariş sistemi (Three.js) |

---

## Teknoloji Yığını (Tech Stack)

### Frontend

| Teknoloji | Kullanım |
|-----------|----------|
| **HTML5 / QWeb** | Tüm sayfalar Odoo QWeb template engine ile |
| **CSS3** | ~4.200 satır — CSS Variables, Flexbox, Grid, Glassmorphism, Keyframe Animations |
| **Vanilla JavaScript** | ~2.100 satır — Sıfır framework bağımlılığı |
| **Canvas API** | Particle efektleri (gold partiküller, 45-60 partikül/sahne) |
| **IntersectionObserver API** | Scroll-driven reveal animasyonları |
| **Google Fonts** | Inter (400–900 ağırlıkları) |

### Backend

| Teknoloji | Kullanım |
|-----------|----------|
| **Odoo 17** | Web framework, routing, template engine |
| **Python 3** | Controller routing (`http.Controller`) |
| **QWeb XML** | Template inheritance, `t-call`, `t-set`, `t-raw` |
| **Three.js** | 3D karavan konfigüratör (CDN: r160) |

### Mimari Kararlar

| Karar | Neden |
|-------|-------|
| Framework-free JS | Performans, Odoo uyumluluk, bağımlılık minimize |
| CSS Variables | Tek noktadan renk/spacing yönetimi |
| Lazy-load harita | Sayfa yüklenme hızı — Google Maps sadece tıklamada |
| MP4 Hero video | Autoplay/muted ile yüksek etkili landing |
| Canvas Particles | GPU-accelerated hafif efekt, WebGL yerine Canvas 2D |
| Modüler CSS | Sayfa başına ayrı CSS dosyası — paralel yükleme |

---

## Renk Paleti (Design Tokens)

```css
--cv-bg-primary:    #07080B      /* Ana arka plan */
--cv-bg-card:       #0F1115      /* Kart arka planları */
--cv-accent:        #F5A623      /* Gold vurgu rengi */
--cv-accent-hover:  #FFB83D      /* Gold hover */
--cv-text:          #EAEAEA      /* Ana metin */
--cv-text-muted:    #8A8D96      /* İkincil metin */
--cv-border:        rgba(255,255,255,0.06)
```

---

## Proje Yapısı

```
karavan güncel/
│
├── caravan_theme/                    # ANA TEMA MODÜLÜ
│   ├── __init__.py
│   ├── __manifest__.py               # Odoo 17 modül tanımı
│   ├── preview.html                  # Standalone lokal preview
│   │
│   ├── controllers/
│   │   ├── __init__.py
│   │   └── main.py                   # 8 route (/, /modeller, /model/<slug>, ...)
│   │
│   ├── views/
│   │   ├── assets.xml                # Google Fonts enjeksiyonu
│   │   ├── layout.xml                # Base layout (header/footer wrap)
│   │   ├── header.xml                # Sticky navbar + mobile menu
│   │   ├── footer.xml                # 4 kolonlu footer
│   │   └── pages/
│   │       ├── home.xml              # Anasayfa
│   │       ├── models.xml            # Modeller (sinematik showcase)
│   │       ├── model_detail.xml      # Model detay (dinamik)
│   │       ├── service.xml           # Servis & Bayiler
│   │       ├── corporate.xml         # Kurumsal (marka deneyimi)
│   │       ├── news.xml              # Haberler
│   │       ├── faq.xml               # SSS (accordion)
│   │       └── contact.xml           # İletişim (akıllı form)
│   │
│   └── static/src/
│       ├── css/
│       │   ├── style.css             # Global (~2.100 satır)
│       │   ├── models-cinematic.css  # Modeller (~900 satır)
│       │   ├── corporate-cinematic.css # Kurumsal (~620 satır)
│       │   └── contact-cinematic.css # İletişim (~580 satır)
│       ├── js/
│       │   ├── main.js               # Global JS (~280 satır)
│       │   ├── models-cinematic.js   # Model showcase (~1.100 satır)
│       │   ├── corporate-cinematic.js # Kurumsal (~220 satır)
│       │   └── contact-cinematic.js  # İletişim (~480 satır)
│       ├── img/                      # 57+ görsel (WebP, PNG, SVG)
│       └── video/
│           └── hero.mp4              # Hero arka plan videosu
│
├── caravan_configurator/             # 3D KONFİGÜRATÖR MODÜLÜ
│   ├── __init__.py
│   ├── __manifest__.py
│   ├── controllers/main.py
│   ├── models/
│   │   ├── caravan_configuration.py  # Konfigürasyon modeli
│   │   ├── caravan_model.py          # Karavan modeli
│   │   ├── caravan_option.py         # Opsiyonlar
│   │   └── caravan_order.py          # Sipariş sistemi
│   ├── views/
│   │   ├── admin_views.xml           # Odoo admin paneli
│   │   ├── configurator_template.xml # Frontend QWeb
│   │   └── menu.xml                  # Menü tanımları
│   ├── security/ir.model.access.csv
│   └── static/src/
│       ├── css/configurator.css
│       └── js/
│           ├── configurator_engine.js # Three.js 3D motor
│           └── configurator_ui.js     # UI kontrolleri
│
└── public/                           # Ham kaynak medya
```

---

## Sayfalar & Rotalar

| Rota | Template ID | Sayfa | Öne Çıkan Özellikler |
|------|-------------|-------|----------------------|
| `/` | `page_home` | **Anasayfa** | MP4 hero video, HUD overlay, öne çıkan modeller (3 kart), CTA banner |
| `/modeller` | `page_models` | **Modeller** | Canvas particle intro, 7 sahnelik scroll-driven showcase, model karşılaştırma (VS), AI model önerici wizard |
| `/model/<slug>` | `page_model_detail` | **Model Detay** | Dinamik içerik (JS), 8 teknik spec kartı, özellik listesi, fotoğraf galerisi, CTA |
| `/servis` | `page_service` | **Servis** | Google Maps embed, 3 bayi kartı, randevu formu |
| `/kurumsal` | `page_corporate` | **Kurumsal** | Sinematik giriş, 3 marka DNA pillar'ı, timeline carousel, ekip, üretim, manifesto |
| `/haberler` | `page_news` | **Haberler** | Haber kartları grid, basın bültenleri |
| `/sss` | `page_faq` | **SSS** | Accordion (JS toggle), CTA |
| `/iletisim` | `page_contact` | **İletişim** | 3 kart seçici (Teklif/Kiralama/Destek), akıllı dinamik form, lazy map, WhatsApp entegrasyonu, animasyonlu counter'lar |

---

## Karavan Modelleri

| Model | Tip | Kapasite | Boş Ağırlık | İç Hacim | Uzunluk | Başlangıç Fiyat |
|-------|-----|----------|-------------|----------|---------|-----------------|
| **CR400 Journey** | Kompakt | 2 Kişi | ~450 kg | 4 m³ | 4.440 mm | 12.900 € |
| **CR400** | Başlangıç | 2 Kişi | 450 kg | 4 m³ | — | 14.900 € |
| **CR455** | Off-Road | 4 Kişi | 1.050 kg | 15 m³ | 6.060 mm | 34.800 € |
| **CR550** | Aile | 4 Kişi | 1.000 kg | 15 m³ | 5.520 mm | 33.980 € |
| **CR550i** | Kompakt | 2 Kişi | 1.000 kg | 15 m³ | 5.520 mm | 33.980 € |
| **CR555** | Popüler | 4 Kişi | 1.100 kg | 20 m³ | 5.940 mm | 38.900 € |
| **CR650** | Premium | 4 Kişi | 1.150 kg | 17.5 m³ | 6.960 mm | 41.900 € |

---

## Frontend Mimari Detayları

### CSS Mimarisi (~4.200 satır toplam)

| Dosya | Satır | İçerik |
|-------|-------|--------|
| `style.css` | ~2.100 | CSS Variables, reset, tipografi, header (sticky → solid), hero video, feature strip, model kartları, breadcrumb, galeri, harita, haber kartları, FAQ accordion, footer, tüm responsive breakpoints |
| `models-cinematic.css` | ~900 | Immersive entry, sahne geçişleri, spotlight/glow efektleri, progress bar, nav dots, fleet grid, AI wizard, karşılaştırma overlay |
| `corporate-cinematic.css` | ~620 | Brand entry parallax, DNA pillar kartları, media row drag-scroll, timeline carousel, ekip fotoğrafları, production bölümü, manifesto kapanış |
| `contact-cinematic.css` | ~580 | Hero alanı, kart seçici UI, floating label form, tip switching, dosya yükleme, başarı animasyonu, harita placeholder, trust counter'lar, visit split layout |

### JavaScript Mimarisi (~2.100 satır toplam)

| Dosya | Satır | Temel Fonksiyonlar |
|-------|-------|-------------------|
| `main.js` | ~280 | `initNavbar()` — scroll-based header, `initMobileMenu()` — hamburger, `initScrollAnimations()` — IntersectionObserver, `initFaqAccordion()`, `initSmoothScroll()` |
| `models-cinematic.js` | ~1.100 | `initParticles()` — Canvas partikül sistemi, `initScrollEngine()` — wheel/touch/keyboard sahne geçişi, `goToScene()` — sinematik transition, `initCompareMode()` — VS karşılaştırma, `initWizard()` — AI model önerici |
| `corporate-cinematic.js` | ~220 | `initParticles()`, `initDragScroll()` — mouse drag, `initTimeline()` — carousel, `initSectionReveals()` |
| `contact-cinematic.js` | ~480 | `initFormSwitch()` — 3 form tipi, `initMap()` — lazy Google Maps, `initCounters()` — animasyonlu sayaçlar, `initConfigSend()` — konfigüratörden otomatik form doldurma |

### Animasyon Sistemi

| Tür | Teknoloji | Kullanım Alanı |
|-----|-----------|----------------|
| **Scroll Reveal** | IntersectionObserver + CSS | `.cv-animate` → `.cv-visible` (fade-up) |
| **Particle Effects** | Canvas 2D API | Modeller girişi, kurumsal giriş, iletişim hero + final |
| **Scene Transitions** | CSS Transitions + JS | Model showcase (wheel/touch/keyboard ile sahne geçişi) |
| **Counter Animation** | requestAnimationFrame + Ease-out | İletişim sayfası güven sayaçları |
| **Hero Video** | HTML5 `<video>` autoplay/muted | Anasayfa hero arka planı |
| **Accordion** | CSS max-height + JS toggle | SSS sayfası |
| **Sticky Header** | Scroll event + CSS class | Şeffaf → solid header |

---

## 3D Konfigüratör Modülü

| Özellik | Detay |
|---------|-------|
| **3D Motor** | Three.js r160 (CDN) + OrbitControls |
| **Özelleştirmeler** | Renk, jant, tavan, aydınlatma, aksesuar, iç mekan |
| **Fiyat Hesaplama** | Canlı toplam fiyat güncelleme |
| **Sipariş Sistemi** | Odoo backend entegrasyonu — sipariş oluşturma, PDF çıktı |
| **Admin Paneli** | Model yönetimi, opsiyon yönetimi, sipariş takibi |
| **Konfigürasyon Paylaşım** | sessionStorage üzerinden iletişim formuna otomatik aktarım |

---

## Medya Varlıkları

| Tür | Adet | Format | Açıklama |
|-----|------|--------|----------|
| Logolar | 3 | WebP, SVG | Logo (tam + ikon) |
| Banner | 2 | PNG, WebP | Hero görselleri |
| Model Render | 7+ | PNG, WebP | Her model için ana görsel |
| Galeri Fotoğrafları | 45+ | WebP | Model başına 4-8 galeri fotoğrafı |
| Ekip Fotoğrafları | 5 | WebP | Kurumsal sayfa ekip |
| Hero Video | 1 | MP4 | Anasayfa arka plan videosu |

---

## Odoo Modül Yapılandırması

### caravan_theme (`__manifest__.py`)

```python
{
    'name': 'Camppass Karavan Theme',
    'version': '17.0.1.0.0',
    'category': 'Theme/Creative',
    'license': 'LGPL-3',
    'depends': ['website'],
    'assets': {
        'web.assets_frontend': [
            # 4 CSS + 4 JS dosyası
        ]
    }
}
```

### Odoo Template Hiyerarşisi

```
website.layout (Odoo varsayılan)
  └── caravan_theme.caravan_layout (no_header/no_footer)
        ├── caravan_theme.caravan_header (custom header)
        ├── <main> t-raw="0" (sayfa içeriği)
        └── caravan_theme.caravan_footer (custom footer)
```

---

## Geliştirme Ortamı

### Lokal Preview (Odoo'suz)

```bash
cd caravan_theme
python -m http.server 8080
```

Tarayıcı: [http://localhost:8080/preview.html](http://localhost:8080/preview.html)

> Preview alt navigasyondan tüm sayfalar arasında geçiş yapılabilir.

### Odoo Deploy

```bash
# 1. Modülü addons dizinine kopyala
cp -r caravan_theme /odoo/addons/

# 2. Odoo'yu yeniden başlat
./odoo-bin -u caravan_theme -d veritabani_adi

# 3. Odoo.sh için: commit & push — otomatik deploy
```

### Gereksinimler

| Gereksinim | Amaç |
|------------|-------|
| Python 3.x | Lokal preview sunucusu |
| Modern Tarayıcı | Chrome 90+, Firefox 90+, Edge 90+, Safari 15+ |
| Odoo 17 | Production deploy |

---

## Responsive Tasarım

| Breakpoint | Hedef |
|------------|-------|
| `1200px+` | Desktop — tam düzen |
| `992px` | Tablet landscape — grid daraltma |
| `768px` | Tablet portrait — tek kolon geçişi |
| `576px` | Mobil — hamburger menü, stack layout |
| `480px` | Küçük mobil — tipografi ve spacing adaptasyonu |

---

## Güvenlik & Performans

| Önlem | Detay |
|-------|-------|
| CSRF | Odoo framework built-in CSRF token |
| XSS Prevention | QWeb otomatik HTML escaping |
| Lazy Loading | Google Maps tıklanınca yüklenir, görseller IntersectionObserver ile |
| Asset Minification | Odoo assets pipeline ile otomatik |
| Video Preload | `preload="auto"` + muted autoplay |
| Font Preconnect | Google Fonts `<link rel="preconnect">` |

---

## İletişim Bilgileri

| | |
|--|--|
| **Telefon** | +90 533 085 17 81 |
| **E-posta** | info@camppass.com |
| **Adres** | Orhaniye Mah. 2051 Cad. No: 15, Kahramankazan / Ankara / Türkiye |
| **Website** | [camppass.com](https://camppass.com) |

---

## Lisans

Bu proje **LGPL-3** lisansı altında dağıtılmaktadır.

---

<p align="center"><em>Made by zeynart Web Bilişim</em></p>
