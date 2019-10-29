# ATN DAC Landing

The landing page for the IOOS ATN DAC.

### Development

**Copy docs into place**

Follow the instructions in the `atn-docs` README file

*OR*

```
cp -r ${ATN_DOCS_REPO}/_build/json/* src/help/
```


**Run the site**

```bash
npm install
npm run browsersync
```

The development instance will be available by default at http://localhost:3000, and automatically refresh whenever files are changed.
