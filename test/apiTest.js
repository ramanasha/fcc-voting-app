'use strict';

var request = require('supertest');
var should = require('should');
var app = require('../server').app;


describe('API tests for router endpoints', function() {

    it('should hit the homepage', function(done){
        request(app)
                .get('')
                .expect(200, done);
    });
});