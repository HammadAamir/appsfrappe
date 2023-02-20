# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import date

class Vacation(Document):
	def before_save(self):
		if self.start_date > self.end_date:
			frappe.throw("Please input the correct end date.")
		start_year, start_month, start_day = map(int, self.start_date.split("-"))
		end_year, end_month, end_day = map(int, self.end_date.split("-"))
		delta = date(end_year, end_month, end_day) - date(start_year, start_month, start_day)
		self.days = delta.days