import { ViteReact } from '@bitdev/react.app-types.vite-react';
// import { DockerDeploy, HtmlDockerFile } from '@backend/docker.docker-deployer';

export default ViteReact.from({
  name: 'fixed-deposit-flow-app',

  ssr: false,

  // deploy: DockerDeploy.deploy({
  //   org: 'bitdevcommunity',
  //   pushOptions: {},

  //   dockerfileTemplate: new HtmlDockerFile(),
  // }),
});
