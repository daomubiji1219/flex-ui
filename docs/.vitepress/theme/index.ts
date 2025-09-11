import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { h } from 'vue';

import DemoContainer from './components/DemoContainer.vue';
import ApiTable from './components/ApiTable.vue';
import ReactDemo from './components/ReactDemo.vue';

const theme: Theme = {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {});
  },
  enhanceApp({ app }) {
    app.component('DemoContainer', DemoContainer);
    app.component('ApiTable', ApiTable);
    app.component('ReactDemo', ReactDemo);
  },
};

export default theme;
