import React from 'react';

// Inject stylesheet when javascript is disabled
const generateStyles = styles => styles.map((href) => (`<noscript><link rel="stylesheet" href=${href} /></noscript>`)).join('');

// Generate metadata tags
const generateMetadata = (helmet) => [
    helmet.title.toString(),
    helmet.meta.toString()
].join('');

// Generate tags to be injected in the head
const generateHead = (helmet, styles) => [
    helmet && generateMetadata(helmet) || '',
    generateStyles(styles)
].join('');

function HTMLDocument({ markup, scripts, styles, data, helmet }) {
    return (
        <html lang="en">
            <head dangerouslySetInnerHTML={{ __html: generateHead(helmet, styles) }} />
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: markup }} />
                <script
                    // Store the data in the global windows object to make it accessible to the client-side scripts
                    dangerouslySetInnerHTML={{
                        __html: `window.__INITIAL_DATA__=${JSON.stringify(data)};`
                    }}
                />
                {scripts && scripts.map(src => (
                    <script key={src} src={src} />
                ))}
            </body>
        </html>
    );
}

export default HTMLDocument;
