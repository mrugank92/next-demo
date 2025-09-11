module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          targets: {
            browsers: [
              '> 1%',
              'last 2 versions',
              'not dead',
              'not ie 11',
              'not op_mini all'
            ]
          },
          useBuiltIns: 'usage',
          corejs: 3,
          modules: false,
          exclude: [
            // Exclude polyfills for modern features that are widely supported
            'es.array.at',
            'es.array.flat',
            'es.array.flat-map',
            'es.object.from-entries',
            'es.object.has-own',
            'es.string.trim-end',
            'es.string.trim-start'
          ]
        }
      }
    ]
  ],
  env: {
    production: {
      plugins: [
        ['transform-remove-console', { exclude: ['error', 'warn'] }]
      ]
    }
  }
};