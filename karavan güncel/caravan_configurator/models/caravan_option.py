# -*- coding: utf-8 -*-
from odoo import models, fields


class CaravanOption(models.Model):
    _name = 'caravan.option'
    _description = 'Caravan Configuration Option'
    _order = 'category, sequence, id'

    name = fields.Char(string='Option Name', required=True)
    code = fields.Char(string='Option Code', required=True)
    category = fields.Selection([
        ('color', 'Exterior Color'),
        ('wheel', 'Wheels'),
        ('roof', 'Roof System'),
        ('lighting', 'Lighting'),
        ('side', 'Side Accessories'),
        ('interior', 'Interior Package'),
    ], string='Category', required=True)
    price = fields.Float(string='Additional Price', default=0)
    sequence = fields.Integer(default=10)
    active = fields.Boolean(default=True)
    description = fields.Text(string='Description')
    color_hex = fields.Char(string='Color Hex', help='Hex color code for color options')
    mesh_name = fields.Char(string='3D Mesh Name', help='Name of mesh to toggle/swap in 3D model')
    is_default = fields.Boolean(string='Is Default', default=False)

    def get_public_data(self):
        self.ensure_one()
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'category': self.category,
            'price': self.price,
            'description': self.description or '',
            'color_hex': self.color_hex or '',
            'mesh_name': self.mesh_name or '',
            'is_default': self.is_default,
        }
