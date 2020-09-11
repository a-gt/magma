const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

module.exports = () => {
  if (Config.env.NODE_ENV === 'production')
    Sentry.init({
      dsn              : Config.sentry,
      tracesSampleRate : 1.0,
      release          : 'magma@' + process.env.npm_package_version,
    });
};
