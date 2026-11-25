import os
import wave
import asyncio
import numpy as np
import edge_tts

OUTPUT_DIRS = [
    os.path.join("public", "audio"),
    os.path.join("eduboard-guidebook-video", "public", "audio"),
]
for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)
SAMPLE_RATE = 44100

def save_wav(filename: str, data: np.ndarray):
    max_val = np.max(np.abs(data))
    if max_val > 0:
        data = data / max_val * 0.85
    int_data = np.int16(data * 32767)
    for out_dir in OUTPUT_DIRS:
        filepath = os.path.join(out_dir, filename)
        with wave.open(filepath, "w") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(SAMPLE_RATE)
            wf.writeframes(int_data.tobytes())
        print(f"[SFX] Berhasil dibuat: {filepath}")

def generate_all_sfx():
    dur = 0.09
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    save_wav("sfx-jst-click.wav", np.exp(-t * 140) * np.sin(2 * np.pi * 2400 * t) + np.exp(-t * 60) * np.sin(2 * np.pi * 420 * t) * 0.7)

    dur = 0.14
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    press = np.exp(-t * 160) * np.sin(2 * np.pi * 1800 * t)
    release_t = np.maximum(0, t - 0.06)
    release = np.where(t >= 0.06, np.exp(-release_t * 160) * np.sin(2 * np.pi * 2100 * release_t) * 0.7, 0)
    save_wav("sfx-button-press.wav", press + release)

    notes = [523.25, 659.25, 783.99]
    note_dur = 0.12
    chime = np.array([])
    for freq in notes:
        t_n = np.linspace(0, note_dur, int(SAMPLE_RATE * note_dur), endpoint=False)
        env = np.exp(-t_n * 18) * (1 - np.exp(-t_n * 300))
        wave_n = env * (np.sin(2 * np.pi * freq * t_n) + 0.3 * np.sin(2 * np.pi * freq * 2 * t_n))
        chime = np.concatenate([chime, wave_n])
    save_wav("sfx-safe-chime.wav", chime)

    dur = 0.35
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    beep1 = np.where(t < 0.14, np.sin(2 * np.pi * 220 * t) + 0.5 * np.sin(2 * np.pi * 440 * t), 0)
    beep2 = np.where((t >= 0.18) & (t < 0.32), np.sin(2 * np.pi * 220 * t) + 0.5 * np.sin(2 * np.pi * 440 * t), 0)
    save_wav("sfx-danger-buzz.wav", beep1 + beep2)

    dur = 0.65
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    env = np.sin(np.pi * (t / dur)) ** 2
    freq_sweep = np.linspace(300, 950, len(t))
    hum = np.sin(2 * np.pi * freq_sweep * t) * 0.5
    shimmer = np.sin(2 * np.pi * 1600 * t) * np.sin(2 * np.pi * 25 * t) * 0.3
    save_wav("sfx-electric-flow.wav", env * (hum + shimmer))

    dur = 0.30
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    rng = np.random.default_rng(42)
    noise = rng.normal(0, 1, len(t))
    kernel = np.ones(45) / 45
    filtered = np.convolve(noise, kernel, mode="same")
    env = np.sin(np.pi * (t / dur)) ** 1.5
    save_wav("sfx-whoosh.wav", filtered * env)

def generate_bgm():
    bpm = 120
    beat_dur = 60.0 / bpm  # 0.5s
    bars = 4
    dur = bars * 4 * beat_dur  # 8.0s
    total_samples = int(SAMPLE_RATE * dur)
    t = np.linspace(0, dur, total_samples, endpoint=False)
    audio = np.zeros(total_samples, dtype=np.float64)

    # Chords (Am - F - C - G) frequencies (Hz)
    chords = [
        [220.0, 261.63, 329.63],  # Am
        [174.61, 220.0, 261.63],  # F
        [261.63, 329.63, 392.0],  # C
        [196.0, 246.94, 293.66],  # G
    ]
    chord_dur = 2.0  # 4 beats each

    # 1. Warm ambient synth pad
    for i, chord in enumerate(chords):
        t_start = i * chord_dur
        mask = (t >= t_start) & (t < t_start + chord_dur)
        t_c = t[mask] - t_start
        # Smooth attack-release envelope for each chord
        env = np.sin(np.pi * (t_c / chord_dur)) ** 1.5
        for freq in chord:
            pad = 0.15 * (np.sin(2 * np.pi * freq * t[mask]) + 0.3 * np.sin(2 * np.pi * (freq * 2) * t[mask]))
            audio[mask] += pad * env

    # 2. Tech rhythmic 16th-note pluck arpeggio (16 notes per bar = 64 notes)
    arp_notes = [440.0, 523.25, 659.25, 523.25, 349.23, 440.0, 523.25, 440.0, 523.25, 659.25, 783.99, 659.25, 392.0, 493.88, 587.33, 493.88]
    note_dur = beat_dur / 4.0  # 0.125s (16th note)
    for step in range(64):
        freq = arp_notes[step % len(arp_notes)]
        step_start = step * note_dur
        n_samples = int(SAMPLE_RATE * note_dur)
        idx_start = int(step_start * SAMPLE_RATE)
        idx_end = min(idx_start + n_samples, total_samples)
        sub_len = idx_end - idx_start
        if sub_len > 0:
            t_sub = np.linspace(0, sub_len / SAMPLE_RATE, sub_len, endpoint=False)
            decay = np.exp(-t_sub * 25.0)
            pluck = 0.12 * np.sin(2 * np.pi * freq * t_sub) * decay
            audio[idx_start:idx_end] += pluck

    # 3. Soft muted low-tech pulse on every quarter note (beat)
    for beat in range(16):
        beat_start = beat * beat_dur
        n_samples = int(SAMPLE_RATE * 0.1)
        idx_start = int(beat_start * SAMPLE_RATE)
        idx_end = min(idx_start + n_samples, total_samples)
        sub_len = idx_end - idx_start
        if sub_len > 0:
            t_sub = np.linspace(0, sub_len / SAMPLE_RATE, sub_len, endpoint=False)
            freq_sweep = 120.0 * np.exp(-t_sub * 40.0)
            phase = 2 * np.pi * np.cumsum(freq_sweep) / SAMPLE_RATE
            pulse = 0.18 * np.sin(phase) * np.exp(-t_sub * 30.0)
            audio[idx_start:idx_end] += pulse

    save_wav("bgm-tech-loop.wav", audio)

async def generate_all_vo():
    voice = "id-ID-ArdiNeural"
    scripts = {
        "vo-scene1.mp3": "Halo! Di misi kali ini, kita akan belajar menggunakan sensor cahaya atau LDR. LDR adalah resistor yang nilai hambatannya berubah sesuai intensitas cahaya. Saat terang hambatannya kecil, dan saat gelap hambatannya menjadi sangat besar.",
        "vo-scene2.mp3": "Sekarang mari kita rangkai. Hubungkan modul LDR dan modul LED ke Base Board EDU-BOARD menggunakan konektor JST asimetris. Bentuknya dirancang khusus sehingga mustahil terbalik. Setelah terpasang, tekan tombol Check. Lampu indikator hijau menyala, menandakan rangkaian aman dari korsleting.",
        "vo-scene3.mp3": "Mari kita uji coba! Coba tutup permukaan sensor LDR dengan tanganmu. Ketika cahaya terhalang, hambatan LDR melonjak dan memicu modul LED menyala otomatis. Buka tanganmu, dan lampu kembali padam.",
        "vo-scene4.mp3": "Prinsip sederhana inilah yang digunakan pada lampu jalan dan lampu taman otomatis di sekitar kita. Selamat, kamu telah menguasai logika sensor cahaya bersama EDU-BOARD!",
    }
    for filename, text in scripts.items():
        primary_filepath = os.path.join(OUTPUT_DIRS[0], filename)
        communicate = edge_tts.Communicate(text, voice, rate="+5%")
        await communicate.save(primary_filepath)
        for extra_dir in OUTPUT_DIRS[1:]:
            extra_filepath = os.path.join(extra_dir, filename)
            with open(primary_filepath, "rb") as src, open(extra_filepath, "wb") as dst:
                dst.write(src.read())
        print(f"[VO]  Berhasil dibuat: {primary_filepath}")

if __name__ == "__main__":
    generate_all_sfx()
    generate_bgm()
    asyncio.run(generate_all_vo())
    print("=== Selesai! Semua file siap di folder public/audio/ ===")
