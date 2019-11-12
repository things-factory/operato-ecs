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
    },
    {
      connector: 'indi-robot',
      host: '192.168.1.207',
      port: 8818,
      name: 'indi@192.168.1.207'
    }
  ],
  scenariosPath: 'scenarios'
}
