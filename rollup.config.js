
import nodeResolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';

export default {
  plugins: [
    nodeResolve({
      main: true,
      jsnext: true
    }),
    buble()
  ]
}
