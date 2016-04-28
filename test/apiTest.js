'use strict';

var request = require('supertest');
var should = require('should');
var app = require('../server');


describe('API tests for router endpoints', function() {

    it('should hit the homepage', function(done){
        request(app)
                .get('/test/endpoint')
                .expect(200, done);
    });
});