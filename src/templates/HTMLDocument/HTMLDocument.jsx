import React from 'react';

const generateStyles = styles => styles.map(({ href, noscript }) => (
    (noscript && `<noscript><link rel="stylesheet" href=${href} /></noscript>`)
    || `<link rel="stylesheet" href=${href} />`
)).join('');

const generateHead = ({ helmet, styles }) => [
    helmet && helmet.title.toString(),
    helmet && helmet.meta.toString(),
    helmet && helmet.link.toString(),
    generateStyles(styles)
].join('');

function HTMLDocument({ markup, helmet, scripts, styles }) {
    return (
        <html lang="en" {...helmet && helmet.htmlAttributes.toComponent()}>
            <head dangerouslySetInnerHTML={{ __html: generateHead({ helmet, styles }) }} />
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: markup }} />
                {scripts && scripts.map(src => (
                    <script key={src} src={src} />
                ))}
            </body>
        </html>
    );
}

export default HTMLDocument;
