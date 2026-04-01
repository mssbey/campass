# Camppass Karavan — Premium Web Sitesi

Camppass karavanları için geliştirilen, sinematik karanlık tema tasarımlı premium kurumsal web sitesi.

---

## Proje Yapısı

```
karavan güncel/
├── caravan_theme/          # Ana tema modülü (Odoo uyumlu)
│   ├── static/src/
│   │   ├── css/            # Stil dosyaları
│   │   │   ├── style.css               # Global stiller, header, footer, nav
│   │   │   ├── configurator.css        # Karavan konfigüratörü
│   │   │   ├── contact-cinematic.css   # İletişim sayfası
│   │   │   ├── corporate-cinematic.css # Kurumsal sayfa
│   │   │   └── models-cinematic.css    # Modeller/ürün sayfası
│   │   ├── js/
│   │   │   ├── main.js                 # Global JS, sayfa geçişleri
│   │   │   ├── models-cinematic.js     # Model showcase animasyonları
│   │   │   ├── corporate-cinematic.js  # Kurumsal sayfa JS
│   │   │   └── contact-cinematic.js    # İletişim sayfası JS
│   │   ├── img/                        # Tüm görseller
│   │   └── video/
│   │       └── hero.mp4                # Ana sayfa hero video
│   ├── views/              # Odoo XML view'ları
│   ├── preview.html        # Standalone HTML preview (geliştirme)
│   └── __manifest__.py
├── caravan_configurator/   # Karavan konfigüratör modülü (Odoo)
│   ├── models/
│   ├── controllers/
│   ├── views/
│   └── static/
└── public/                 # Ham medya dosyaları (kaynak görseller, video)
```

---

## Sayfalar

| Sayfa | Açıklama |
|-------|----------|
| **Anasayfa** | Hero video, öne çıkan modeller, showroom çağrısı |
| **Modeller** | 7 karavan modelinin sinematik showcase'i |
| **Model Detay** | Her model için teknik özellikler, fotoğraf galerisi, fiyat |
| **Servis** | Servis randevusu, bayi listesi |
| **Kurumsal** | Şirket, ekip, değerler |
| **Haberler** | Blog / basın haberleri |
| **SSS** | Sık sorulan sorular (accordion) |
| **İletişim** | İletişim formu, showroom bilgileri |

---

## Modeller

| Model | Kapasite | Fiyat |
|-------|----------|-------|
| CR400 Journey | 2 Kişi | 12.900 €'den |
| CR400 | 2 Kişi | 14.900 €'den |
| CR455 | 4 Kişi | 34.800 €'den |
| CR550 | 4 Kişi | 33.980 €'den |
| CR550i | 2 Kişi | 33.980 €'den |
| CR555 | 4 Kişi | 38.900 €'den |
| CR650 | 4 Kişi | 41.900 €'den |

---

## Geliştirme Ortamı

### Lokal Sunucu (Standalone Preview)

```bash
cd "C:\Users\PC\Desktop\karavan güncel"
python -m http.server 8080 --bind 127.0.0.1
```

Tarayıcıda aç: [http://127.0.0.1:8080/caravan_theme/preview.html](http://127.0.0.1:8080/caravan_theme/preview.html)

### Gereksinimler

- Python 3.x (lokal sunucu için)
- Modern tarayıcı (Chrome / Edge / Firefox)

---

## Teknik Özellikler

- **Platform:** Vanilla HTML5 + CSS3 + JavaScript (framework bağımsız)
- **Tasarım:** Koyu tema, altın renk `#F5A623`, sinematik premium estetik
- **Animasyonlar:** CSS transitions + Intersection Observer tabanlı scroll animasyonları
- **Hero:** `hero.mp4` video arka planı + sinematik metin reveal efekti
- **Nav:** Hover dropdown ile 7 model direkt erişimi
- **Galeri:** Her model için 4–8 gerçek ürün fotoğrafı
- **Odoo Uyumlu:** `__manifest__.py` ile Odoo 19 tema modülü olarak kullanılabilir

---

## İletişim Bilgileri

| | |
|--|--|
| **Telefon** | +90 533 085 17 81 |
| **E-posta** | info@camppass.com |
| **Adres** | Orhaniye Mah. 2051 Cad. No: 15, Kahramankazan / Ankara / Türkiye |
| **Website** | [camppass.com](https://camppass.com) |
