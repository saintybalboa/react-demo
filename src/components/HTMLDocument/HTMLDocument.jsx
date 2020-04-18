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
                <script src="/js/client.js"></script>
                <script src="/js/vendor.js"></script>
            </body>
        </html>
    );
}

export default HTMLDocument;
