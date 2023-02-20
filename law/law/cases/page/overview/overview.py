import frappe
from datetime import date
from datetime import timedelta
@frappe.whitelist()
def get_total_requests():
    return frappe.db.sql("""SELECT count(name) as total FROM `tabCase Doctype` where status='Draft' """, as_dict=True)[0].total

@frappe.whitelist()
def total_clients():
    return frappe.db.sql("""SELECT count(*) as total FROM `tabClient`""", as_dict=True)[0].total

@frappe.whitelist()
def successfull_cases():
    return frappe.db.sql("""SELECT count(name) as total FROM `tabCase Doctype` WHERE status='Approved'""", as_dict=True)[0].total

@frappe.whitelist()
def satisfied_clients():
    return frappe.db.sql("""SELECT DISTINCT first_name, middle_name, last_name FROM `tabClient` INNER JOIN `tabCase Doctype` ON `tabCase Doctype`.claimant = `tabClient`.name AND status ='Approved';""", as_dict=True)

@frappe.whitelist()
def new_clients():
    return frappe.db.sql("""SELECT DISTINCT first_name, middle_name, last_name FROM `tabClient` INNER JOIN `tabCase Doctype` ON `tabCase Doctype`.claimant = `tabClient`.name AND status ='Draft';""", as_dict=True)

@frappe.whitelist()
def status_chart():
    return frappe.db.sql("""SELECT COUNT(*), status FROM `tabCase Doctype` GROUP BY status;""")

@frappe.whitelist()
def status_chart_2():
    output = frappe.db.sql("""SELECT creation FROM `tabCase Doctype`""")
    today = date.today()
    output = list(output)
    lastDates = []
    for i in range(7):
        d = today - timedelta(days=i)
        lastDates.append(d)
    return [output, lastDates]
@frappe.whitelist()
def query_database(query):
    data = {'reply': 0}
    content = frappe.db.sql(f"""{query}""")
    data["reply"] = content
    return data