function scalarHtml(openapiUrl) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Scalar API Reference</title>
  <style>
    :root {
      color-scheme: light;
    }

    body {
      margin: 0;
      min-height: 100vh;
      background: #f8fafc;
    }

    scalar-api-reference {
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <script
    id="api-reference"
    data-url=${JSON.stringify(openapiUrl)}
  ></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;
}
export { scalarHtml };
