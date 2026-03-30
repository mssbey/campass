# -*- coding: utf-8 -*-
{
    'name': 'Camppass Theme',
    'version': '16.0.1.0.0',
    'category': 'Theme',
    'summary': 'Premium cinematic dark theme for Camppass caravan website',
    'author': 'Camppass',
    'website': 'https://camppass.com',
    'license': 'LGPL-3',
    'depends': [
        'website',
    ],
    'data': [
        'views/assets.xml',
        'views/templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'caravan_theme/static/src/css/style.css',
            'caravan_theme/static/src/css/models-cinematic.css',
            'caravan_theme/static/src/css/corporate-cinematic.css',
            'caravan_theme/static/src/css/contact-cinematic.css',
            'caravan_theme/static/src/js/main.js',
            'caravan_theme/static/src/js/models-cinematic.js',
            'caravan_theme/static/src/js/corporate-cinematic.js',
            'caravan_theme/static/src/js/contact-cinematic.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
