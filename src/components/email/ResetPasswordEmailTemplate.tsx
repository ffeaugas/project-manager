interface IResetPasswordEmailTemplateProps {
  name: string;
  url: string;
}

const ResetPasswordEmailTemplate = ({ name, url }: IResetPasswordEmailTemplateProps) => {
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          padding: '40px 30px',
          color: '#333333',
          lineHeight: '1.6',
        }}
      >
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>Hi {name},</p>

        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          We received a request to reset your password. Click the button below to create a
          new password:
        </p>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a
            href={url}
            style={{
              display: 'inline-block',
              padding: '14px 40px',
              backgroundColor: '#0070f3',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Reset Password
          </a>
        </div>

        <p style={{ fontSize: '14px', marginBottom: '20px', color: '#666666' }}>
          If the button doesn't work, copy and paste this link into your browser:
        </p>

        <p
          style={{
            fontSize: '14px',
            wordBreak: 'break-all',
            color: '#0070f3',
            marginBottom: '30px',
          }}
        >
          {url}
        </p>

        <div
          style={{
            borderTop: '1px solid #e5e5e5',
            paddingTop: '20px',
            marginTop: '30px',
          }}
        >
          <p style={{ fontSize: '14px', color: '#666666', marginBottom: '10px' }}>
            <strong>Security Note:</strong>
          </p>
          <ul
            style={{
              fontSize: '14px',
              color: '#666666',
              paddingLeft: '20px',
              margin: '0',
            }}
          >
            <li>This link will expire in 1 hour</li>
            <li>If you didn't request this, please ignore this email</li>
            <li>Never share this link with anyone</li>
          </ul>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '20px 30px',
          textAlign: 'center',
          borderTop: '1px solid #e5e5e5',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: '#999999',
            margin: '0',
          }}
        >
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordEmailTemplate;
