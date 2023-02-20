
frappe.pages['top-employee-page'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: '',
			custom_page: true
		});
		this.make();
	},


	make: function(){
		let me = $(this);
		let employee_data = function(){
			
		}
		$(frappe.render_template("top_employee_page", this)).appendTo(this.page.main)
		employee_data();
	}

})

