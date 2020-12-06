const dateFormat = require('dateformat');

//Link button hrefs
//const buildings_link_href = global.env.APP_BASE_URL + 'app/buildings';


/**
 * Config
 */
const config = require('../../config.js');

// Global style for all emails
style = ``;

const error_email = function (err, req) {
	return new Promise((resolve, reject) => {
		try {
			let style = `
				table {
					width: 100%;
					height: 100%;
				}

				table, th, td {
					border: 1px solid black;
					border-collapse: collapse;
					padding: 10px;
					text-align: left;
				}

				td {
					vertical-align:top;
				}

			`
			let email =
				` 
				<html>
					<head>
						<style>${style}</style>
					</head>
					<body>
						<table>
							<tr>
								<td><b>Error Message</b></td>
								<td>${err.message}</td>
							</tr>
							<tr>
								<td><b>Error</b></td>
								<td>${create_object_table(err)}</td>
							</tr>
							<tr>
								<td><b>Error Stack Trace</b></td>
								<td>${err.stack}</td>
							</tr>
							<tr>
								<td><b>User</b></td>
								<td>${req.session.user}</td>
							</tr>
							<tr>
								<td><b>Request Referer</b></td>
								<td>${req.headers.referer}</td>
							</tr>
							<tr>
								<td><b>Request Path</b></td>
								<td>${req.path}</td>
							</tr>
							<tr>
								<td><b>Request Method</b></td>
								<td>${req.method}</td>
							</tr>
							<tr>
								<td><b>Request Body</b></td>
								<td>${create_object_table(req.body)}</td>
							</tr>
						</table>
					</body>
				</html>
			`
			return resolve(email);
		}
		catch (err) {
			return reject(err)
		}
	})
}

const function_error_email = function (err, functionName) {
	return new Promise((resolve, reject) => {
		try {
			let style = `
				table {
					width: 100%;
					height: 100%;
				}

				table, th, td {
					border: 1px solid black;
					border-collapse: collapse;
					padding: 10px;
					text-align: left;
				}

				td {
					vertical-align:top;
				}

			`
			let email =
				` 
				<html>
					<head>
						<style>${style}</style>
					</head>
					<body>
						<h3>An error occurred within a Redbook application function</h3>
						<table>
							<tr>
								<td><b>Function Name</b></td>
								<td>${functionName}</td>
							</tr>
							<tr>
								<td><b>Error Message</b></td>
								<td>${err.message}</td>
							</tr>
							<tr>
								<td><b>Error</b></td>
								<td>${create_object_table(err)}</td>
							</tr>
							<tr>
								<td><b>Error Stack Trace</b></td>
								<td>${err.stack}</td>
							</tr>
						</table>
					</body>
				</html>
			`
			return resolve(email);
		}
		catch (err) {
			return reject(err)
		}
	})
}


function create_object_table(object) {
	let table = '';
	let rows = '';
	let row = '';

	if (object && !(Object.keys(object).length === 0)) {
		for (var key in object) {
			if (typeof object[key] === 'object' && object[key] !== null) {
				row = `<tr><td><b>${key}</b></td><td>${create_object_table(object[key])}</td></tr>`
			}

			else {
				row = `<tr><td><b>${key}</b></td><td>${object[key]}</td></tr>`
			}
			rows += row;


		}
		table = '<table>' + rows + '</table>'
	}

	return table;
}

module.exports = { error_email, function_error_email};
