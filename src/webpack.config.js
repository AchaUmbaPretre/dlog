module.exports = {
    // Autres configurations...
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
          exclude: [/node_modules\/html2pdf\.js/], // Ignore les erreurs de source map pour html2pdf.js
        },
      ],
    },
  };
  