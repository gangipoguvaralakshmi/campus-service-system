const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Send assignment notification email
exports.sendAssignmentNotification = async (staffEmail, staffName, complaint) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: staffEmail,
      subject: `New Complaint Assigned: ${complaint.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background-color: #0b2f4e; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Campus Service Management</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #0b2f4e;">Hello ${staffName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              A new complaint has been assigned to you. Please review the details below and take necessary action.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #0b2f4e;">
              <h3 style="color: #0b2f4e; margin-top: 0;">Complaint Details:</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Complaint ID:</td>
                  <td style="padding: 8px 0;">#${complaint._id.toString().slice(-6)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Title:</td>
                  <td style="padding: 8px 0;">${complaint.title}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Category:</td>
                  <td style="padding: 8px 0;">${complaint.category}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Priority:</td>
                  <td style="padding: 8px 0;">
                    <span style="background-color: ${
                      complaint.priority === 'high' ? '#c44536' : 
                      complaint.priority === 'medium' ? '#f39c12' : '#27ae60'
                    }; color: white; padding: 3px 10px; border-radius: 15px; font-size: 12px;">
                      ${complaint.priority.toUpperCase()}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                  <td style="padding: 8px 0;">${complaint.location} ${complaint.roomNumber || ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Description:</td>
                  <td style="padding: 8px 0;">${complaint.description}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Raised By:</td>
                  <td style="padding: 8px 0;">${complaint.raisedBy?.name || 'Unknown'}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/staff-dashboard" 
                 style="background-color: #0b2f4e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                View in Dashboard
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
              Please log in to your dashboard to update the status of this complaint.
            </p>
          </div>
          
          <div style="background-color: #eef4f8; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
            <p style="margin: 0;">This is an automated message from Campus Service Management System. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send status update notification to student
exports.sendStatusUpdateNotification = async (studentEmail, studentName, complaint, oldStatus, newStatus) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: `Complaint Status Updated: ${complaint.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background-color: #0b2f4e; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Campus Service Management</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #0b2f4e;">Hello ${studentName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              The status of your complaint has been updated.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #0b2f4e; margin-top: 0;">Status Update:</h3>
              
              <div style="display: flex; justify-content: space-around; margin: 20px 0;">
                <div style="text-align: center;">
                  <div style="background-color: #f0f0f0; padding: 10px 20px; border-radius: 10px;">
                    <span style="color: #666;">Previous Status</span>
                    <h4 style="margin: 5px 0; color: ${oldStatus === 'resolved' ? '#27ae60' : '#c44536'};">${oldStatus}</h4>
                  </div>
                </div>
                <div style="font-size: 24px; color: #0b2f4e; align-self: center;">→</div>
                <div style="text-align: center;">
                  <div style="background-color: #0b2f4e; padding: 10px 20px; border-radius: 10px;">
                    <span style="color: #ffd966;">New Status</span>
                    <h4 style="margin: 5px 0; color: white;">${newStatus}</h4>
                  </div>
                </div>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Complaint ID:</td>
                  <td style="padding: 8px 0;">#${complaint._id.toString().slice(-6)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Title:</td>
                  <td style="padding: 8px 0;">${complaint.title}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/complaint-status" 
                 style="background-color: #0b2f4e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Track Your Complaint
              </a>
            </div>
          </div>
          
          <div style="background-color: #eef4f8; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
            <p style="margin: 0;">This is an automated message from Campus Service Management System.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Status update email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending status update email:', error);
    return { success: false, error: error.message };
  }
};