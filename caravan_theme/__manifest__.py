# -*- coding: utf-8 -*-
{
    'name': 'Camppass Premium Dark Theme',
    'version': '16.0.1.0.0',
    'category': 'Theme/Corporate',
    'summary': 'Premium cinematic dark-theme corporate Camppass website',
    'description': """
        A Tesla-level premium Camppass caravan website experience with:
        - Cinematic dark luxury design
        - Glassmorphism effects
        - Smooth GSAP-style animations
        - Full responsive design
        - Model showcase with specs
        - Service & dealer locator
        - Corporate pages
        - Blog/News integration
        - FAQ accordion
        - Contact forms
    """,
    'author': 'Camppass',
    'website': 'https://www.example.com',
    'license': 'LGPL-3',
    'depends': [
        'website',
        'website_blog',
    ],
    'data': [
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
    'images': [
        'static/description/banner.png',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
