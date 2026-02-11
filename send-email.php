<?php
// send-email.php - PHP version for standard hosting

// Set headers for CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON data from request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate inputs
if (!isset($data['name']) || !isset($data['email']) || !isset($data['subject']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields',
        'received' => [
            'name' => isset($data['name']),
            'email' => isset($data['email']),
            'subject' => isset($data['subject']),
            'message' => isset($data['message'])
        ]
    ]);
    exit();
}

$name = htmlspecialchars(trim($data['name']));
$email = htmlspecialchars(trim($data['email']));
$subject = htmlspecialchars(trim($data['subject']));
$message = htmlspecialchars(trim($data['message']));

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid email address'
    ]);
    exit();
}

// Recipient email address
$recipient = 'contact@mihq.company';

// Email subject
$emailSubject = "[{$subject}] Message from {$name}";

// Create email body
$emailBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; padding: 20px; }
        .content { background-color: #f8f9fa; padding: 20px; margin: 20px 0; }
        .footer { background-color: #e7f3ff; padding: 15px; margin-top: 20px; }
        .label { font-weight: bold; color: #555; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
        </div>
        
        <div class='content'>
            <p><span class='label'>From:</span> {$name}</p>
            <p><span class='label'>Email:</span> <a href='mailto:{$email}'>{$email}</a></p>
            <p><span class='label'>Subject:</span> {$subject}</p>
            <p><span class='label'>Sent:</span> " . date('F j, Y, g:i a T') . "</p>
        </div>
        
        <div class='content'>
            <p class='label'>Message:</p>
            <p>" . nl2br($message) . "</p>
        </div>
        
        <div class='footer'>
            <p><strong>Quick Reply:</strong> Simply hit 'Reply' to respond directly to {$name} at {$email}</p>
        </div>
        
        <div style='text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;'>
            <p style='color: #6c757d; font-size: 12px;'>Sent from NerMI website contact form</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: NerMI Contact Form <noreply@" . $_SERVER['HTTP_HOST'] . ">" . "\r\n";
$headers .= "Reply-To: {$email}" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mailSent = mail($recipient, $emailSubject, $emailBody, $headers);

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email. Please try again or contact directly at srmcclafferty@gmail.com'
    ]);
}
?>