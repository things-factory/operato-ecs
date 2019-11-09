module.exports = {
  echoServer: {
    port: 8124
  },
  connections: [
    {
      connector: 'echo-back',
      host: 'localhost',
      port: 8124,
      name: 'echo@localhost'
    }
  ],
  scenariosPath: 'scenarios'
}
