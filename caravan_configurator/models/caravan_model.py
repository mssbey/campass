# -*- coding: utf-8 -*-
from odoo import models, fields, api


class CaravanModel(models.Model):
    _name = 'caravan.model'
    _description = 'Caravan Model'
    _order = 'sequence, id'

    name = fields.Char(string='Model Name', required=True)
    code = fields.Char(string='Model Code', required=True)
    sequence = fields.Integer(default=10)
    active = fields.Boolean(default=True)
    base_price = fields.Float(string='Base Price', required=True)
    description = fields.Text(string='Description')
    image = fields.Binary(string='Image')
    glb_file = fields.Char(string='GLB File Path', help='Path to GLB 3D model file in static folder')

    # Specs
    solar_power = fields.Char(string='Solar Power')
    water_capacity = fields.Char(string='Water Capacity')
    suspension = fields.Char(string='Suspension')
    max_incline = fields.Char(string='Max Incline')
    length = fields.Char(string='Length')
    width = fields.Char(string='Width')
    weight = fields.Char(string='Weight')
    capacity = fields.Char(string='Capacity')

    option_ids = fields.Many2many('caravan.option', string='Available Options')
    configuration_ids = fields.One2many('caravan.configuration', 'model_id', string='Configurations')

    def get_public_data(self):
        self.ensure_one()
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'base_price': self.base_price,
            'description': self.description or '',
            'glb_file': self.glb_file or '',
            'specs': {
                'solar_power': self.solar_power or '',
                'water_capacity': self.water_capacity or '',
                'suspension': self.suspension or '',
                'max_incline': self.max_incline or '',
                'length': self.length or '',
                'width': self.width or '',
                'weight': self.weight or '',
                'capacity': self.capacity or '',
            },
        }
