//////////////////////
//EMAIL CONFIRMATION//
//////////////////////

Meteor.startup(function () {

	process.env.MAIL_URL = 'smtp://info@recordb.in:zdq_tb5zFPFZQk9TTHjDMA@smtp.mandrillapp.com:587';

	Accounts.emailTemplates.from = 'info@recordb.in';

	//-- Application name
	// Accounts.emailTemplates.siteName = 'Stacks';

	//-- Subject line of the email.
	// Accounts.emailTemplates.verifyEmail.subject = function(user) {
	// 	return 'Confirm Your Email Address for Stacks';
	// };

	//-- Verification Email template
	Accounts.emailTemplates.verifyEmail = {
	  subject() {
	    return "Verify Your Email Address";
	  },
	  text( user, url ) {
	    let emailAddress   = user.emails[0].address,
	        urlWithoutHash = url.replace( '#/', '' ),
	        supportEmail   = "info@recordb.in",
	        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

	    return emailBody;
	  }
	};

});