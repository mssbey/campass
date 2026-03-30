# -*- coding: utf-8 -*-
from odoo import models, fields, api


class CaravanOrder(models.Model):
    _name = 'caravan.order'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _description = 'Caravan Order'
    _order = 'create_date desc'

    name = fields.Char(string='Order Reference', readonly=True, copy=False, default='New')
    state = fields.Selection([
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('production', 'In Production'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ], string='Status', default='draft', tracking=True)

    # Customer info
    customer_name = fields.Char(string='Customer Name', required=True, tracking=True)
    customer_phone = fields.Char(string='Customer Phone', required=True)
    customer_email = fields.Char(string='Customer Email', required=True)
    customer_notes = fields.Text(string='Customer Notes')

    # Configuration
    configuration_id = fields.Many2one('caravan.configuration', string='Configuration', ondelete='restrict')
    model_id = fields.Many2one('caravan.model', related='configuration_id.model_id', store=True, string='Caravan Model')
    total_price = fields.Float(related='configuration_id.total_price', store=True, string='Total Price')
    config_summary = fields.Text(string='Configuration Summary', compute='_compute_config_summary', store=True)

    @api.depends('configuration_id', 'configuration_id.option_ids')
    def _compute_config_summary(self):
        for rec in self:
            if rec.configuration_id:
                lines = [f"Model: {rec.configuration_id.model_id.name}"]
                for opt in rec.configuration_id.option_ids:
                    cat_label = dict(opt._fields['category'].selection).get(opt.category, opt.category)
                    lines.append(f"  {cat_label}: {opt.name} (+${opt.price:,.0f})")
                lines.append(f"\nBase: ${rec.configuration_id.base_price:,.0f}")
                lines.append(f"Options: ${rec.configuration_id.options_price:,.0f}")
                lines.append(f"TOTAL: ${rec.configuration_id.total_price:,.0f}")
                rec.config_summary = '\n'.join(lines)
            else:
                rec.config_summary = ''

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('name', 'New') == 'New':
                vals['name'] = self.env['ir.sequence'].next_by_code('caravan.order') or 'New'
        return super().create(vals_list)

    def action_confirm(self):
        self.write({'state': 'confirmed'})

    def action_production(self):
        self.write({'state': 'production'})

    def action_ready(self):
        self.write({'state': 'ready'})

    def action_deliver(self):
        self.write({'state': 'delivered'})

    def action_cancel(self):
        self.write({'state': 'cancelled'})

    def action_draft(self):
        self.write({'state': 'draft'})
