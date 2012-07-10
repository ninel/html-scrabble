var dirty = require('dirty');
var util = require('util');
var icebox = require('./client/javascript/icebox.js');
var EventEmitter = require('events').EventEmitter;

// //////////////////////////////////////////////////////////////////////

function DB(path) {
    this.prototypeMap = {};
    EventEmitter.call(this);
    this.dirty = dirty(path);
    var db = this;
    this.dirty.on('load', function () { db.emit('load', 0); });
}

util.inherits(DB, EventEmitter);

DB.prototype.registerObject = function(constructor) {
    this.prototypeMap[constructor.name] = constructor;
}

DB.prototype.get = function(key) {
    return icebox.thaw(this.dirty.get(key), this.prototypeMap);
}

DB.prototype.set = function(key, object) {
    this.dirty.set(key, icebox.freeze(object));
}

exports.DB = DB;