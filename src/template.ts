const testHtml = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
  body {
    background-color: white;
    border: 1px solid black;
    height: 96.5vh;
  }
  </style>
</head>

<Body>
  <p>
    <!-- It is a Paragraph tag for creating the paragraph -->
    <b> HTML </b> standss for <i> <u> Hyper Text Markup Language. </u> </i> It is used to create a web pages and
    applications. This language
    is easily understandable by the user and also be modifiable. It is actually a Markup language, hence it provides a
    flexible way for designing the
    web pages along with the text.
  </p>
  HTML file is made up of different elements. <b> An element </b> is a collection of <i> start tag, end tag, attributes
    and the text between them</i>.
  </p>
</Body>

</html>
`


const templateKwitansi = `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>A simple, clean, and responsive HTML invoice template</title>

		<style>
			.invoice-box {
				max-width: 800px;
				margin: auto;
        height: auto;
				padding: 30px;
				/* border: 1px solid #eee; */
				font-size: 16px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 0px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 0px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}

			/** RTL **/
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}

      .flex {
        display: flex
      }
      .flex-col {
        flex-direction: column;
      }
      .w-full {
        width: 100%
      }
      .px {
        margin-left:20px;
        margin-right:20px;
      }
      .float-right {
        float:right;
      }
      
      .text-right {
        text-align:right;
      }
      .h-full {
        height:100%;
      }
      .self-end {
        align-self:flex-end;
      }
      .flex-d {
        display: flex;
        justify-content:flex-end;
        padding-bottom:30px;
      }
      .red {
        background-color:red;
      }
		</style>
	</head>

	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0">
				<tr class="top">
					<td colspan="2">
						<table>
							<tr>
								<td class="title">
									<img src="logo.jpeg" style="height:80px;" />
								</td>

								<td>
									MT's Tarbiyatul Falah<br />
									Dibuat: {{tanggalDibuat}}<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="information">
					<td colspan="2">
						<table>
							<tr>
								<td>Nama</td> 
								<td>{{nama}}</td>
							</tr>
              <tr>
								<td>Kelas</td> 
								<td>{{kelas}}</td>
							</tr>
              <tr>
								<td>Tahun Ajaran</td> 
								<td>{{tahun}}</td>
							</tr>
						</table>
					</td>
				</tr>

				<!-- <tr class="heading">
					<td>Payment Method</td>

					<td>Check #</td>
				</tr>

				<tr class="details">
					<td>Check</td>

					<td>1000</td>
				</tr> -->

				<tr class="heading">
					<td>Jenis</td>

					<td>Harga</td>
				</tr>
        
        {{items}}

				<tr class="total">
					<td></td>

					<td>Total: Rp. {{total}}</td>
				</tr>
			</table>
      <div class="float-right w-full text-right flex-d">
        <br>
        <br>
        <br>
        <br>
        <label class="self-end">Tanda Tangan</label>
      </div>
		</div>
	</body>
</html>
`

const templateKwitansiItems = `
<tr class="item">
  <td>{{jenis}}</td>

  <td>Rp. {{harga}}</td>
</tr>
`


export { testHtml, templateKwitansi, templateKwitansiItems }