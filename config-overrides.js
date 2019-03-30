const { override, fixBabelImports, addLessLoader, addWebpackResolve, addWebpackAlias } = require('customize-cra');
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
  addWebpackAlias({
      ["@utils"]: path.resolve(__dirname, 'src', 'utils'),
      ["@utils/ui"]: path.resolve(__dirname, 'src', 'utils', 'ui'),
      ["@utils/fabric"]: path.resolve(__dirname, 'src', 'utils', 'fabric'),
      ["@utils/math"]: path.resolve(__dirname, 'src', 'utils', 'math'),
      ["@customIcons"]: path.resolve(__dirname, 'src', 'icons'),
      ["@fonts"]: path.resolve(__dirname, 'src', 'fonts'),
      ["@contexts"]: path.resolve(__dirname, 'src', 'contexts'),
      ["@components"]: path.resolve(__dirname, 'src', 'components'),
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#f37920' }
  })
);
