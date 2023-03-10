import frappe
from datetime import date
import holidays
@frappe.whitelist()
def employee_data():
    for holiday in holidays.UnitedArabEmirates(years=[2023]).items():
        print(holiday)
    return frappe.db.sql("""SELECT full_name, title, type_of_job, name, profile_picture FROM `tabEmployee` ORDER BY type_of_job DESC""", as_dict=True)
