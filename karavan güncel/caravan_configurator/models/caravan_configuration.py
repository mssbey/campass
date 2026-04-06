# -*- coding: utf-8 -*-
import json
from odoo import models, fields, api


class CaravanConfiguration(models.Model):
    _name = 'caravan.configuration'
    _description = 'Caravan Configuration'
    _order = 'create_date desc'

    name = fields.Char(string='Configuration Reference', readonly=True, copy=False, default='New')
    model_id = fields.Many2one('caravan.model', string='Caravan Model', required=True, ondelete='cascade')
    option_ids = fields.Many2many('caravan.option', string='Selected Options')
    custom_color = fields.Char(string='Custom Color Hex')
    base_price = fields.Float(related='model_id.base_price', string='Base Price', store=True)
    options_price = fields.Float(string='Options Price', compute='_compute_prices', store=True)
    total_price = fields.Float(string='Total Price', compute='_compute_prices', store=True)
    timeline_json = fields.Text(string='Configuration Timeline', default='[]')
    session_id = fields.Char(string='Session ID')
    order_id = fields.Many2one('caravan.order', string='Order', ondelete='set null')

    @api.depends('option_ids', 'option_ids.price', 'base_price')
    def _compute_prices(self):
        for rec in self:
            rec.options_price = sum(rec.option_ids.mapped('price'))
            rec.total_price = rec.base_price + rec.options_price

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('name', 'New') == 'New':
                vals['name'] = self.env['ir.sequence'].next_by_code('caravan.configuration') or 'New'
        return super().create(vals_list)

    def get_timeline(self):
        self.ensure_one()
        try:
            return json.loads(self.timeline_json or '[]')
        except (json.JSONDecodeError, TypeError):
            return []

    def add_timeline_action(self, action_data):
        self.ensure_one()
        timeline = self.get_timeline()
        timeline.append(action_data)
        self.timeline_json = json.dumps(timeline)

    def get_public_data(self):
        self.ensure_one()
        return {
            'id': self.id,
            'name': self.name,
            'model': self.model_id.get_public_data(),
            'options': [opt.get_public_data() for opt in self.option_ids],
            'custom_color': self.custom_color or '',
            'base_price': self.base_price,
            'options_price': self.options_price,
            'total_price': self.total_price,
            'timeline': self.get_timeline(),
        }
