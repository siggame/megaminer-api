/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */

const chai = require("chai");
const chaiHttp = require("chai-http");
const { server, makeSuite } = require("./helpers");

const should = chai.should();
chai.use(chaiHttp);
