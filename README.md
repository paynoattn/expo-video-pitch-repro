# expo-video: distorted speech at playbackRate > 1 on iOS

Minimal repro for an expo-video (SDK 58, `expo-video@58.0.13`) iOS issue.

With `preservesPitch` at its default (`true`), expo-video sets every `AVPlayerItem`'s
`audioTimePitchAlgorithm` to `.spectral` (`ios/VideoPlayer.swift`). At 1.5x / 2x, voices
come out warbly / phasey / "metallic". The same content in apps using AVPlayer's default
(`.timeDomain`, Apple's speech-oriented algorithm) sounds clean. Very noticeable on headphones
(we noticed it over Bluetooth on an iPad).

## Run

```bash
npm install
npx expo run:ios --device   # development build; a physical device is best for judging audio
```

The app plays a public HLS stream with dialogue ("Tears of Steel"). Tap **1.5x** or **2x** and listen.

## Compare with `.timeDomain`

`fix/expo-video+58.0.13.patch` swaps `.spectral` for `.timeDomain` in the three places
expo-video sets the algorithm. `package.json` sets `expo.autolinking.ios.buildFromSource: ["ExpoVideo"]`:
without it, iOS builds link the precompiled `ExpoVideo.xcframework` and ignore the patched source.

```bash
npx --yes patch-package --patch-dir fix
npx expo run:ios --device
```

At the same rates, speech is clean.
