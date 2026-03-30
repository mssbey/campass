# -*- coding: utf-8 -*-
{
    'name': 'Camppass Premium Dark Theme',
    'version': '16.0.1.0.0',
    'category': 'Theme/Corporate',
    'summary': 'Premium cinematic dark-theme Camppass caravan website',
    'description': """
        Camppass Premium Dark Theme for Odoo 16 Website.
        - Cinematic dark luxury design
        - Glassmorphism effects
        - Smooth scroll animations via IntersectionObserver
        - Full responsive design
        - Model showcase with specs
        - Service & dealer locator
        - Corporate pages
        - News/Blog static cards
        - FAQ accordion
        - Contact forms
        - Hero video section
        - Snippet support
    """,
    'author': 'Camppass',
    'website': 'https://www.camppass.com',
    'license': 'LGPL-3',
    'depends': [
        'website',
    ],
    'data': [
        'views/layout.xml',
        'views/header.xml',
        'views/footer.xml',
        'views/homepage.xml',
        'views/models.xml',
        'views/model_detail.xml',
        'views/corporate.xml',
        'views/contact.xml',
        'views/service.xml',
        'views/faq.xml',
        'views/news.xml',
        'views/snippets.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'theme_camppass/static/src/css/style.css',
            'theme_camppass/static/src/css/models-cinematic.css',
            'theme_camppass/static/src/css/corporate-cinematic.css',
            'theme_camppass/static/src/css/contact-cinematic.css',
            'theme_camppass/static/src/js/main.js',
            'theme_camppass/static/src/js/models-cinematic.js',
            'theme_camppass/static/src/js/corporate-cinematic.js',
            'theme_camppass/static/src/js/contact-cinematic.js',
        ],
    },
    'images': [
        'static/description/banner.png',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
