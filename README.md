# Product Monitor Auth Header Plugin
Adds certificate based authentication to product monitor, enables the secure pages feature, and adds middleware to secure all non-authenticated API and content routes.

## Example
Create `config/plugins/auth-header.json` in your `product-monitor` project:
```json
{
    "library": "product-monitor.plugin.auth-header",
    "config": {
        "email": "Email=([A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,}),",
        "name": "CN=([A-z ()]+),",
        "org-unit": "OU=([A-z ()-]+),",
        "org": "O=([A-z ()-]+),",
        "location": "L=([A-z ()-]+),",
        "country": "C=([A-z ()-]+)"
    }
}
```

## Development

```
npm install
npm test
```

## Exposed methods
### plugin()
Creates a new instance of the plugin.

```js
var plugin = require('product-monitor.plugin.auth-header')();
```

### plugin.apply(app)
Applies the plugin to a product-monitor app.
- Registers the Cert Strategy based on headers
- Registers `GET` `/docs/auth-header`
- Registers a `preflight` request to authorise all requests based on headers
- Enables the _secure pages_ feature of `product-monitor`
- Ignores `http://localhost/` request routes

### plugin.info()
Returns the `name`, `description`, and `keywords` for the plugin:

### plugin.getConfig()
Returns the config applied to the plugin.

### plugin.setConfig(pluginConfig)
Changes the config applied to the plugin.

## Change Log

### 1.1.0
- Add support to merge local user information based on email address

### 1.0.0
- Initial release
- Add exception for `http://localhost/`
