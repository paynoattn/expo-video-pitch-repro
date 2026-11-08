import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';

// Public HLS stream with spoken dialogue (Blender's "Tears of Steel").
const SOURCE = 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8';
const RATES = [1, 1.5, 2];

export default function App() {
  const [rate, setRate] = useState(1);
  const player = useVideoPlayer(SOURCE, p => {
    p.currentTime = 60; // jump to a dialogue scene
    p.play();
  });

  const selectRate = (next: number) => {
    player.playbackRate = next; // preservesPitch is left at its default (true)
    setRate(next);
  };

  return (
    <View style={styles.container}>
      <VideoView style={styles.video} player={player} nativeControls />
      <View style={styles.row}>
        {RATES.map(r => (
          <Pressable key={r} onPress={() => selectRate(r)} style={[styles.button, r === rate && styles.selected]}>
            <Text style={styles.label}>{r}x</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.hint}>Listen to the voices at 1.5x / 2x: they sound warbly / phasey compared to AVPlayer's default.</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 16, gap: 16 },
  video: { width: '100%', aspectRatio: 16 / 9 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#333' },
  selected: { backgroundColor: '#0a84ff' },
  label: { color: '#fff', fontSize: 18, fontWeight: '600' },
  hint: { color: '#aaa', textAlign: 'center' },
});
