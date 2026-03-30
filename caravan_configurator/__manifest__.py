# -*- coding: utf-8 -*-
{
    'name': 'Camppass 3D Configurator & Order System',
    'version': '16.0.1.0.0',
    'category': 'Website',
    'summary': 'Tesla-like 3D Camppass configurator with live preview, pricing, and order system',
    'description': """
        Full 3D Camppass configurator featuring:
        - Three.js powered real-time 3D preview
        - Exterior color, wheels, roof, lighting, accessories, interior customization
        - Live price calculation
        - Configuration timeline recording & playback
        - Auto PDF generation
        - Full order system with Odoo backend
        - Admin panel for orders, configs, pricing rules
    """,
    'author': 'Camppass',
    'website': 'https://www.example.com',
    'license': 'LGPL-3',
    'depends': [
        'website',
        'mail',
    ],
    'data': [
        'security/ir.model.access.csv',
        'data/caravan_data.xml',
        'views/configurator_template.xml',
        'views/admin_views.xml',
        'views/menu.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'caravan_configurator/static/src/css/configurator.css',
            'caravan_configurator/static/src/js/configurator_engine.js',
            'caravan_configurator/static/src/js/configurator_ui.js',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
}
