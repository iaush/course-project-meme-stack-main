module.exports = {
  stories: [
    '../src/**/ProjectOverviewRevised.stories.mdx',
    '../src/**/ProjectPlanning.stories.mdx',
    '../src/**/IntroductionVideo.stories.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
};
