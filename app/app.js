import { createApp } from 'https://unpkg.com/vue@3.4.29/dist/vue.esm-browser.prod.js';

export const appOptions = {
  template: `
    <div>
      <h1>{{ title }}</h1>
      <h2>{{ currentStage }}</h2>
      <h3>{{ elapsedTimeInPhase1 }}</h3>
    </div>
  `,
  data() {
    return {
      title: ' Test Welcome to Vue.js Test',
      currentStage: 'phase1',
      elapsedTimeInPhase1: 0,
      expireMinutes: 15,
    }
  },
  created() {
    this.startPhase1Period();
  },
  methods: {
    startPhase1Period() {
      const countdownTimer = () => {
        this.elapsedTimeInPhase1++;
        console.log(this.elapsedTimeInPhase1);

        if (this.elapsedTimeInPhase1 == 10) {
          this.currentStage = 'phase2';
          this.startPhase2Period();
        } else {
          setTimeout(countdownTimer, 1000);
        }
      };
      setTimeout(countdownTimer, 1000);
    },
    startPhase2Period() {
      // phase2の処理
      console.log("this is startPhase2Period");
      this.setCookie();
    },
    setCookie() {
      const now = new Date();
      const expires = new Date(now.getTime() + this.expireMinutes * 60 * 1000).toUTCString();
      console.log(expires);
      document.cookie = `hoge=true; expires=${expires}; path=/;`
    },
  },
};

export const app = createApp(appOptions);
