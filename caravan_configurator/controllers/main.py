# -*- coding: utf-8 -*-
import json
import uuid
from odoo import http
from odoo.http import request


class CaravanConfiguratorController(http.Controller):

    @http.route('/configurator', type='http', auth='public', website=True)
    def configurator_page(self, **kwargs):
        models = request.env['caravan.model'].sudo().search([('active', '=', True)])
        return request.render('caravan_configurator.configurator_page', {
            'caravan_models': models,
        })

    @http.route('/configurator/api/models', type='json', auth='public', methods=['POST'])
    def api_get_models(self):
        models = request.env['caravan.model'].sudo().search([('active', '=', True)])
        return [m.get_public_data() for m in models]

    @http.route('/configurator/api/options', type='json', auth='public', methods=['POST'])
    def api_get_options(self, model_id=None):
        domain = [('active', '=', True)]
        if model_id:
            model = request.env['caravan.model'].sudo().browse(int(model_id))
            if model.exists() and model.option_ids:
                domain.append(('id', 'in', model.option_ids.ids))
        options = request.env['caravan.option'].sudo().search(domain)
        return [o.get_public_data() for o in options]

    @http.route('/configurator/api/save_config', type='json', auth='public', methods=['POST'])
    def api_save_config(self, model_id, option_ids, custom_color='', timeline=None):
        session_id = str(uuid.uuid4())
        config = request.env['caravan.configuration'].sudo().create({
            'model_id': int(model_id),
            'option_ids': [(6, 0, [int(i) for i in option_ids])],
            'custom_color': custom_color,
            'timeline_json': json.dumps(timeline or []),
            'session_id': session_id,
        })
        return config.get_public_data()

    @http.route('/configurator/api/place_order', type='json', auth='public', methods=['POST'])
    def api_place_order(self, config_id, customer_name, customer_phone, customer_email, customer_notes=''):
        config = request.env['caravan.configuration'].sudo().browse(int(config_id))
        if not config.exists():
            return {'error': 'Configuration not found'}
        order = request.env['caravan.order'].sudo().create({
            'configuration_id': config.id,
            'customer_name': customer_name,
            'customer_phone': customer_phone,
            'customer_email': customer_email,
            'customer_notes': customer_notes,
        })
        config.order_id = order.id
        return {
            'success': True,
            'order_name': order.name,
            'order_id': order.id,
        }

    @http.route('/configurator/api/config/<int:config_id>', type='json', auth='public', methods=['POST'])
    def api_get_config(self, config_id):
        config = request.env['caravan.configuration'].sudo().browse(config_id)
        if not config.exists():
            return {'error': 'Configuration not found'}
        return config.get_public_data()
