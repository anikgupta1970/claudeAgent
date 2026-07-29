import { NodeServer } from '@bitdev/node.node-server';

export default NodeServer.from({
  name: 'mock-server',
  mainPath: import.meta.resolve('./mock-server.app-root.js'),
});
