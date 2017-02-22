/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/options', require('./api/options'));
  app.use('/api/pickupUserEvents', require('./api/pickupUserEvent'));
  app.use('/api/pickupEvents', require('./api/pickupEvent'));
  app.use('/api/baskets', require('./api/basket'));
  app.use('/api/pickupOptions', require('./api/pickupOption'));
  app.use('/api/extraEvents', require('./api/extraEvent'));
  app.use('/api/seasons', require('./api/season'));
  app.use('/api/memberships', require('./api/membership'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
