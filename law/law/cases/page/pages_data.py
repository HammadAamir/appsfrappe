import frappe
import json
import os
@frappe.whitelist()
def get_sidebar_data():
    sidebarFile = os.getcwd()
    
    if frappe.session.user == "Administrator":
        sidebarFile += "/assets/law/sidebar.json"
    else:
        sidebarFile += "/assets/law/sidebar_head.json"
        
    file = open(sidebarFile)
    data = json.load(file)   
    return data['sidebar']