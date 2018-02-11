import { TweenMax } from 'gsap';

const topRatedDuration = 0.33;

export default {
  showResults(targets, cb, index) {
    TweenMax.to(targets, topRatedDuration, {
      opacity: 1,
      delay: index * 0.09,
      y: 0,
      onComplete() {
        cb ? cb() : null;
      },
    });
  },
  hideResults(target, cb) {
    return TweenMax.to(target, 0.4, {
      opacity: 0,
      y: 200,
      onComplete() {
        cb ? cb() : null;
      },
    });
  },
  showProperty(target, cb) {
    return TweenMax.to(target, 0.5, {
      opacity: 1,
      y: 0,
      onComplete() {
        cb ? cb() : null;
      },
    });
  },
  hideProperty(target, cb) {
    return TweenMax.to(target, 0.5, {
      opacity: 1,
      onComplete() {
        cb ? cb() : null;
      },
    });
  },

  showSaved(targets, cb, index) {
    TweenMax.to(targets, topRatedDuration, {
      opacity: 1,
      delay: index * 0.09,
      y: 0,
      onComplete() {
        cb ? cb() : null;
      },
    });
  },
};
