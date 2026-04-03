// Sound Manager for Math Puzzle Game
class SoundManager {
    constructor() {
        this.soundEnabled = true;
        this.audioContext = null;
        this.sounds = {};
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    // Create sound using Web Audio API
    createSound(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Play correct answer sound (positive, ascending)
    playCorrectSound() {
        if (!this.soundEnabled) return;
        
        // Play a happy ascending melody
        this.createSound(523, 0.1, 'sine', 0.2); // C5
        setTimeout(() => this.createSound(659, 0.1, 'sine', 0.2), 100); // E5
        setTimeout(() => this.createSound(784, 0.2, 'sine', 0.3), 200); // G5
    }

    // Play wrong answer sound (negative, descending)
    playWrongSound() {
        if (!this.soundEnabled) return;
        
        // Play a descending error sound
        this.createSound(300, 0.2, 'sawtooth', 0.2);
        setTimeout(() => this.createSound(200, 0.3, 'sawtooth', 0.3), 100);
    }

    // Play level up sound (celebration)
    playLevelUpSound() {
        if (!this.soundEnabled) return;
        
        // Play a celebration melody
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            setTimeout(() => this.createSound(freq, 0.2, 'sine', 0.3), index * 100);
        });
    }

    // Play game over sound (sad descending)
    playGameOverSound() {
        if (!this.soundEnabled) return;
        
        // Play a sad descending melody
        const notes = [784, 659, 523, 392]; // G5, E5, C5, G4
        notes.forEach((freq, index) => {
            setTimeout(() => this.createSound(freq, 0.3, 'triangle', 0.2), index * 150);
        });
    }

    // Play button click sound
    playClickSound() {
        if (!this.soundEnabled) return;
        this.createSound(800, 0.05, 'square', 0.1);
    }

    // Play timer warning sound (tick-tock)
    playTimerWarning() {
        if (!this.soundEnabled) return;
        this.createSound(1000, 0.05, 'square', 0.1);
    }

    // Toggle sound on/off
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    // Resume audio context (needed for some browsers)
    resumeAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();
