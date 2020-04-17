import React from 'react';

function HTMLDocument({ body }) {
    return (
        <html lang="en">
            <head>
                <title>React demo</title>
                <link rel="stylesheet" href="/css/index.css" />
            </head>
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: body }} />
                <script src="/index.js"></script>
                <script src="/vendor.js"></script>
            </body>
        </html>
    );
}

export default HTMLDocument;
