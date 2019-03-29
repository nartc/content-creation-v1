const { override, fixBabelImports, addLessLoader, addWebpackResolve } = require('customize-cra');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addWebpackResolve({
    alias: {
      '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/ant-icons.js')
    }
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#f37920' }
  })
);
