import moment from 'moment';
// ===== PdfKit variables
const dpi = 72;
const options = {
	size: 'A4',
	dpi: dpi, // dots per inch
	logoHeight: 60, // 3 cm
	logoWidth: 60,
	margins: {
		top: 36,
		left: 36,
		right: 36,
		bottom: 72
	},
	maxItemWidth: function (doc) {
		return doc.page.width - doc.page.margins.left - doc.page.margins.right;
	},
	maxItemHeight: function (doc) {
		return doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
	},
	maxSignatureWidth: function (doc) {
		return 500; // weird number.
	},
	labelWidth: 20,
	signatureWidthPercent: 1.0,
	fieldValueIndent: 40,
	exclusionProperties: [
		'dateAdded',
		'__proto__'],
	addImagesToPDF: true,
	fontSize: {
		h1: 26,
		h2: 22,
		h3: 18,
		h4: 12,
		normal: 10,
		small: 8
	},
	indent: 15,
	colors: {
		strokeDefaultColor: "#525659",
		titleColor: "#000",
		helpTextColor: "#525659",
		textColor: "#000"
	},
	documentSizeLimit: '10mb'
};
const PDFDocument = require('pdfkit');
// ===== NodeMailer variables
const Nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
let auth, transport;

// ===== Utilities
const utils = {
	logDebugEnabled: true,
	logInfoEnabled: true,
	testOnStartup: (process.env.PRESTART_TEST_ON_STARTUP === "true"),
	inDevelopment: function () {
		return (process.env.NODE_ENV === "development");
	},
	logDebug: function (message) {
		if (utils.logDebugEnabled && utils.inDevelopment()) {
			utils.log(message);
		}
	},
	logInfo: function (message) {
		if (utils.logInfoEnabled) {
			utils.log(message);
		}
	},
	log: function (message) {
		console.log(message);
	},
	cloneAndRename: function (obj, renames) {
		let clone = {};
		Object.keys(obj).forEach(function (key) {
			if (renames[key] !== undefined) {
				clone[renames[key]] = obj[key];
			} else {
				clone[key] = obj[key];
			}
		});
		return clone;
	}
	
};
// ===== AWS S3 variables
const AWS = require('aws-sdk');
let bucketName, s3;

// ===== Filesystem variables
const fs = Npm.require('fs');
const meteor_root = fs.realpathSync(process.cwd() + '/../'); // where on the filesystem are we?
const assets_folder = meteor_root + '/server/assets/';

/**
 * @param {PDFDocument} doc
 * @param {Object} currentDoc - the data
 * @param {String} pdfType - Recipe, inventory, ingredients...etc.
 * @param {String} name - username
 * @returns {Object} PDF document
 */
let buildDocument = function (doc, currentDoc, pdfType, name) {
	
	// Internal way of keeping track of previous doc.y value
	let pointerY = 0;
	// keep track of our indentation level. Each "object" will increment by 1 for its own content and then decrement by 1.
	let indentLevel = 0;
	
	// ======= >HEADER START< ========
	
	// ====== title =========
	// doc.fontSize(options.fontSize.h1);
	// doc.text(data.title, doc.x + options.logoWidth + 5, pointerY);
	// doc.fontSize(options.fontSize.normal);
	//
	// // ====== line separation
	// doc.moveDown(0.2);
	// doc.moveTo(doc.page.margins.left, doc.y)
	// 		.lineTo((doc.page.width - doc.page.margins.right), doc.y)
	// 		.stroke();
	// doc.moveDown(0.2);
	// doc.x = doc.page.margins.left;
	//
	// doc.text(name, doc.x + options.logoWidth + 5, pointerY);
	//
	// // ====== >HEADER END - CONTENT START< =======
	//
	// doc.moveDown();
	
	// ====== render properties
	//  loop through all top-level properties, rendering each one (unless explicitly excluded)
	for (let propname in currentDoc) {
		if (options.exclusionProperties.indexOf(propname) === -1) { // not in the exclusion list
			// include it if it has a title.
			if (currentDoc[propname]) {
				if (typeof currentDoc[propname] === "object") {
					if (Array.isArray( currentDoc[propname] )) {
						doc.text(propname);
						doc.moveDown();
						currentDoc[propname].forEach(function (arrayElement) {
							doc.text(arrayElement);
							doc.moveDown();
						})
					}
				} else {
					doc.text(propname + ": " + currentDoc[propname]);
					doc.moveDown();
				}
			}
		}
	}
	// Reset the font size
	doc.fontSize(options.fontSize.normal);

	
	/**
	 * determines whether the proposed image needs a new page to render at the desired image height.
	 * @param imageHeight - the height of the proposed image
	 * @param doc - the current document (containing a 'y' coordinate denoting the current position, a page.height and
	 * page.margins.top and bottom)
	 * @return {Boolean} true if a new page is needed
	 */
	function needNewPageForImage(imageHeight, doc) {
		return ((doc.y + imageHeight) > (doc.page.height - doc.page.margins.bottom));
	}
};

Meteor.startup(() => {
	// auth = {
	// 	auth: {
	// 		api_key: GetMeteorSettingsValue("emailConfig.apiKey"),
	// 		domain: GetMeteorSettingsValue("emailConfig.apiDomain")
	// 	}
	// };
	
	// transport = Nodemailer.createTransport(mg(auth));
	
	// AWS.config.update(GetMeteorSettingsValue('aws.config'));
	// bucketName = GetMeteorSettingsValue("aws.PDFfilesBucketName");
	// s3 = new AWS.S3({params: {Bucket: bucketName}});
	//
	// SSR.compileTemplate('PDFFormHTML', Assets.getText('private/PDF_form.html'));
});

// Required. Default size limit is 100kb, which won't work with images.
Router.onBeforeAction(Iron.Router.bodyParser.json({limit: options.documentSizeLimit}));
Router.route( "/generatePDF/:type/:_id/:userId", {
	where: 'server',
	action: function() {
		
		this.response.setHeader('Access-Control-Allow-Origin', '*');
		this.response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
		
		this.response.statusCode = 200;
		
		
		if (this.request.method === "OPTIONS") {
			this.response.setHeader("Content-Type", "application/json");
			this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			this.response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
			this.response.end("OPTIONS Response");
			return;
		}
		
		const id = this.params._id;
		const userId = this.params.userId;
		const pdfType = this.params.type;
		const currentDoc = this.request.body;
		let name = "";
		
		// Send a 400 back if we're missing stuff.
		if ( !id ) {
			this.response.statusCode = 400;
			this.response.end( { status: 400, message: "Missing query parameter(s)." } );
		}
		
		const user = Meteor.users.findOne(userId);
		
		if ( !user ) {
			this.response.statusCode = 404;
			this.response.end('error');
		}
		
		if (!Roles.userIsInRole(userId, "user")) {
			this.response.statusCode = 403;
			this.response.end( { status: "403", message: "User not allowed." } );
		}
		
		// Assign a name, either the username or first and last name
		if ( !user.profile.firstname || !user.profile.lastname ) {
			name = user.username || "no name defined";
		}
		else {
			name = `${user.profile.firstname} ${user.profile.lastname}`;
		}
		
		// Everything checks out, start on our document
		let doc = new PDFDocument(
				{
					size: options.size,
					margins: options.margins,
					bufferPages: true
				}
		);
		let oldBottom = doc.page.margins.bottom ;
		
		// Generate, upload to S3 and email or just generate and send back
		// if ( currentDoc.sendEmail && typeof currentDoc.sendEmail === "object") {
		//
		// 	let self = this;
		// 	// Sending an email with the PDf attached. Verify that we have what we need.
		// 	check ( currentDoc.sendEmail, {
		// 		to: Match.OneOf( String, [String] ),
		// 		subject: String,
		// 		body: String,
		// 		from: String,
		// 		isHtml: Boolean
		// 	} );
		// 	check ( currentDoc.additionalParameters, {
		// 		appId: String,
		// 		documentId: String,
		// 		userFields: [ Match.Maybe( String ) ],
		// 		currentState: String
		// 	});
		//
		// 	// Grab default data for the PDF email
		// 	const emailData = {
		// 		heading: 'heading title',
		// 		body: 'body text',
		// 	};
		//
		// 	// Data to prefill our email HTML template with
		// 	emailData.form = {
		// 		formName: currentDoc.schema.title,
		// 		stage: currentDoc.data.currentState || "New",
		// 		submittedBy: name,
		// 		logoSource: currentDoc.logo.logoURI || "http://ju.to/resources/logo-juto.svg"
		// 	};
		//
		// 	let emailAddressees = currentDoc.sendEmail.to;
		//
		// 	// legacy: if email is not an array, make it one
		// 	if (!Array.isArray(emailAddressees)) { emailAddressees = [currentDoc.sendEmail.to]; }
		//
		// 	Override email address if in development
		// 	if (utils.inDevelopment()) {
		// 		emailAddressees = ["laurent.huron@gmail.com"];
		// 	}
		//
		// 	const title = currentDoc.schema.title.replace(/['" ]/g, '');
		// 	const state = currentDoc.data.currentState || currentDoc.schema.currentState || "NO_DEFINED_STATE";
		// 	const date = moment().format('YYYYMMDD');
		// 	const submittedBy = name.replace(/['" ]/g, '');
		// 	const docId = currentDoc.additionalParameters.documentId;
		// 	const timestamp = moment().format('HHmmss');
		//
		// 	// Filename is important: form_name(no spaces)-YYYYMMDD-username(no spaces)-documentID-timestamp.pdf
		// 	const filename = `${title}-${date}-${submittedBy}-${docId}-${timestamp}.pdf`;
		// 	// Build our S3 pseudo-folder structure out of any given user-selected fields
		// 	let userFields = '';
		// 	if ( currentDoc.additionalParameters.userFields.length > 0 ) {
		// 		userFields = currentDoc.additionalParameters.userFields.join('/') + '/';
		// 	}
		//
		// 	// AppID/[user/defined/fields]/state/file.pdf
		// 	// e.g. 2rsqmFDgJrCgzXopy/truck2001-12/pilbarra/Approved/<filename>.pdf
		// 	const s3Filename = `${currentDoc.additionalParameters.appId}/${userFields}${state}/${filename}`;
		//
		// 	const s3Path = 'https://s3.' + AWS.config.region + '.amazonaws.com/' + bucketName + '/' + s3Filename;
		//
		// 	// Create our PDF
		// 	let writeStream = fs.createWriteStream(assets_folder + filename);
		// 	let pdfStream = doc.pipe(writeStream);
		// 	buildDocument(doc, currentDoc.schema, currentDoc.data, currentDoc.logo, name, s3Path);
		// 	doc.end();
		// 	pdfStream.on('finish',()=>{
		//
		// 		let data = fs.createReadStream(assets_folder + filename);
		//
		// 		//Contains file info and additional metadata to identify what app it belongs to
		// 		let params = {
		// 			Key: s3Filename,
		// 			ContentType: 'application/pdf',
		// 			Metadata: {
		// 				"formTitle": currentDoc.schema.title,
		// 				"formState": currentDoc.additionalParameters.currentState,
		// 				"documentId": currentDoc.additionalParameters.documentId,
		// 				"appId": currentDoc.additionalParameters.appId
		// 			},
		// 			ACL: "public-read",
		// 			Body: data
		// 		};
		//
		// 		s3.upload(params).promise().then(function (uploadData) {
		// 			return s3.headObject({Key: s3Filename}).promise();
		// 		}).then( () => {
		// 			utils.logDebug(`${filename} uploaded to S3`);
		// 			// Setup email, including html-rendered body
		// 			utils.logDebug("setting up email...");
		// 			const email = {
		// 				to: emailAddressees,
		// 				from: currentDoc.sendEmail.from,
		// 				subject: currentDoc.sendEmail.subject,
		// 				html: SSR.render('PDFFormHTML', emailData),
		// 				headers: {"X-Mailgun-Tag": 'PDFForm'},
		// 				// Attachments array:
		// 				attachments: [
		// 					{
		// 						filename: filename,
		// 						path: assets_folder + filename,
		// 						contentType: 'application/pdf'
		// 					}
		// 				]
		// 			};
		// 			utils.logDebug("about to send email:");
		// 			utils.logDebug(email);
		// 			transport.sendMail(email, function (error, response) {
		// 				if (error) {
		// 					console.log(error);
		// 					self.response.writeHead(400, {
		// 						"Content-Type": "text/plain"
		// 					});
		// 					self.response.end("Error uploading to S3 and sending PDf by email.");
		// 				} else {
		// 					console.log("Message sent: " + response.message);
		// 					self.response.writeHead(200, {
		// 						"Content-Type": "text/plain"
		// 					});
		// 					self.response.end(response.message);
		// 				}
		// 				// if you don't want to use this transport object anymore, uncomment following line
		// 				//smtpTransport.close(); // shut down the connection pool, no more messages
		// 			});
		//
		// 		}, (err) => {
		// 			utils.logDebug("uploadFileToS3: promise error");
		// 			utils.logDebug( err );
		// 		});
		// 	});
		// }
		// else {
			
			this.response.writeHead(200, {
				"Content-Type": `application/pdf; name=test-form.pdf`,
				"Content-Disposition": `inline; filename=test-form.pdf`,
				"access-control-allow-origin": "*"
			});
			
			doc.pipe(this.response);
			
			let modifiedDoc = utils.cloneAndRename( currentDoc, {
				recipeName: "title"
			});
			
			
			
			buildDocument(doc, modifiedDoc, pdfType, name);
			// # see the range of buffered pages
			let range = doc.bufferedPageRange();
			for (let i = range.start; i < range.start + range.count; i++) {
				doc.switchToPage(i);
				doc.page.margins.bottom = 0;
				doc.text(`Page ${i + 1} of ${range.count}`, 0, doc.page.height - options.margins.bottom - options.margins.top , {align: "right"});
			}
			doc.page.margins.bottom = oldBottom;
			
			doc.end();
		// }
	}
} );