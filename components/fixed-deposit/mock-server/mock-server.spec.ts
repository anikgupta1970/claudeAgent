import { MockServer } from './mock-server.js';

describe('mock server', () => {
  it('should say hello', async () => {
    const mockServer = MockServer.from();
    const greeting = await mockServer.getHello();
    expect(greeting).toEqual('Hello World!');
  })
});
    