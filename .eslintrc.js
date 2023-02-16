module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  "rules": {
    "prefer-const": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/no-shadow": 0,
    "@typescript-eslint/dot-notation": 0,
    "react-hooks/exhaustive-deps": 0,
    // 关闭 type导入警告
    "@typescript-eslint/consistent-type-imports": 0
  }
};
