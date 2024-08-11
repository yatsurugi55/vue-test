import { mount } from '@vue/test-utils';
import { appOptions } from '../app/app.js';

//追加テスト
//- 短時間滞在ユーザーにはクッキーが付与されないこと
//- 確率計算
//- 時間経過後に文字がレンダリング
jest.mock('https://unpkg.com/vue@3.4.29/dist/vue.esm-browser.prod.js', () => ({
  createApp: jest.fn(() => ({
    mount: jest.fn()
  }))
}), { virtual: true });

describe('Unit Tests', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(appOptions);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initializing', () => {
    test('createApp 対象の変数が読み込める', () => {
      expect(appOptions).toBeDefined();
    });
    test('Vue が正しくマウントできている', () => {
      expect(wrapper.vm).toBeTruthy();
    });
    test('変数が正しく読み込める', () => {
      expect(wrapper.vm.currentStage).toBe('phase1');
    });
  });

  describe('startPhase1Period メソッド', () => {
    beforeEach(() => { 
      wrapper.vm.startPhase2Period = jest.fn();
    });

    test('9秒後はまだPhase1のまま', async () => {
      expect(wrapper.vm.currentStage).toBe('phase1');

      wrapper.vm.startPhase1Period();

      jest.advanceTimersByTime(9000);

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.currentStage).toBe('phase1');
    });

    test('10秒経過してPhase2に変化し、startPhase2Period() が実行される', async () => {
      expect(wrapper.vm.currentStage).toBe('phase1');

      wrapper.vm.startPhase1Period();

      jest.advanceTimersByTime(10000);

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.currentStage).toBe('phase2');
      expect(wrapper.vm.startPhase2Period).toHaveBeenCalledTimes(1);
    });
  });
  describe('startPhase2Period メソッド', () => {
    beforeEach(() => {
      wrapper.vm.setCookie = jest.fn();
    })
    test('setCookieが実行される', () => {
      wrapper.vm.startPhase2Period();

      expect(wrapper.vm.setCookie).toHaveBeenCalledTimes(1);
    });
  });
  describe('setCookieメソッド', () => {
    let cookie;
    let newCookie;
    let mockDate;

    beforeEach(() => {
      Object.defineProperty(document, 'cookie', {
        get: jest.fn(() => cookieJar),
        set: jest.fn((newCookie) => {
          cookie += newCookie + ';'
        }),
        configurable: true
      });

      // new Date なので Dateオブジェクト全体をモック
      mockDate = new Date('2024-07-23T10:00:00.000Z');
      global.Date = class extends Date {
        constructor() {
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      }
    });
    test('クッキーが設定される', () => {
      wrapper.vm.setCookie();
      expect(cookie).toContain('hoge=true');
    });
    test('クッキーに有効期限が設定される', () => {
      wrapper.vm.setCookie();

      const cookieString = cookie;
      const expiresMatch = cookieString.match(/expires=([^;]+)/);
      const expiresDate = new Date(expiresMatch[1]);

      expect(expiresDate.getFullYear()).toBe(2024);
      expect(expiresDate.getMonth() + 1).toBe(7);
      expect(expiresDate.getDate()).toBe(23);
      expect(expiresDate.getHours()).toBe(10);
      expect(expiresDate.getMinutes()).toBe(0);
      expect(expiresDate.getSeconds()).toBe(0);
    });
  });
});
