module.exports = {
  name: 'test-fake-distributed-model-2',
  repository: { url: 'https://github.com/fake/group-add' },
  version: 'test-fake-distributed-model-2-version-1',
  local: {
    type: 'function',
    fn(prevRslt, agg, next) {},
    seed() {},
  },
  remote: {
    type: 'function',
    fn(newDoc, allDocs, aggData) {},
    seed() {},
  },
};
