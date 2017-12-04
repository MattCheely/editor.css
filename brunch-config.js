module.exports = {
  files: {
    stylesheets: {
      joinTo: {
        "style/editor.css": "app/style/main.less"
      }
    }
  },
  conventions: {
    ignored: [/^app\/style\/(?!main.less)/]
  }
};
