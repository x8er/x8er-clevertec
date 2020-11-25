import React from "react";

const Template = ({ children, initialState, scripts }) => (
  <html>
    <head>
      <meta charSet="UTF-8" />
      <title>x8er-clevertec</title>
    </head>
    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: children }} />

      {initialState && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.APP_STATE=${JSON.stringify(initialState)}`,
          }}
        />
      )}

      {scripts.map((item, index) => (
        <script key={index} src={item} />
      ))}
    </body>
  </html>
);

export default Template;
