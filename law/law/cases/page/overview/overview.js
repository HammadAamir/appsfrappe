
frappe.pages['overview'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Overview',
			custom_page: true
		});
		this.make();
		$("#casesButton").click(() => {
			frappe.route_options = {}
			frappe.set_route(`/app/case-doctype`);
		});	
		$("#total_clients_card").click(() => {
			frappe.route_options = {}
			frappe.set_route(`/app/case-doctype`);
		});		
		$("#satisfied_clients_card").click(() => {
			let value = $("#satisfied_clients")[0].getAttribute("data-items");
			var obj = JSON.parse(value);
			obj = this.parseObject(obj)
			frappe.route_options = obj;
			frappe.set_route(`/app/client`);
		});
		$("#successfull_cases_card").click(() => {
			
			frappe.route_options = {
				status: `Approved`
			}
			frappe.set_route(`/app/case-doctype`);
		});
		$("#total_requests_card").click(() => {

			frappe.route_options = {
				status: `Draft`
			}
			frappe.set_route(`/app/case-doctype`);
		});
		
		$("#new_clients_card").click(() => {

			let value = $("#new_clients")[0].getAttribute("data-items");
			
			var obj = JSON.parse(value);
			obj = this.parseObject(obj)
			frappe.route_options = obj;
			frappe.set_route(`/app/client`);
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
		const compareArrays = (arr1, arr2) => {
			const result = {};
		  
			//loop through first array, add each string as a key and set value to 0
			arr1.forEach(str => {
			  result[str] = 0;
			});
		  
			//loop through second array, if string is already in object, add 1, else set value to 0
			arr2.forEach(str => {
			  if (result[str] !== undefined) {
				result[str] += 1;
			  } else {
				result[str] = 1;
			  }
			});
		  
			return result;
		  };
		let status_chart = function(){
			
			frappe.call({
				method: "law.cases.page.overview.overview.status_chart_2", //dotted path to server method
				callback: function(r) {
					let status = []
					let values = []
					let dataset = []
					let caseTimes = r.message[0].map(val => val[0].split(" ")[0]);
					console.log(caseTimes)
					let output = compareArrays(r.message[1], caseTimes)
					// r.message.forEach((item, i) => {
					// 	values.push(item[0])
					// 	status.push(item[1])
					// 	dataset.push({name: item[1], chartType:'bar', values: [item[0]]})
					// })
					console.log(dataset)
					
					let chart = new frappe.Chart( "#frost-chart", { // or DOM element
						data: {
							labels: Object.keys(output),
							datasets: [
								{
									values: Object.values(output),
									chartType: 'line',
								},
							],
						},
						title: "Cases Data",
						type: 'axis-mixed',
						lineOptions: {
							dotSize: 8, // default: 4,
							regionFill: 1
						},
						height: 300,
						colors: ['lightblue', "blue"],
						axisOptions: {
							xAxisMode: "tick",
							xIsSeries: true
						  },
						  barOptions: {
							spaceRatio: 0.5
						  },
						  tooltipOptions: {
							formatTooltipX: (d) => (d + "").toUpperCase(),
							formatTooltipY: (d) => d + " pts"
						  }
					  });					
					// let chart = new frappe.Chart( "#frost-chart", { // or DOM element
					// 	data: {
					// 	labels: status,
					
					// 	datasets: [{
					// 		chartType: 'bar',
					// 		values: values
					// 	}],
					
					// 	},
					
					// 	title: "Cases",
					// 	type: 'bar', // or 'bar', 'line', 'pie', 'percentage'
					// 	height: 300,
					// 	colors: ['light-blue', '#ffa3ef', 'purple']
					//   });
				}
			});
		}
		let total_clients = function(){
			frappe.call({
				method: "law.cases.page.overview.overview.total_clients", //dotted path to server method
				callback: function(r) {
					$("#total_clients")[0].innerText = r.message;
				}
			});
		}
		
		
		let satisfied_clients = function(){
			frappe.call({
				method: "law.cases.page.overview.overview.satisfied_clients", //dotted path to server method
				callback: function(r) {
					$("#satisfied_clients")[0].innerText = r.message.length;
					$("#satisfied_clients")[0].setAttribute("data-items", JSON.stringify(r.message))
				}
			});
		}
		
		let successfull_cases = function(){
			frappe.call({
				method: "law.cases.page.overview.overview.successfull_cases", //dotted path to server method
				callback: function(r) {
					$("#successfull_cases")[0].innerText = r.message;
				}
			});
		}
		

		let total_requests = function(){
			frappe.call({
				method: "law.cases.page.overview.overview.get_total_requests", //dotted path to server method
				callback: function(r) {
					$("#total_requests")[0].innerText = r.message;
				}
			});
		}
		

		let new_clients = function(){
			frappe.call({
				method: "law.cases.page.overview.overview.new_clients", //dotted path to server method
				callback: function(r) {
					$("#new_clients")[0].innerText = r.message.length;
					
					$("#new_clients")[0].setAttribute("data-items", JSON.stringify(r.message))
				}
			});
		}

		let main_chart = function(){
		}

		function makeQuery(){
			recent_cases_query = "SELECT client, case_number, description, start_date, status FROM `tabCase Doctype` ORDER BY modified DESC LIMIT 5"
			
			frappe.call({
				method: "law.cases.page.overview.overview.query_database", //dotted path to server method
				args: {query: recent_cases_query},
				callback: function(r) {
					$("#queryResult")[0].innerText = JSON.stringify(r.message.reply)	
					makeTable(r.message.reply)
					console.log(r.message["reply"])
				}
			});
		}
		
		function makeTable(queryData){
			let datatable = new DataTable('#queryResult', {
				columns: ['Client', 'Case Number', 'Case Description', 'Beginning Date', 'Status'],
				data: queryData,
				layout: "fluid",
			});
		}

		$(frappe.render_template("overview", this)).appendTo(this.page.main)

		total_clients();
		satisfied_clients();
		successfull_cases();
		total_requests();
		new_clients();
		main_chart();
		status_chart();
		makeQuery();
	}

})
