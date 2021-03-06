'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var extend = require('extend');
var merge = require('merge');


var Generator = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));
        this.options['projectName'] = this.options['projectName'] || 'myApp';
        this.options['modules'] = this.options['modules'] || [];

        this.on('end', function () {
            if (!this.options['skip-install']) {
                this.spawnCommand('chmod', ['-R','777','storage']);
            }
        });
        this.readConf = function(path){
            var content = this.read(path);
            return JSON.parse(content);
        }

        this.tryReadConf = function(path){
            try{
                var content = this.read(path);
                return JSON.parse(content);
            }catch(err){
                console.log(chalk.yellow('No '+path));
            }
        }
    },
    app: function () {

        this.configs = extend(
            {},
            {composerDeps: this.readConf('default/composer.json')},
            this.readConf('default/app/config/controllers.json'),
            this.readConf('default/app/config/providers.json'),
            this.readConf('default/app/config/routes.json')
        );

        this.configs.composerDeps.name = this.options['projectName'];

        // start creating structure
        this.template('default/_phpunit.xml.dist', 'phpunit.xml.dist',{'projectName':this.options['projectName']});

        // webroot & bootstrap
        this.mkdir('app/config');
        this.directory('default/app/config/development','app/config/development');
        this.directory('default/app/config/production','app/config/production');

        this.directory('default/app/templates','app/templates');
        this.directory('default/app/views','app/views');
        this.copy('default/app/app.php','app/app.php');
        this.copy('default/app/bootstrap.php','app/bootstrap.php');

        this.directory('default/src','src');
        this.directory('default/tests','tests');
        this.directory('default/web','web');
        this.directory('default/storage','storage');
    },
    modules: function(){
        if( this.options['modules'].length > 0 )
        {
            this.options['modules'].forEach(function(name){
                var moduleName = 'module-'+name;
                if( yeoman.file.exists(path.join(__dirname, 'templates/'+moduleName)) ) {
                    console.log(chalk.blue('Installing module: '+moduleName));

                    var config = extend(
                        {},
                        {composerDeps: this.tryReadConf(moduleName+'/deps.json')},
                        this.tryReadConf(moduleName+'/app/config/controllers.json'),
                        this.tryReadConf(moduleName+'/app/config/providers.json'),
                        this.tryReadConf(moduleName+'/app/config/routes.json')
                    );

                    this.configs = merge.recursive(
                        this.configs,
                        {composerDeps: this.tryReadConf(moduleName+'/deps.json')},
                        this.tryReadConf(moduleName+'/app/config/controllers.json')
                    );

                    var providers = this.tryReadConf(moduleName+'/app/config/providers.json');
                    var routes = this.tryReadConf(moduleName+'/app/config/routes.json');

                    if( providers.providers )
                        this.configs.providers = this.configs.providers.concat(providers.providers);

                    if( routes.routes )
                        this.configs.routes = this.configs.routes.concat(routes.routes);

                    this.directory(moduleName+'/app/assets','app/assets');
                    this.directory(moduleName+'/app/views','app/views');
                    this.directory(moduleName+'/src','src');
                    this.directory(moduleName+'/tests','tests');
                }
            },this);
        }
        
        this.write('composer.json',JSON.stringify(this.configs.composerDeps,null,2));
        this.write('app/config/controllers.json',JSON.stringify({"controllers":this.configs.controllers},null,2));
        this.write('app/config/providers.json',JSON.stringify({"providers":this.configs.providers},null,2));
        this.write('app/config/routes.json',JSON.stringify({"routes":this.configs.routes},null,2));
    }
});

module.exports = Generator;
