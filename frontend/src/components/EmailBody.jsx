import React from 'react';

/**
 * Renders an email body. If the content contains HTML tags it renders the HTML
 * (styled for readability), otherwise it shows the raw plain text.
 */
const EmailBody = ({ email, style }) => {
  const body = email?.body || email?.body_text || email?.snippet || '';

  // Detect HTML markup in the body.
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(body);

  const baseStyle = {
    fontSize: '0.925rem',
    color: '#1e293b',
    lineHeight: 1.6,
    wordBreak: 'break-word',
    ...style,
  };

  if (looksLikeHtml) {
    return (
      <div
        className="email-body-html"
        style={{ ...baseStyle, whiteSpace: 'normal' }}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }

  return <div style={{ ...baseStyle, whiteSpace: 'pre-wrap' }}>{body || 'No message content available.'}</div>;
};

/**
 * Renders an AI-generated summary. If it contains HTML/markup it is rendered
 * in a styled block, otherwise shown as plain text.
 */
export const RenderHtmlText = ({ text, style }) => {
  if (!text) return null;
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(text);
  const baseStyle = {
    fontSize: '0.925rem',
    color: '#1e293b',
    lineHeight: 1.6,
    wordBreak: 'break-word',
    ...style,
  };
  if (looksLikeHtml) {
    return <div className="email-body-html" style={{ ...baseStyle, whiteSpace: 'normal' }} dangerouslySetInnerHTML={{ __html: text }} />;
  }
  return <div style={{ ...baseStyle, whiteSpace: 'pre-wrap' }}>{text}</div>;
};

export default EmailBody;
