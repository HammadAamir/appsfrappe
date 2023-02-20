// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt


frappe.provide("erpnext.projects");

frappe.ui.form.on("Task", {
	setup: function (frm) {
		frm.make_methods = {
			'Timesheet': () => frappe.model.open_mapped_doc({
				method: 'erpnext.projects.doctype.task.task.make_timesheet',
				frm: frm
			})
		}
	},

	onload: function (frm) {
		let urlParams = document.URL.split('?')
		if (urlParams.length > 0){
			const paramString = urlParams[1]
			
			let queryString = new URLSearchParams(paramString);
			let key, val;
			for (let pair of queryString.entries()){
				key = pair[0]
				val = pair[1]
			}
			
			let row = frm.add_child('task_employees', {
				employee: val
			});
			frm.refresh_field('task_employees');
		}

		console.log(frm.doc.task_employees)
		frm.set_query("task", "depends_on", function () {
			let filters = {
				name: ["!=", frm.doc.name]
			};
			if (frm.doc.project) filters["project"] = frm.doc.project;
			return {
				filters: filters
			};
		})

		frm.set_query("parent_task", function () {
			let filters = {
				"is_group": 1,
				"name": ["!=", frm.doc.name]
			};
			if (frm.doc.project) filters["project"] = frm.doc.project;
			return {
				filters: filters
			}
		});
	},

	is_group: function (frm) {
		frappe.call({
			method: "erpnext.projects.doctype.task.task.check_if_child_exists",
			args: {
				name: frm.doc.name
			},
			callback: function (r) {
				if (r.message.length > 0) {
					let message = __('Cannot convert Task to non-group because the following child Tasks exist: {0}.',
						[r.message.join(", ")]
					);
					frappe.msgprint(message);
					frm.reload_doc();
				}
			}
		})
	},

	validate: function (frm) {
		frm.doc.project && frappe.model.remove_from_locals("Project",
			frm.doc.project);
	}
});
