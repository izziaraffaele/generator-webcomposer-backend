/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('generator-webcomposer-backend', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('webcomposer-backend:app', [
        '../../app'
      ]);
      this.app.options['modules'] = ['auth'];
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
        'composer.json',
        'app/assets/styles/auth.scss',
        'src/AppBundle/Controllers/AuthController.php',
    ];

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
