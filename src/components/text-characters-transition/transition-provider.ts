import type anime from 'animejs'

export type AnimeFuncParam = (
  /** 目前 index。例：第 3 個字，此值就是 2 */
  index: number,
  /** 動畫總數。例：共 10 個字，此值就會是 10 */
  length: number
) => anime.AnimeParams

/** 過場動畫名稱 */
export enum TransitionName {
  /** 淡入淡出 */
  FADE = 'fade',
}

export const transitionProvider: Record<
  TransitionName,
  /** 提供 enter 與 leave 動畫 */
  {
    enter: AnimeFuncParam;
    leave: AnimeFuncParam;
  }
> = {
  [TransitionName.FADE]: {
    enter: (i) => ({
      opacity: 1,
      delay: i * 50,
    }),
    leave: (i) => ({
      opacity: 0,
      delay: i * 50,
    }),
  },
}
