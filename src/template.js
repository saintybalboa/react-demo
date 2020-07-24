import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import HTMLDocument from './templates/HTMLDocument';

export default function(markup, scripts, styles, data, helmet) {
    // Generate the static html document
    const htmlDocument = renderToStaticMarkup(
        <HTMLDocument
            markup={markup}
            scripts={scripts}
            styles={styles}
            data={data}
            helmet={helmet}
        />
    );

    // <!doctype html> syntax is invalid inside a react component
    return `<!DOCTYPE html>${htmlDocument}`;
}
