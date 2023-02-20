# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Employee(Document):
	
	def before_insert(self):
		if not self.naming_series.startswith("HTLawyer-emp-"):
			frappe.msgprint("No head team lawyer")
			return
  
		name = self.full_name.split(" ")
		first_name = name[0]
		last_name = name[0]
		if len(name) > 1:
			last_name = name[1]
		frappe.msgprint("""Insert into `tabUser`(first_name, last_name, email) values ({}, {}, {})""".format(self.email_1, first_name, last_name))
		user = frappe.db.sql("""Insert into `tabUser`(name, first_name, last_name, email) values ('{}', '{}', '{}', '{}')""".format(self.full_name, first_name, last_name, self.email_1))		
		print(user)
		frappe.msgprint("""{} done.""".format(user))