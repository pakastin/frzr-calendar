import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  plugins: [
    nodeResolve({
      main: true,
      jsnext: true
    })
  ]
}
