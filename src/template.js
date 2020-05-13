import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import HTMLDocument from './templates/HTMLDocument';

export default function(markup, helmet, scripts, styles) {
    // render the static html document
    const htmlDocument = renderToStaticMarkup(
        <HTMLDocument
            markup={markup}
            helmet={helmet}
            scripts={scripts}
            styles={styles}
        />
    );

    // Prepend the html document with <!doctype html> here as react throws an error when it is embedded in a component
    return `<!DOCTYPE html>${htmlDocument}`;
}
