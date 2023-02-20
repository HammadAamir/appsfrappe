
frappe.pages['annual-calendar-page'].on_page_load = function(wrapper) {
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
		$(frappe.render_template("annual_calendar_page", this)).appendTo(this.page.main)
	}

})

