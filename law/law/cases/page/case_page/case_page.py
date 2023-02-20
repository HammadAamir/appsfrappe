import frappe

@frappe.whitelist()
def total_cases():
    return frappe.db.sql("""SELECT count(name) as total FROM `tabCase Doctype` """, as_dict=True)[0].total

@frappe.whitelist()
def active_cases():
    return frappe.db.sql("""SELECT count(name) as total FROM `tabCase Doctype` where status='Pending' """, as_dict=True)[0].total

@frappe.whitelist()
def appealed_cases():
    return frappe.db.sql("""SELECT count(name) as total FROM `tabCase Doctype` where status='Draft' """, as_dict=True)[0].total

@frappe.whitelist()
def finished_cases():
    return frappe.db.sql("""SELECT count(name) as total FROM `tabCase Doctype` where status in ('Approved', 'Cancelled', 'Rejected') """, as_dict=True)[0].total

@frappe.whitelist()
def cases_won():
    return frappe.db.sql("""SELECT count(name) as total FROM `tabCase Doctype` where status='Approved' """, as_dict=True)[0].total
