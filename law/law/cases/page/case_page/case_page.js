
frappe.pages['case-page'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Case Homepage',
			custom_page: true
		});
		this.make();
		$("#casesButton").click(() => {
			frappe.route_options = {}
			frappe.set_route(`/app/case-doctype/new-case-doctype-1`);
		});	
		$("#total_cases_card").click(() => {
			
			frappe.set_route(`/app/case-doctype`);
		});
		$("#active_cases_card").click(() => {
			frappe.route_options = {
				'status': 'Pending'
			}
			frappe.set_route(`/app/case-doctype`);
		});
		$("#appealed_cases_card").click(() => {
			frappe.route_options = {
				'status': 'Draft'
			}
			frappe.set_route(`/app/case-doctype`);
		});
		$("#finished_cases_card").click(() => {
			frappe.route_options = {
				'status': ['in', ['Approved', 'Rejected', 'Cancelled']]
			}
			frappe.set_route(`/app/case-doctype`);
		});
		$("#cases_won_card").click(() => {
			frappe.route_options = {
				'status': 'Approved'
			}
			frappe.set_route(`/app/case-doctype`);
		});
	},

	parseObject: function(value){
		let parseToObject=function(value){
			output = value.reduce((r, o) => {
				Object.entries(o).forEach(([k, v]) => {
					if (k in r) {
						r[k][1].push(v);
					} else {
						r[k] = ["in", []];
						r[k][1].push(v)
					}
				});
				return r;
			}, {});
			console.log(output)
			return output;
		} 
		return parseToObject(value);
	},

	make: function(){
		let me = $(this);
		let datatable;
		let total_cases = function(){
			frappe.call({
				method: "law.cases.page.case_page.case_page.total_cases", //dotted path to server method
				callback: function(r) {
					$("#total_cases")[0].innerText = r.message;
				}
			});
		}
		let active_cases = function(){
			frappe.call({
				method: "law.cases.page.case_page.case_page.active_cases", //dotted path to server method
				callback: function(r) {
					$("#active_cases")[0].innerText = r.message;
				}
			});
		}
		let appealed_cases = function(){
			frappe.call({
				method: "law.cases.page.case_page.case_page.appealed_cases", //dotted path to server method
				callback: function(r) {
					$("#appealed_cases")[0].innerText = r.message;
				}
			});
		}
		let finished_cases = function(){
			frappe.call({
				method: "law.cases.page.case_page.case_page.finished_cases", //dotted path to server method
				callback: function(r) {
					$("#finished_cases")[0].innerText = r.message;
				}
			});
		}
		let cases_won = function(){
			frappe.call({
				method: "law.cases.page.case_page.case_page.cases_won", //dotted path to server method
				callback: function(r) {
					$("#cases_won")[0].innerText = r.message;
				}
			});
		}
		function makeQuery(){
			recent_cases_query = "SELECT client, case_number, description, start_date, status FROM `tabCase Doctype` ORDER BY modified DESC"
			
			frappe.call({
				method: "law.cases.page.overview.overview.query_database", //dotted path to server method
				args: {query: recent_cases_query},
				callback: function(r) {
					$("#queryResult")[0].innerText = JSON.stringify(r.message.reply)	
					makeTable(r.message.reply)
					console.log(r.message["reply"])
				},
			});
		}
		
		function makeTable(queryData){
			datatable = new DataTable('#queryResult', {
				columns: ['Client', 'Case Number', 'Case Description', 'Beginning Date', 'Status'],
				data: queryData,
				layout: "fluid",
			});
			console.log(datatable)

		}
		setTimeout(()=>{
			heads = datatable.options.columns
			
			$table = $(document).find(".dt-scrollable")
			allRows = $table.find("div.dt-row")
			$table.on("click", "div.dt-row", (e) => {		
				let $row = $(e.currentTarget);
				// let tableTop = $table.find("div.dt-row-header")
				
				heads.unshift("")
				let cells = $row.find(".dt-cell")
				console.log(cells)
				let values = Object.entries(cells).flatMap((value, _)=>{
					return value[1].innerText != undefined ? value[1].innerText : []
				})
				// let values = String($row.outerText).split("\n")
				console.log(heads)
				location.href=`case-page-extend?case=${values[2]}`
				
			})
		}, 3000)
		$(frappe.render_template("case_page", this)).appendTo(this.page.main)

		total_cases();
		active_cases();
		appealed_cases();
		finished_cases();
		cases_won();
		makeQuery();
	}

})

