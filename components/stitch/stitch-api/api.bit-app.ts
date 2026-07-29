import { NodeServer } from '@bitdev/node.node-server';
// import { DockerDeploy, NodeDockerFile } from '@backend/docker.docker-deployer';

export default NodeServer.from({
  name: 'api',
  mainPath: import.meta.resolve('./api.app-root.js'),

  // deploy: DockerDeploy.deploy({
  //   org: 'bitdevcommunity',
  //   pushOptions: {},
  //   dockerfileTemplate: new NodeDockerFile(),
  //   entryFile: 'api.cjs',
  // }),
});
