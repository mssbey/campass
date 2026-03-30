/**
 * Caravan 3D Configurator Engine
 * Three.js powered real-time 3D caravan preview
 * Generates procedural caravan model with swappable parts
 */
(function () {
    'use strict';

    /* ======================================================
       THREE.JS SCENE MANAGER
       ====================================================== */
    class CaravanEngine {
        constructor(container) {
            this.container = typeof container === 'string' ? document.getElementById(container) : container;
            if (!this.container) return;
            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.controls = null;
            this.animId = null;
            this.caravan = null;
            this.parts = {};
            this.currentColor = '#1a1a1a';
            this.currentWheelType = 'standard';
            this.currentInterior = 'basic';
            this.accessories = { solar: false, rack: false, led: false, spot: false, awning: false, kitchen: false };
            this._resizeBound = this._onResize.bind(this);
            this._init();
        }

        _init() {
            const W = this.container.clientWidth || 800;
            const H = this.container.clientHeight || 500;

            /* Scene */
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x0a0b0f);
            this.scene.fog = new THREE.Fog(0x0a0b0f, 18, 35);

            /* Camera */
            this.camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
            this.camera.position.set(6, 3.5, 8);

            /* Renderer */
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(W, H);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.1;
            this.renderer.outputColorSpace = THREE.SRGBColorSpace;
            this.container.appendChild(this.renderer.domElement);

            /* Orbit Controls */
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.06;
            this.controls.minDistance = 4;
            this.controls.maxDistance = 18;
            this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
            this.controls.target.set(0, 0.8, 0);
            this.controls.update();

            /* Lights */
            this._setupLights();

            /* Ground */
            this._createGround();

            /* Caravan */
            this._buildCaravan();

            /* Events */
            window.addEventListener('resize', this._resizeBound);

            /* Animate */
            this._animate();
        }

        _setupLights() {
            const amb = new THREE.AmbientLight(0xffffff, 0.35);
            this.scene.add(amb);

            const hemi = new THREE.HemisphereLight(0x8899bb, 0x222233, 0.5);
            this.scene.add(hemi);

            const dir = new THREE.DirectionalLight(0xfff5e6, 1.8);
            dir.position.set(5, 8, 6);
            dir.castShadow = true;
            dir.shadow.mapSize.set(2048, 2048);
            dir.shadow.camera.near = 0.5;
            dir.shadow.camera.far = 25;
            dir.shadow.camera.left = -8;
            dir.shadow.camera.right = 8;
            dir.shadow.camera.top = 8;
            dir.shadow.camera.bottom = -8;
            dir.shadow.bias = -0.0005;
            this.scene.add(dir);

            const rim = new THREE.DirectionalLight(0xaabbff, 0.6);
            rim.position.set(-4, 4, -6);
            this.scene.add(rim);

            /* Gold accent light */
            const accent = new THREE.PointLight(0xF5A623, 0.4, 12);
            accent.position.set(0, 4, 0);
            this.scene.add(accent);
        }

        _createGround() {
            const geo = new THREE.CircleGeometry(15, 64);
            const mat = new THREE.MeshStandardMaterial({
                color: 0x0d0e12,
                roughness: 0.9,
                metalness: 0.1,
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.y = -0.01;
            mesh.receiveShadow = true;
            this.scene.add(mesh);

            /* Grid ring */
            const ringGeo = new THREE.RingGeometry(3.5, 3.52, 64);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xF5A623, opacity: 0.15, transparent: true, side: THREE.DoubleSide });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = 0.005;
            this.scene.add(ring);
        }

        /* ======================================================
           PROCEDURAL CARAVAN BUILDER
           ====================================================== */
        _buildCaravan() {
            this.caravan = new THREE.Group();

            /* --- BODY --- */
            const bodyMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(this.currentColor),
                roughness: 0.25,
                metalness: 0.7,
                envMapIntensity: 1.2,
            });

            // Main body (rounded box shape)
            const bodyGeo = this._roundedBox(3.8, 1.8, 1.9, 0.15, 4);
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.set(0, 1.2, 0);
            body.castShadow = true;
            body.receiveShadow = true;
            this.parts.body = body;
            this.caravan.add(body);

            // Front cap (slight angle)
            const frontGeo = new THREE.BoxGeometry(0.15, 1.5, 1.7);
            const front = new THREE.Mesh(frontGeo, bodyMat);
            front.position.set(1.95, 1.2, 0);
            front.castShadow = true;
            this.parts.front = front;
            this.caravan.add(front);

            /* --- WINDOWS --- */
            const winMat = new THREE.MeshPhysicalMaterial({
                color: 0x1a2535,
                roughness: 0.05,
                metalness: 0.1,
                transmission: 0.6,
                thickness: 0.1,
                ior: 1.5,
                opacity: 0.8,
                transparent: true,
            });

            // Side windows
            [0.6, -0.3, -1.2].forEach((x, i) => {
                const wGeo = new THREE.BoxGeometry(0.6, 0.5, 0.05);
                const w1 = new THREE.Mesh(wGeo, winMat);
                w1.position.set(x, 1.7, 0.96);
                this.caravan.add(w1);
                const w2 = new THREE.Mesh(wGeo, winMat);
                w2.position.set(x, 1.7, -0.96);
                this.caravan.add(w2);
            });

            // Front windshield
            const wfGeo = new THREE.BoxGeometry(0.05, 0.7, 1.4);
            const wf = new THREE.Mesh(wfGeo, winMat);
            wf.position.set(2.0, 1.7, 0);
            this.caravan.add(wf);

            /* --- DOOR --- */
            const doorMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.6 });
            const doorGeo = new THREE.BoxGeometry(0.7, 1.3, 0.06);
            const door = new THREE.Mesh(doorGeo, doorMat);
            door.position.set(-0.5, 1.0, 0.97);
            door.castShadow = true;
            this.caravan.add(door);

            // Door handle
            const handleMat = new THREE.MeshStandardMaterial({ color: 0xF5A623, roughness: 0.2, metalness: 0.9 });
            const handleGeo = new THREE.BoxGeometry(0.15, 0.04, 0.04);
            const handle = new THREE.Mesh(handleGeo, handleMat);
            handle.position.set(-0.5, 1.1, 1.0);
            this.caravan.add(handle);

            /* --- CHASSIS & FRAME --- */
            const chassisMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.7 });
            const chassisGeo = new THREE.BoxGeometry(4.2, 0.15, 1.6);
            const chassis = new THREE.Mesh(chassisGeo, chassisMat);
            chassis.position.set(0, 0.2, 0);
            chassis.castShadow = true;
            this.caravan.add(chassis);

            // A-frame hitch
            const hitchMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.8 });
            const hitchGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8);
            const hitch1 = new THREE.Mesh(hitchGeo, hitchMat);
            hitch1.rotation.z = Math.PI / 2;
            hitch1.position.set(2.8, 0.3, 0.25);
            this.caravan.add(hitch1);
            const hitch2 = hitch1.clone();
            hitch2.position.set(2.8, 0.3, -0.25);
            this.caravan.add(hitch2);
            // Hitch ball
            const ballGeo = new THREE.SphereGeometry(0.08, 12, 12);
            const ball = new THREE.Mesh(ballGeo, hitchMat);
            ball.position.set(3.5, 0.3, 0);
            this.caravan.add(ball);

            /* --- WHEELS (standard) --- */
            this._buildWheels('standard');

            /* --- ACCESSORIES (all hidden initially) --- */
            this._buildSolarPanel();
            this._buildRoofRack();
            this._buildLedStrip();
            this._buildSpotLights();
            this._buildAwning();
            this._buildOutdoorKitchen();

            /* --- TRIM / DETAILS --- */
            // Gold accent line along body
            const trimMat = new THREE.MeshStandardMaterial({ color: 0xF5A623, roughness: 0.2, metalness: 0.9 });
            const trimGeo = new THREE.BoxGeometry(3.6, 0.03, 0.03);
            const trim1 = new THREE.Mesh(trimGeo, trimMat);
            trim1.position.set(0, 0.85, 0.96);
            this.caravan.add(trim1);
            const trim2 = trim1.clone();
            trim2.position.set(0, 0.85, -0.96);
            this.caravan.add(trim2);

            // Rear bumper
            const bumperGeo = new THREE.BoxGeometry(0.1, 0.4, 1.7);
            const bumper = new THREE.Mesh(bumperGeo, chassisMat);
            bumper.position.set(-1.96, 0.5, 0);
            this.caravan.add(bumper);

            // Tail lights
            const tlMat = new THREE.MeshStandardMaterial({ color: 0xFF2222, roughness: 0.3, metalness: 0.5, emissive: 0xFF2222, emissiveIntensity: 0.5 });
            const tlGeo = new THREE.BoxGeometry(0.05, 0.15, 0.3);
            const tl1 = new THREE.Mesh(tlGeo, tlMat);
            tl1.position.set(-2.01, 0.7, 0.6);
            this.caravan.add(tl1);
            const tl2 = tl1.clone();
            tl2.position.set(-2.01, 0.7, -0.6);
            this.caravan.add(tl2);

            this.scene.add(this.caravan);
        }

        _roundedBox(w, h, d, r, s) {
            const shape = new THREE.Shape();
            const hw = w / 2 - r, hh = h / 2 - r;
            shape.moveTo(-hw, -h / 2);
            shape.lineTo(hw, -h / 2);
            shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -hh);
            shape.lineTo(w / 2, hh);
            shape.quadraticCurveTo(w / 2, h / 2, hw, h / 2);
            shape.lineTo(-hw, h / 2);
            shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, hh);
            shape.lineTo(-w / 2, -hh);
            shape.quadraticCurveTo(-w / 2, -h / 2, -hw, -h / 2);
            const extSettings = { depth: d, bevelEnabled: true, bevelThickness: r * 0.3, bevelSize: r * 0.3, bevelSegments: s };
            const geo = new THREE.ExtrudeGeometry(shape, extSettings);
            geo.center();
            return geo;
        }

        /* ---------- WHEELS ---------- */
        _buildWheels(type) {
            // Remove existing
            ['wFL', 'wFR', 'wRL', 'wRR'].forEach(k => {
                if (this.parts[k]) { this.caravan.remove(this.parts[k]); this.parts[k].geometry.dispose(); }
            });

            const positions = [
                { key: 'wFL', x: 1.2, z: 0.95 },
                { key: 'wFR', x: 1.2, z: -0.95 },
                { key: 'wRL', x: -1.2, z: 0.95 },
                { key: 'wRR', x: -1.2, z: -0.95 },
            ];

            let tireR, tireT, rimR, rimColor, tireColor;
            switch (type) {
                case 'offroad':
                    tireR = 0.38; tireT = 0.22; rimR = 0.18; rimColor = 0x444444; tireColor = 0x1a1a1a;
                    break;
                case 'alloy':
                    tireR = 0.3; tireT = 0.16; rimR = 0.2; rimColor = 0xCCCCCC; tireColor = 0x111111;
                    break;
                default:
                    tireR = 0.32; tireT = 0.18; rimR = 0.16; rimColor = 0x555555; tireColor = 0x141414;
            }

            const tireMat = new THREE.MeshStandardMaterial({ color: tireColor, roughness: 0.9, metalness: 0.1 });
            const rimMat = new THREE.MeshStandardMaterial({ color: rimColor, roughness: 0.2, metalness: 0.9 });

            positions.forEach(p => {
                const group = new THREE.Group();

                // Tire
                const tireGeo = new THREE.TorusGeometry(tireR, tireT, 16, 32);
                const tire = new THREE.Mesh(tireGeo, tireMat);
                tire.castShadow = true;
                group.add(tire);

                // Rim
                const rimGeo = new THREE.CylinderGeometry(rimR, rimR, tireT * 1.8, type === 'alloy' ? 6 : 16);
                const rim = new THREE.Mesh(rimGeo, rimMat);
                rim.rotation.x = Math.PI / 2;
                group.add(rim);

                // Hub
                const hubGeo = new THREE.CylinderGeometry(0.04, 0.04, tireT * 2.2, 8);
                const hub = new THREE.Mesh(hubGeo, new THREE.MeshStandardMaterial({ color: 0xF5A623, roughness: 0.3, metalness: 0.9 }));
                hub.rotation.x = Math.PI / 2;
                group.add(hub);

                if (type === 'alloy') {
                    // Spoke details
                    for (let i = 0; i < 5; i++) {
                        const spokeGeo = new THREE.BoxGeometry(rimR * 1.6, 0.015, 0.02);
                        const spoke = new THREE.Mesh(spokeGeo, rimMat);
                        spoke.rotation.z = (Math.PI * 2 / 5) * i;
                        spoke.position.z = tireT * 0.1;
                        group.add(spoke);
                    }
                }

                if (type === 'offroad') {
                    // Tread blocks
                    for (let i = 0; i < 12; i++) {
                        const angle = (Math.PI * 2 / 12) * i;
                        const treadGeo = new THREE.BoxGeometry(0.06, 0.04, 0.04);
                        const tread = new THREE.Mesh(treadGeo, tireMat);
                        tread.position.set(Math.cos(angle) * (tireR + tireT * 0.7), Math.sin(angle) * (tireR + tireT * 0.7), 0);
                        tread.rotation.z = angle;
                        group.add(tread);
                    }
                }

                group.rotation.x = Math.PI / 2;
                group.position.set(p.x, tireR + 0.03, p.z);
                group.castShadow = true;
                this.parts[p.key] = group;
                this.caravan.add(group);
            });

            this.currentWheelType = type;
        }

        /* ---------- SOLAR PANEL ---------- */
        _buildSolarPanel() {
            const g = new THREE.Group();
            const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a2244, roughness: 0.3, metalness: 0.6 });
            const frameMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 });

            const panel = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.04, 1.2), panelMat);
            panel.position.y = 0;
            g.add(panel);

            // Grid lines on panel
            const lineMat = new THREE.MeshBasicMaterial({ color: 0x334488 });
            for (let i = -3; i <= 3; i++) {
                const l = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.005), lineMat);
                l.position.set(0, 0, i * 0.17);
                g.add(l);
            }

            // Frame
            const fGeo = new THREE.BoxGeometry(2.1, 0.06, 0.04);
            const f1 = new THREE.Mesh(fGeo, frameMat); f1.position.set(0, 0, 0.62); g.add(f1);
            const f2 = f1.clone(); f2.position.set(0, 0, -0.62); g.add(f2);
            const fGeo2 = new THREE.BoxGeometry(0.04, 0.06, 1.28);
            const f3 = new THREE.Mesh(fGeo2, frameMat); f3.position.set(1.05, 0, 0); g.add(f3);
            const f4 = f3.clone(); f4.position.set(-1.05, 0, 0); g.add(f4);

            g.position.set(0, 2.15, 0);
            g.visible = false;
            this.parts.solar = g;
            this.caravan.add(g);
        }

        /* ---------- ROOF RACK ---------- */
        _buildRoofRack() {
            const g = new THREE.Group();
            const mat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.4, metalness: 0.8 });

            // Rails
            const railGeo = new THREE.BoxGeometry(3.4, 0.05, 0.05);
            const r1 = new THREE.Mesh(railGeo, mat); r1.position.set(0, 0, 0.7); g.add(r1);
            const r2 = r1.clone(); r2.position.set(0, 0, -0.7); g.add(r2);

            // Cross bars
            for (let i = -1; i <= 1; i++) {
                const cGeo = new THREE.BoxGeometry(0.05, 0.05, 1.5);
                const c = new THREE.Mesh(cGeo, mat);
                c.position.set(i * 1.2, 0, 0);
                g.add(c);
            }

            // Legs
            const legGeo = new THREE.BoxGeometry(0.04, 0.1, 0.04);
            [[-1.7, 0.7], [-1.7, -0.7], [1.7, 0.7], [1.7, -0.7]].forEach(([x, z]) => {
                const leg = new THREE.Mesh(legGeo, mat);
                leg.position.set(x, -0.05, z);
                g.add(leg);
            });

            g.position.set(0, 2.18, 0);
            g.visible = false;
            this.parts.rack = g;
            this.caravan.add(g);
        }

        /* ---------- LED STRIP ---------- */
        _buildLedStrip() {
            const g = new THREE.Group();
            const mat = new THREE.MeshStandardMaterial({ color: 0xFFEECC, emissive: 0xFFDDAA, emissiveIntensity: 0.8, roughness: 0.3 });

            // Under-body LED strips
            const stripGeo = new THREE.BoxGeometry(3.4, 0.02, 0.04);
            const s1 = new THREE.Mesh(stripGeo, mat); s1.position.set(0, 0.28, 0.85); g.add(s1);
            const s2 = s1.clone(); s2.position.set(0, 0.28, -0.85); g.add(s2);

            // LED point lights
            const led1 = new THREE.PointLight(0xFFDDAA, 0.6, 3);
            led1.position.set(0, 0.3, 0.85);
            g.add(led1);
            const led2 = new THREE.PointLight(0xFFDDAA, 0.6, 3);
            led2.position.set(0, 0.3, -0.85);
            g.add(led2);

            g.visible = false;
            this.parts.led = g;
            this.caravan.add(g);
        }

        /* ---------- SPOT LIGHTS ---------- */
        _buildSpotLights() {
            const g = new THREE.Group();
            const mat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, roughness: 0.3, metalness: 0.8 });
            const lensMat = new THREE.MeshStandardMaterial({ color: 0xFFFFEE, emissive: 0xFFFFDD, emissiveIntensity: 0.6 });

            [[1.5, 0.65], [1.5, -0.65]].forEach(([x, z]) => {
                const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.12, 12), mat);
                housing.rotation.x = Math.PI / 2;
                housing.position.set(x, 2.15, z);
                g.add(housing);
                const lens = new THREE.Mesh(new THREE.CircleGeometry(0.07, 12), lensMat);
                lens.position.set(x, 2.15, z > 0 ? z + 0.06 : z - 0.06);
                lens.rotation.y = z > 0 ? 0 : Math.PI;
                g.add(lens);
            });

            // Spot light
            const spot = new THREE.SpotLight(0xFFFFDD, 0.8, 8, Math.PI / 6);
            spot.position.set(1.5, 2.15, 0);
            spot.target.position.set(4, 0, 0);
            g.add(spot);
            g.add(spot.target);

            g.visible = false;
            this.parts.spot = g;
            this.caravan.add(g);
        }

        /* ---------- AWNING ---------- */
        _buildAwning() {
            const g = new THREE.Group();

            const canvasMat = new THREE.MeshStandardMaterial({
                color: 0x8B7355,
                roughness: 0.8,
                metalness: 0.1,
                side: THREE.DoubleSide,
            });
            const poleMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 });

            // Canvas
            const canvasGeo = new THREE.PlaneGeometry(2.5, 1.8);
            const canvas = new THREE.Mesh(canvasGeo, canvasMat);
            canvas.rotation.x = -Math.PI / 2 + 0.15;
            canvas.position.set(0, 1.6, 1.8);
            canvas.castShadow = true;
            g.add(canvas);

            // Support poles
            const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.6, 8);
            [[-1.0, 2.4], [1.0, 2.4]].forEach(([x, z]) => {
                const pole = new THREE.Mesh(poleGeo, poleMat);
                pole.position.set(x, 0.8, z);
                g.add(pole);
            });

            // Arms
            const armGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
            [[-1.0], [1.0]].forEach(([x]) => {
                const arm = new THREE.Mesh(armGeo, poleMat);
                arm.rotation.x = Math.PI / 2 - 0.15;
                arm.position.set(x, 1.65, 1.7);
                g.add(arm);
            });

            g.visible = false;
            this.parts.awning = g;
            this.caravan.add(g);
        }

        /* ---------- OUTDOOR KITCHEN ---------- */
        _buildOutdoorKitchen() {
            const g = new THREE.Group();
            const mat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.4, metalness: 0.7 });
            const topMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.2, metalness: 0.8 });

            // Counter
            const counter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.5), mat);
            counter.position.set(-1.0, 0.4, 1.3);
            counter.castShadow = true;
            g.add(counter);

            // Counter top
            const top = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.04, 0.55), topMat);
            top.position.set(-1.0, 0.82, 1.3);
            g.add(top);

            // Burners
            const burnerMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.6 });
            [[-1.2, 1.3], [-0.8, 1.3]].forEach(([x, z]) => {
                const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), burnerMat);
                burner.position.set(x, 0.85, z);
                g.add(burner);
                const grate = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.008, 4, 12), burnerMat);
                grate.rotation.x = Math.PI / 2;
                grate.position.set(x, 0.87, z);
                g.add(grate);
            });

            g.visible = false;
            this.parts.kitchen = g;
            this.caravan.add(g);
        }

        /* ======================================================
           PUBLIC API
           ====================================================== */

        setColor(hex) {
            this.currentColor = hex;
            const color = new THREE.Color(hex);
            if (this.parts.body) this.parts.body.material.color.copy(color);
            if (this.parts.front) this.parts.front.material.color.copy(color);
        }

        setWheels(type) {
            this._buildWheels(type);
        }

        toggleAccessory(name, visible) {
            this.accessories[name] = visible;
            if (this.parts[name]) {
                this.parts[name].visible = visible;
            }
        }

        setInterior(type) {
            this.currentInterior = type;
            // Visual indicator: adjust window tint based on package
            // (In production, this would swap interior mesh)
        }

        captureScreenshot() {
            this.renderer.render(this.scene, this.camera);
            return this.renderer.domElement.toDataURL('image/png');
        }

        resetCamera() {
            this.camera.position.set(6, 3.5, 8);
            this.controls.target.set(0, 0.8, 0);
            this.controls.update();
        }

        dispose() {
            window.removeEventListener('resize', this._resizeBound);
            if (this.animId) cancelAnimationFrame(this.animId);
            this.renderer.dispose();
            this.scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                    else obj.material.dispose();
                }
            });
        }

        /* ======================================================
           PRIVATE
           ====================================================== */
        _animate() {
            this.animId = requestAnimationFrame(() => this._animate());
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        }

        _onResize() {
            const W = this.container.clientWidth;
            const H = this.container.clientHeight;
            this.camera.aspect = W / H;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(W, H);
        }
    }

    /* Export globally */
    window.CaravanEngine = CaravanEngine;
})();
