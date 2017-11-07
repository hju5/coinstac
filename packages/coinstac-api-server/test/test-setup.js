const rethink = require('rethinkdb');
const singleShot = require('./data/single-shot-schema');
const multiShot = require('./data/multi-shot-schema');
const helperFunctions = require('../src/auth-helpers');

helperFunctions.getRethinkConnection()
.then((connection) => {
  return rethink.dbList().contains('coinstac')
  .do((exists) => {
    return rethink.branch(
      exists,
      rethink.dbDrop('coinstac'),
      { dbs_dropped: 0 }
    );
  }).run(connection)
  .then(() => rethink.dbCreate('coinstac').run(connection))
  .then(() => rethink.tableCreate('pipelines').run(connection))
  .then(() => rethink.tableCreate('computations').run(connection))
  .then(() => rethink.table('computations').insert([singleShot, multiShot], { returnChanges: true }).run(connection))
  .then(compInsertResult => rethink.table('pipelines').insert({
    id: 'test-pipeline',
    name: 'Test Pipeline',
    description: 'Test description',
    owningConsortium: 'test-cons-2',
    steps: [
      {
        computations: [
          compInsertResult.changes[0].new_val.id,
        ],
        controller: {
          options: { type: 'single' },
          id: 'test-id',
        },
        id: 'HJwMOMTh-',
        ioMap: {
          covariates: [
            {
              name: 'isControl',
              source: { inputKey: 'file', inputLabel: 'File', pipelineIndex: -1 },
              type: 'boolean',
            },
            {
              name: 'age',
              source: { inputKey: 'file', inputLabel: 'File', pipelineIndex: -1 },
              type: 'number',
            },
          ],
          freeSurferRegion: ['3rd-Ventricle'],
          lambda: '4',
        },
      },
      {
        computations: [
          compInsertResult.changes[1].new_val.id,
        ],
        controller: {
          options: { type: 'single' },
          id: 'test-id',
        },
        id: 'HyLfdfanb',
        ioMap: {
          covariates: [
            {
              name: 'biased xs',
              source: { inputKey: 'biasedX', inputLabel: 'Computation 1: Biased Xs', pipelineIndex: 0 },
              type: 'number',
            },
          ],
          freeSurferRegion: ['5th-Ventricle'],
          iterationCount: '3',
          lambda: '4',
        },
      },
    ],
  }).run(connection))
  .then(() => rethink.tableCreate('users').run(connection))
  .then(() => rethink.tableCreate('consortia').run(connection))
  .then(() => rethink.table('consortia').insert({
    id: 'test-cons-1',
    activePipelineId: 'test-pipeline',
    name: 'Test Consortia 1',
    description: 'This consortia is for testing.',
    owners: ['author'],
    users: ['author', 'test'],
  }).run(connection))
  .then(() => rethink.table('consortia').insert({
    id: 'test-cons-2',
    activePipelineId: 'test-pipeline',
    name: 'Test Consortia 2',
    description: 'This consortia is for testing too.',
    owners: ['test'],
    users: ['test'],
  }).run(connection))
  .then(() => connection.close());
})
.then(() => helperFunctions.hashPassword('password'))
.then(passwordHash => helperFunctions.createUser({
  id: 'test',
  username: 'test',
  institution: 'mrn',
  email: 'test@mrn.org',
  permissions: {
    computations: {},
    consortia: {
      'test-cons-1': ['member'],
      'test-cons-2': ['owner'],
    },
    pipelines: {},
  },
}, passwordHash))
.then(() => helperFunctions.hashPassword('password'))
.then(passwordHash => helperFunctions.createUser({
  id: 'server',
  username: 'server',
  institution: 'mrn',
  email: 'server@mrn.org',
  permissions: {
    computations: {},
    consortia: {},
    pipelines: {},
  },
}, passwordHash))
.then(() => helperFunctions.hashPassword('password'))
.then(passwordHash => helperFunctions.createUser({
  id: 'author',
  username: 'author',
  institution: 'mrn',
  email: 'server@mrn.org',
  permissions: {
    computations: {
      'single-shot-test-id': ['owner'],
      'multi-shot-test-id': ['owner'],
    },
    consortia: {
      'test-cons-1': ['owner'],
      'test-cons-2': ['member'],
    },
    pipelines: {},
  },
}, passwordHash))
.then(() => {
  process.exit();
})
.catch(console.log);  // eslint-disable-line no-console
