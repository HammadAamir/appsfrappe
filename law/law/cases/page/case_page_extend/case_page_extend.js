
frappe.pages['case-page-extend'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Case Details',
			single_column: false,
			custom_page: true
		});
		this.parent = wrapper;
		this.page = this.parent.page;
		// this.page.sidebar.html(
		// 	`<ul class="standard-sidebar leaderboard-sidebar overlay-sidebar"></ul>`
		// );
		// this.$sidebar_list = this.page.sidebar.find("ul");
		this.make();

		
	},

	make: function(){
		let me = $(this);
		let finalData = null
		let data = frappe.route_options.case
		let context = {}
		frappe.call({
			method: "law.cases.page.case_page_extend.case_page_extend.case_data",
			args: {case_data: data},
			callback: function(r) {
				// clean_emp_data = r.message
				console.log(r.message)
				context['data'] = r.message[0][0]
				context['file'] = r.message[1][0]
			},
			async: false
		});
		context['title'] = data
		$(frappe.render_template('case_page_extend', context)).appendTo(this.page.main)
	}

})

