'use strict'
const util = require('loader-utils');
const pug = require('pug');
const path = require('path');
const fs = require('fs');

let cachedDeps;

module.exports = function(source) {
  let query = {};
  if (this.cacheable) {
    this.cacheable(true);
  }

  query = this.query;

  let req = util.getRemainingRequest(this);
  let options = Object.assign({
    filename: this.resourcePath,
    doctype: query.doctype || 'js',
    compileDebug: this.debug || false
  }, query);

  if (options.plugins) {
    if (!(options.plugins instanceof Array)) {
      options.plugins = [options.plugins];
    }
  }

  var callback = this.async();
  let tmplPath = path.resolve(query.template);
  let addDependency = this.addDependency;

  addDependency(tmplPath);

  fs.readFile(tmplPath, 'utf-8', function(err, tmplFile) {
    if (err) return callback(err);

    let template;
    try {
      template = pug.compile(tmplFile, options)
    } catch (ex) {
      if (cachedDeps !== undefined) {
        cachedDeps.forEach(addDependency);
      }
      callback(ex);
      return;
    }

    cachedDeps = template.dependencies ? template.dependencies.slice() : undefined;
    template.dependencies.forEach(addDependency);
    let data = query.data || JSON.parse(source);

    callback(null, template(data));
  });

}


