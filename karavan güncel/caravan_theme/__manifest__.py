# -*- coding: utf-8 -*-
{
    'name': 'Camppass Karavan Theme',
    'version': '17.0.1.0.0',
    'category': 'Theme/Creative',
    'summary': 'Premium cinematic dark theme for Camppass caravan website',
    'description': 'Full cinematic dark premium theme with scroll-driven model showcase, '
                   'corporate brand experience, contact smart forms, and responsive design.',
    'author': 'Camppass',
    'website': 'https://camppass.com',
    'license': 'LGPL-3',
    'depends': [
        'website',
    ],
    'data': [
        'views/assets.xml',
        'views/layout.xml',
        'views/header.xml',
        'views/footer.xml',
        'views/pages/home.xml',
        'views/pages/models.xml',
        'views/pages/model_detail.xml',
        'views/pages/service.xml',
        'views/pages/corporate.xml',
        'views/pages/news.xml',
        'views/pages/faq.xml',
        'views/pages/contact.xml',
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
