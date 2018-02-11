import { TweenMax } from 'gsap';

const topRatedDuration = 0.33;

export default {
  showResults(targets, cb, index) {
    TweenMax.to(targets, topRatedDuration, {
      opacity: 1,
      delay: index * 0.09,
      y: 0,
      onComplete() {
        if (cb) {
          cb();
        }
      },
    });
  },
  hideResults(target, cb) {
    return TweenMax.to(target, 0.4, {
      opacity: 0,
      y: 200,
      onComplete() {
        if (cb) {
          cb();
        }
      },
    });
  },
  showProperty(target, cb) {
    return TweenMax.to(target, 0.5, {
      opacity: 1,
      y: 0,
      onComplete() {
        if (cb) {
          cb();
        }
      },
    });
  },
  showSaved(targets, cb, index) {
    TweenMax.to(targets, topRatedDuration, {
      opacity: 1,
      delay: index * 0.09,
      y: 0,
      onComplete() {
        if (cb) {
          cb();
        }
      },
    });
  },
};
