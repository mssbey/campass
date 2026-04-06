# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request


class CamppassWebsite(http.Controller):

    @http.route('/', type='http', auth='public', website=True, sitemap=True)
    def homepage(self, **kw):
        return request.render('caravan_theme.page_home')

    @http.route('/modeller', type='http', auth='public', website=True, sitemap=True)
    def models_page(self, **kw):
        return request.render('caravan_theme.page_models')

    @http.route('/model/<string:model_slug>', type='http', auth='public', website=True, sitemap=True)
    def model_detail(self, model_slug='cr550', **kw):
        return request.render('caravan_theme.page_model_detail', {
            'model_slug': model_slug,
        })

    @http.route('/servis', type='http', auth='public', website=True, sitemap=True)
    def service_page(self, **kw):
        return request.render('caravan_theme.page_service')

    @http.route('/kurumsal', type='http', auth='public', website=True, sitemap=True)
    def corporate_page(self, **kw):
        return request.render('caravan_theme.page_corporate')

    @http.route('/haberler', type='http', auth='public', website=True, sitemap=True)
    def news_page(self, **kw):
        return request.render('caravan_theme.page_news')

    @http.route('/sss', type='http', auth='public', website=True, sitemap=True)
    def faq_page(self, **kw):
        return request.render('caravan_theme.page_faq')

    @http.route('/iletisim', type='http', auth='public', website=True, sitemap=True)
    def contact_page(self, **kw):
        return request.render('caravan_theme.page_contact')
