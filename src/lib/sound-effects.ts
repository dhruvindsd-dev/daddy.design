export const SOUND_EFFECTS = {
  click: {
    gain: 0.5,
    src: "/assets/sounds/click.wav",
  },
  "click-bounce": {
    gain: 0.6,
    src: "/assets/sounds/click-bounce.mp3",
  },
  hover: {
    gain: 0.15,
    src: "/assets/sounds/hover.wav",
  },
  success: {
    gain: 0.6,
    src: "/assets/sounds/success.wav",
  },
  toggle_off: {
    gain: 0.4,
    src: "/assets/sounds/toggle_off.wav",
  },
  toggle_on: {
    gain: 0.4,
    src: "/assets/sounds/toggle_on.wav",
  },
  "speed-down": {
    gain: 0.4,
    src: "/assets/sounds/speed-down.wav",
  },
  "speed-up": {
    gain: 0.4,
    src: "/assets/sounds/speed-up.wav",
  },
} as const;

export type SoundEffectName = keyof typeof SOUND_EFFECTS;

export const SOUND_EFFECT_NAMES = Object.keys(
  SOUND_EFFECTS,
) as SoundEffectName[];
