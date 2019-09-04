const Metalsmith = require("metalsmith");
const async = require("async");
const path = require("path");

// template engine
const render = require("consolidate").dot.render;
const doT = require("dot");
doT.templateSettings.strip = false;

const util = require("./util");
const source = util.path("template");
const dest = util.path( true ? './dist' : "/Users/liaoqiao/netease/deeplearn-fed-platform/src");

Metalsmith(source)
  .metadata(require("./config")) // data source
  .use(renderTemplateFiles())
  .source(".") // start from template root instead of `./src` which is Metalsmith's default for `source`
  .destination(dest)
  .clean(true)
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });

function renderTemplateFiles(skipInterpolation) {
  return (files, metalsmith, done) => {
    const keys = Object.keys(files);
    const metalsmithMetadata = metalsmith.metadata();
    async.each(
      keys,
      (file, next) => {
        const str = files[file].contents.toString();
        // do not attempt to render files that do not have mustaches
        if (!/{{([^{}]+)}}/g.test(str)) {
          return next();
        }
        render(str, metalsmithMetadata, (err, res) => {
          if (err) {
            err.message = `[${file}] ${err.message}`;
            return next(err);
          }
          files[file].contents = new Buffer(res);
          next();
        });
      },
      done
    );
  };
}
