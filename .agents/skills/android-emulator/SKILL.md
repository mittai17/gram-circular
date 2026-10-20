---
name: android-emulator
description: >-
  Use this skill to operate, inspect, automate, and test mobile applications running on Android emulators and devices via ADB and MCP tools.
---

# Android Emulator Operation Skill

This skill provides comprehensive instructions, ADB automation scripts, and UI testing utilities for operating Android emulators and physical devices.

## Environment Setup
Ensure Android SDK paths are set in your execution environment:
```bash
export ANDROID_HOME=/home/mittai/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
```

## Key Capabilities

### 1. Device Inspection & Status
- **List devices**: `adb devices -l`
- **Check boot completion**: `adb shell getprop sys.boot_completed` (returns `1` when ready)
- **Screen resolution**: `adb shell wm size` (e.g., Pixel 10 Pro: `1280x2856`)
- **Current active window**: `adb shell dumpsys window | grep -E "mCurrentFocus|mFocusedApp"`

### 2. UI Automation & Interactions
- **Tap by coordinates**: `adb shell input tap <X> <Y>`
- **Type text**: `adb shell input text "<STRING>"` (spaces escaped or replaced by `%s`)
- **Key events**:
  - Home: `adb shell input keyevent 3`
  - Back: `adb shell input keyevent 4`
  - Enter: `adb shell input keyevent 66`
  - Wake / Unlock: `adb shell input keyevent 82`
- **Swipe / Scroll**: `adb shell input swipe <X1> <Y1> <X2> <Y2> [duration_ms]`
  - Scroll down: `adb shell input swipe 640 2000 640 600 300`
  - Scroll up: `adb shell input swipe 640 600 640 2000 300`

### 3. Screen Capture & Verification
- **Capture screenshot**:
  ```bash
  adb exec-out screencap -p > /tmp/screen_<name>.png
  ```
- **Inspect UI hierarchy XML**:
  ```bash
  adb shell uiautomator dump /data/local/tmp/window_dump.xml
  adb exec-out cat /data/local/tmp/window_dump.xml > /tmp/window_dump.xml
  ```

### 4. Helper Scripts
Run the automated test helper in `scripts/`:
- `scripts/capture_screen.sh <output_path>`
- `scripts/inspect_ui.py`: Dumps clickable bounding boxes and text from current screen.
