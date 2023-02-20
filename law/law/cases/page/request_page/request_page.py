import frappe

@frappe.whitelist()
def employee_data():
    output = {}
    output["data"] = frappe.db.sql("""SELECT * FROM `tabCase Doctype` WHERE status='Draft'""", as_dict=True)

    if frappe.session.user == "Administrator":
        output["user"] = True
    else: 
        output["user"] = False
    return output
@frappe.whitelist()
def update_doc(updatedStatus, docName):
    doc = frappe.db.sql("""UPDATE `tabCase Doctype` SET status='{}' WHERE name='{}'""".format(updatedStatus, docName))
    return doc