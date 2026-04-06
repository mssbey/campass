/**
 * Caravan Configurator UI Controller
 * Manages options panel, price calculation, timeline recording, order flow, PDF generation
 */
(function () {
    'use strict';

    /* ======================================================
       DATA (standalone demo mode �?" in Odoo these come from API)
       ====================================================== */
    const MODELS_DATA = [
        { id: 1, name: 'WS1', code: 'ws1', base_price: 1250000, description: 'Amiral gemimiz. 800W güne�Y paneli, ba�Yımsız �Yasi, tam off-grid ya�Yam.', specs: { solar_power: '800W', water_capacity: '245L', suspension: '280mm', max_incline: '35°', length: '4.8m', width: '2.2m', weight: '1850kg', capacity: '4 Ki�Yi' } },
        { id: 2, name: 'TS1', code: 'ts1', base_price: 980000, description: 'Kompakt ve güçlü. 600W güne�Y paneli, off-road performansı.', specs: { solar_power: '600W', water_capacity: '200L', suspension: '240mm', max_incline: '30°', length: '4.2m', width: '2.1m', weight: '1600kg', capacity: '3 Ki�Yi' } },
        { id: 3, name: 'CR555', code: 'cr555', base_price: 1450000, description: 'Off-road canavarı. 1000W güne�Y paneli, 300L su kapasitesi.', specs: { solar_power: '1000W', water_capacity: '300L', suspension: '320mm', max_incline: '40°', length: '5.2m', width: '2.3m', weight: '2100kg', capacity: '4 Ki�Yi' } },
        { id: 4, name: 'X1 PRO', code: 'x1pro', base_price: 2100000, description: 'Premium segmentin lideri. 1500W güne�Y, akıllı ev sistemi, tam lüks.', specs: { solar_power: '1500W', water_capacity: '400L', suspension: '350mm', max_incline: '45°', length: '5.8m', width: '2.4m', weight: '2400kg', capacity: '6 Ki�Yi' } },
    ];

    const OPTIONS_DATA = [
        { id: 1, name: 'Siyah', code: 'color_black', category: 'color', price: 0, color_hex: '#1a1a1a', is_default: true },
        { id: 2, name: 'Bej', code: 'color_beige', category: 'color', price: 1500, color_hex: '#C8B08C' },
        { id: 3, name: 'Askeri Ye�Yil', code: 'color_military', category: 'color', price: 2000, color_hex: '#4A5D23' },
        { id: 4, name: 'Beyaz', code: 'color_white', category: 'color', price: 1000, color_hex: '#E8E4DE' },
        { id: 10, name: 'Standart', code: 'wheel_standard', category: 'wheel', price: 0, is_default: true },
        { id: 11, name: 'Off-Road', code: 'wheel_offroad', category: 'wheel', price: 8500 },
        { id: 12, name: 'Premium Alloy', code: 'wheel_alloy', category: 'wheel', price: 12000 },
        { id: 20, name: 'Güne�Y Paneli', code: 'roof_solar', category: 'roof', price: 35000 },
        { id: 21, name: 'Tavan Bagajı', code: 'roof_rack', category: 'roof', price: 7500 },
        { id: 30, name: 'LED Şerit', code: 'light_led', category: 'lighting', price: 4500 },
        { id: 31, name: 'Spot I�Yıklar', code: 'light_spot', category: 'lighting', price: 6000 },
        { id: 40, name: 'Tente', code: 'side_awning', category: 'side', price: 15000 },
        { id: 41, name: 'Dı�Y Mekan Mutfa�Yı', code: 'side_kitchen', category: 'side', price: 22000 },
        { id: 50, name: 'Basic', code: 'interior_basic', category: 'interior', price: 0, is_default: true },
        { id: 51, name: 'Comfort', code: 'interior_comfort', category: 'interior', price: 45000 },
        { id: 52, name: 'Premium', code: 'interior_premium', category: 'interior', price: 85000 },
    ];

    const CATEGORY_LABELS = {
        color: 'Dı�Y Renk',
        wheel: 'Lastikler',
        roof: 'Tavan Sistemleri',
        lighting: 'Aydınlatma',
        side: 'Yan Aksesuarlar',
        interior: 'İç Mekan Paketi',
    };

    const CATEGORY_ICONS = {
        color: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><path d="M12 22c-4.97 0-9-2.69-9-6 0-2.69 3.17-3.2 5.5-1.5C10.17 16 11.5 16 12 16s1.83 0 3.5-1.5C17.83 12.8 21 13.31 21 16c0 3.31-4.03 6-9 6z"/></svg>',
        wheel: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>',
        roof: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
        lighting: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
        side: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>',
        interior: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    };

    /* ======================================================
       CONFIGURATOR UI
       ====================================================== */
    class ConfiguratorUI {
        constructor() {
            this.engine = null;
            this.selectedModel = null;
            this.selectedOptions = {};
            this.customColor = '';
            this.timeline = [];
            this.timelineStart = Date.now();
            this.isPlaying = false;

            this._bindModelSelect();
        }

        /* ---------- MODEL SELECT SCREEN ---------- */
        _bindModelSelect() {
            const grid = document.getElementById('modelSelectGrid');
            if (!grid) return;
            grid.innerHTML = '';

            MODELS_DATA.forEach(m => {
                const card = document.createElement('div');
                card.className = 'cfg-model-card';
                card.innerHTML = `
                    <div class="cfg-model-card-visual">
                        <div class="cfg-model-3d-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                            <span>3D</span>
                        </div>
                    </div>
                    <div class="cfg-model-card-info">
                        <h3>${m.name}</h3>
                        <p>${m.description}</p>
                        <div class="cfg-model-specs-mini">
                            <span>�s� ${m.specs.solar_power}</span>
                            <span>gY'� ${m.specs.water_capacity}</span>
                            <span>gY'� ${m.specs.capacity}</span>
                        </div>
                        <div class="cfg-model-price">�,�${m.base_price.toLocaleString('tr-TR')}</div>
                        <button class="cfg-btn cfg-btn-gold" data-model-id="${m.id}">Konfigüre Et</button>
                    </div>
                `;
                card.querySelector('button').addEventListener('click', () => this._selectModel(m));
                grid.appendChild(card);
            });
        }

        _selectModel(model) {
            this.selectedModel = model;
            this.selectedOptions = {};
            this.customColor = '';
            this.timeline = [];
            this.timelineStart = Date.now();

            // Set defaults
            OPTIONS_DATA.forEach(o => {
                if (o.is_default) this.selectedOptions[o.category] = o;
            });

            this._recordAction('model_select', { model: model.name });

            // Switch to configurator
            document.getElementById('screenModelSelect').style.display = 'none';
            document.getElementById('screenConfigurator').style.display = 'flex';
            document.getElementById('cfgModelName').textContent = model.name;

            // Init 3D
            if (this.engine) this.engine.dispose();
            this.engine = new window.CaravanEngine('viewer3d');

            this._buildOptionsPanel();
            this._updatePrice();
        }

        /* ---------- OPTIONS PANEL ---------- */
        _buildOptionsPanel() {
            const panel = document.getElementById('optionsPanel');
            panel.innerHTML = '';

            const categories = ['color', 'wheel', 'roof', 'lighting', 'side', 'interior'];

            categories.forEach(cat => {
                const opts = OPTIONS_DATA.filter(o => o.category === cat);
                if (!opts.length) return;

                const section = document.createElement('div');
                section.className = 'cfg-option-section';

                const isToggle = ['roof', 'lighting', 'side'].includes(cat);
                const isRadio = ['color', 'wheel', 'interior'].includes(cat);

                let headerHTML = `<div class="cfg-option-header">
                    <span class="cfg-option-icon">${CATEGORY_ICONS[cat] || ''}</span>
                    <h4>${CATEGORY_LABELS[cat]}</h4>
                </div>`;

                let bodyHTML = '<div class="cfg-option-body">';

                if (cat === 'color') {
                    bodyHTML += '<div class="cfg-color-grid">';
                    opts.forEach(o => {
                        const selected = this.selectedOptions.color && this.selectedOptions.color.code === o.code;
                        bodyHTML += `<button class="cfg-color-swatch ${selected ? 'active' : ''}" 
                            data-code="${o.code}" data-hex="${o.color_hex}" data-cat="color"
                            style="background:${o.color_hex}" title="${o.name}${o.price ? ' (+�,�' + o.price.toLocaleString('tr-TR') + ')' : ''}">
                            ${selected ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                        </button>`;
                    });
                    bodyHTML += '</div>';
                    // Custom color picker
                    bodyHTML += `<div class="cfg-custom-color">
                        <label>�-zel Renk</label>
                        <input type="color" id="customColorPicker" value="#555555"/>
                        <button class="cfg-btn-small" id="applyCustomColor">Uygula (+�,�5,000)</button>
                    </div>`;
                } else if (isRadio) {
                    opts.forEach(o => {
                        const selected = this.selectedOptions[cat] && this.selectedOptions[cat].code === o.code;
                        bodyHTML += `<label class="cfg-radio-option ${selected ? 'active' : ''}" data-code="${o.code}" data-cat="${cat}">
                            <div class="cfg-radio-dot ${selected ? 'checked' : ''}"></div>
                            <div class="cfg-radio-info">
                                <span class="cfg-radio-name">${o.name}</span>
                                <span class="cfg-radio-price">${o.price ? '+�,�' + o.price.toLocaleString('tr-TR') : 'Dahil'}</span>
                            </div>
                        </label>`;
                    });
                } else if (isToggle) {
                    opts.forEach(o => {
                        const checked = this.selectedOptions[o.code] ? true : false;
                        bodyHTML += `<label class="cfg-toggle-option" data-code="${o.code}" data-cat="${cat}">
                            <div class="cfg-toggle-info">
                                <span class="cfg-toggle-name">${o.name}</span>
                                <span class="cfg-toggle-price">+�,�${o.price.toLocaleString('tr-TR')}</span>
                            </div>
                            <div class="cfg-toggle-switch ${checked ? 'on' : ''}" data-code="${o.code}">
                                <div class="cfg-toggle-knob"></div>
                            </div>
                        </label>`;
                    });
                }

                bodyHTML += '</div>';
                section.innerHTML = headerHTML + bodyHTML;
                panel.appendChild(section);
            });

            this._bindOptionEvents();
        }

        _bindOptionEvents() {
            /* Color swatches */
            document.querySelectorAll('.cfg-color-swatch').forEach(btn => {
                btn.addEventListener('click', () => {
                    const code = btn.dataset.code;
                    const hex = btn.dataset.hex;
                    const opt = OPTIONS_DATA.find(o => o.code === code);
                    this.selectedOptions.color = opt;
                    this.customColor = '';
                    this.engine.setColor(hex);
                    this._recordAction('color_change', { name: opt.name, hex });
                    this._buildOptionsPanel();
                    this._updatePrice();
                });
            });

            /* Custom color */
            const applyBtn = document.getElementById('applyCustomColor');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    const picker = document.getElementById('customColorPicker');
                    this.customColor = picker.value;
                    this.selectedOptions.color = { id: 0, name: '�-zel: ' + picker.value, code: 'color_custom', category: 'color', price: 5000, color_hex: picker.value };
                    this.engine.setColor(picker.value);
                    this._recordAction('custom_color', { hex: picker.value });
                    this._buildOptionsPanel();
                    this._updatePrice();
                });
            }

            /* Radio options (wheel, interior) */
            document.querySelectorAll('.cfg-radio-option').forEach(label => {
                label.addEventListener('click', () => {
                    const code = label.dataset.code;
                    const cat = label.dataset.cat;
                    const opt = OPTIONS_DATA.find(o => o.code === code);
                    this.selectedOptions[cat] = opt;

                    if (cat === 'wheel') {
                        const type = code.replace('wheel_', '');
                        this.engine.setWheels(type);
                    } else if (cat === 'interior') {
                        const type = code.replace('interior_', '');
                        this.engine.setInterior(type);
                    }

                    this._recordAction('option_select', { category: cat, name: opt.name });
                    this._buildOptionsPanel();
                    this._updatePrice();
                });
            });

            /* Toggle options (roof, lighting, side) */
            document.querySelectorAll('.cfg-toggle-switch').forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const code = toggle.dataset.code;
                    const opt = OPTIONS_DATA.find(o => o.code === code);
                    const isOn = toggle.classList.toggle('on');

                    if (isOn) {
                        this.selectedOptions[code] = opt;
                    } else {
                        delete this.selectedOptions[code];
                    }

                    // Map code to engine accessory name
                    const accMap = {
                        'roof_solar': 'solar',
                        'roof_rack': 'rack',
                        'light_led': 'led',
                        'light_spot': 'spot',
                        'side_awning': 'awning',
                        'side_kitchen': 'kitchen',
                    };
                    if (accMap[code]) {
                        this.engine.toggleAccessory(accMap[code], isOn);
                    }

                    this._recordAction(isOn ? 'option_add' : 'option_remove', { name: opt.name });
                    this._updatePrice();
                });
            });
        }

        /* ---------- PRICE ---------- */
        _updatePrice() {
            let base = this.selectedModel.base_price;
            let optTotal = 0;
            const breakdown = [];

            Object.values(this.selectedOptions).forEach(opt => {
                if (opt && opt.price > 0) {
                    optTotal += opt.price;
                    breakdown.push({ name: opt.name, price: opt.price });
                }
            });

            const total = base + optTotal;

            document.getElementById('priceBase').textContent = '�,�' + base.toLocaleString('tr-TR');
            document.getElementById('priceOptions').textContent = optTotal > 0 ? '+�,�' + optTotal.toLocaleString('tr-TR') : '�,�0';
            document.getElementById('priceTotal').textContent = '�,�' + total.toLocaleString('tr-TR');

            const bd = document.getElementById('priceBreakdown');
            bd.innerHTML = breakdown.map(b => `<div class="cfg-price-line"><span>${b.name}</span><span>+�,�${b.price.toLocaleString('tr-TR')}</span></div>`).join('');
        }

        /* ---------- TIMELINE ---------- */
        _recordAction(type, data) {
            this.timeline.push({
                t: Date.now() - this.timelineStart,
                type,
                data,
            });
        }

        getTimeline() {
            return JSON.parse(JSON.stringify(this.timeline));
        }

        /* ---------- PLAYBACK ---------- */
        async playTimeline(timeline, speed) {
            speed = speed || 1;
            if (this.isPlaying) return;
            this.isPlaying = true;
            const statusEl = document.getElementById('playbackStatus');
            if (statusEl) statusEl.textContent = 'Oynatılıyor...';

            for (let i = 0; i < timeline.length; i++) {
                if (!this.isPlaying) break;
                const action = timeline[i];
                const delay = i === 0 ? 0 : (timeline[i].t - timeline[i - 1].t) / speed;
                await new Promise(r => setTimeout(r, Math.min(delay, 2000)));

                if (statusEl) statusEl.textContent = `[${i + 1}/${timeline.length}] ${action.type}: ${JSON.stringify(action.data)}`;

                switch (action.type) {
                    case 'color_change':
                    case 'custom_color':
                        this.engine.setColor(action.data.hex);
                        break;
                    case 'option_select':
                        if (action.data.category === 'wheel') {
                            const opt = OPTIONS_DATA.find(o => o.name === action.data.name && o.category === 'wheel');
                            if (opt) this.engine.setWheels(opt.code.replace('wheel_', ''));
                        }
                        break;
                    case 'option_add':
                        const accMapAdd = { 'Güne�Y Paneli': 'solar', 'Tavan Bagajı': 'rack', 'LED Şerit': 'led', 'Spot I�Yıklar': 'spot', 'Tente': 'awning', 'Dı�Y Mekan Mutfa�Yı': 'kitchen' };
                        if (accMapAdd[action.data.name]) this.engine.toggleAccessory(accMapAdd[action.data.name], true);
                        break;
                    case 'option_remove':
                        const accMapRm = { 'Güne�Y Paneli': 'solar', 'Tavan Bagajı': 'rack', 'LED Şerit': 'led', 'Spot I�Yıklar': 'spot', 'Tente': 'awning', 'Dı�Y Mekan Mutfa�Yı': 'kitchen' };
                        if (accMapRm[action.data.name]) this.engine.toggleAccessory(accMapRm[action.data.name], false);
                        break;
                }
            }
            this.isPlaying = false;
            if (statusEl) statusEl.textContent = 'Tamamlandı';
        }

        stopPlayback() {
            this.isPlaying = false;
        }

        /* ---------- PDF GENERATION ---------- */
        generatePDF() {
            const screenshot = this.engine.captureScreenshot();
            const model = this.selectedModel;
            const opts = Object.values(this.selectedOptions).filter(o => o);
            let base = model.base_price;
            let optTotal = opts.reduce((s, o) => s + (o.price || 0), 0);

            const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Konfigürasyon - ${model.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#222;padding:40px;max-width:800px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #F5A623;padding-bottom:20px;margin-bottom:30px}
.logo{font-size:28px;font-weight:900;letter-spacing:3px}.logo span{color:#F5A623}
.date{color:#888;font-size:13px}
.preview{text-align:center;margin:24px 0}
.preview img{max-width:100%;border-radius:12px;border:2px solid #eee}
.section{margin:24px 0}
.section h2{font-size:18px;color:#F5A623;border-bottom:1px solid #eee;padding-bottom:8px;margin-bottom:12px}
table{width:100%;border-collapse:collapse}
table td{padding:8px 12px;border-bottom:1px solid #f0f0f0}
table td:last-child{text-align:right;font-weight:600}
.total-row{background:#f8f5ee;font-size:18px;font-weight:800}
.total-row td{border-top:2px solid #F5A623;padding:14px 12px}
.footer{margin-top:40px;text-align:center;color:#aaa;font-size:12px}
</style></head><body>
<div class="header"><div class="logo">KARA<span>VAN</span></div><div class="date">${new Date().toLocaleDateString('tr-TR')}</div></div>
<div class="preview"><img src="${screenshot}" alt="3D Preview"/></div>
<div class="section"><h2>Model Bilgisi</h2><table>
<tr><td>Model</td><td>${model.name}</td></tr>
<tr><td>Açıklama</td><td>${model.description}</td></tr>
</table></div>
<div class="section"><h2>Seçilen Opsiyonlar</h2><table>
${opts.map(o => `<tr><td>${CATEGORY_LABELS[o.category] || o.category} �?" ${o.name}</td><td>${o.price > 0 ? '+�,�' + o.price.toLocaleString('tr-TR') : 'Dahil'}</td></tr>`).join('')}
</table></div>
<div class="section"><h2>Fiyat �-zeti</h2><table>
<tr><td>Baz Fiyat</td><td>�,�${base.toLocaleString('tr-TR')}</td></tr>
<tr><td>Opsiyonlar</td><td>+�,�${optTotal.toLocaleString('tr-TR')}</td></tr>
<tr class="total-row"><td>TOPLAM</td><td>�,�${(base + optTotal).toLocaleString('tr-TR')}</td></tr>
</table></div>
<div class="footer">Bu belge CAMPPASS konfigüratör sistemi tarafından otomatik olu�Yturulmu�Ytur.<br/>© 2026 Camppass. Tüm hakları saklıdır.</div>
</body></html>`;

            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CAMPPASS_${model.name}_Konfigurasyon.html`;
            a.click();
            URL.revokeObjectURL(url);
            this._recordAction('pdf_download', { model: model.name });
        }

        /* ---------- ORDER ---------- */
        showOrderForm() {
            document.getElementById('orderModal').classList.add('visible');
            document.getElementById('orderModelName').textContent = this.selectedModel.name;
            document.getElementById('orderTotalPrice').textContent = document.getElementById('priceTotal').textContent;
        }

        hideOrderForm() {
            document.getElementById('orderModal').classList.remove('visible');
        }

        submitOrder() {
            const name = document.getElementById('orderName').value.trim();
            const phone = document.getElementById('orderPhone').value.trim();
            const email = document.getElementById('orderEmail').value.trim();
            const notes = document.getElementById('orderNotes').value.trim();

            if (!name || !phone || !email) {
                alert('Lütfen tüm zorunlu alanları doldurun.');
                return;
            }

            this._recordAction('order_submit', { name, email });

            // Build order data
            const orderData = {
                model: this.selectedModel,
                options: Object.values(this.selectedOptions).filter(o => o),
                customColor: this.customColor,
                timeline: this.getTimeline(),
                customer: { name, phone, email, notes },
                total: document.getElementById('priceTotal').textContent,
            };

            // In Odoo, this would POST to /configurator/api/place_order
            console.log('ORDER DATA:', orderData);

            this.hideOrderForm();
            document.getElementById('orderSuccess').classList.add('visible');

            // Generate ref number
            const ref = 'ORD-' + String(Math.floor(10000 + Math.random() * 90000));
            document.getElementById('orderRefNumber').textContent = ref;
        }

        /* ---------- BACK ---------- */
        backToModels() {
            if (this.engine) { this.engine.dispose(); this.engine = null; }
            document.getElementById('screenConfigurator').style.display = 'none';
            document.getElementById('screenModelSelect').style.display = 'block';
        }
    }

    /* ======================================================
       INIT ON DOM READY
       ====================================================== */
    function init() {
        const ui = new ConfiguratorUI();
        window._cfgUI = ui;

        /* Bind global buttons */
        const btnBack = document.getElementById('btnBack');
        if (btnBack) btnBack.addEventListener('click', () => ui.backToModels());

        const btnPDF = document.getElementById('btnPDF');
        if (btnPDF) btnPDF.addEventListener('click', () => ui.generatePDF());

        const btnOrder = document.getElementById('btnOrder');
        if (btnOrder) btnOrder.addEventListener('click', () => ui.showOrderForm());

        const btnOrderClose = document.getElementById('btnOrderClose');
        if (btnOrderClose) btnOrderClose.addEventListener('click', () => ui.hideOrderForm());

        const btnOrderSubmit = document.getElementById('btnOrderSubmit');
        if (btnOrderSubmit) btnOrderSubmit.addEventListener('click', () => ui.submitOrder());

        const btnOrderSuccessClose = document.getElementById('btnOrderSuccessClose');
        if (btnOrderSuccessClose) btnOrderSuccessClose.addEventListener('click', () => {
            document.getElementById('orderSuccess').classList.remove('visible');
        });

        /* Reset camera */
        const btnReset = document.getElementById('btnResetCam');
        if (btnReset) btnReset.addEventListener('click', () => { if (ui.engine) ui.engine.resetCamera(); });

        /* Playback demo */
        const btnPlayback = document.getElementById('btnPlayback');
        if (btnPlayback) {
            btnPlayback.addEventListener('click', () => {
                const tl = ui.getTimeline();
                if (tl.length < 2) { alert('Henüz yeterli aksiyon kaydedilmedi.'); return; }
                ui.playTimeline(tl, 3);
            });
        }

        /* Timeline export */
        const btnExportTimeline = document.getElementById('btnExportTimeline');
        if (btnExportTimeline) {
            btnExportTimeline.addEventListener('click', () => {
                const data = JSON.stringify(ui.getTimeline(), null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'camppass_config_timeline.json';
                a.click();
                URL.revokeObjectURL(url);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
