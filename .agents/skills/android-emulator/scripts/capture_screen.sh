#!/usr/bin/env bash
set -e
export ANDROID_HOME=/home/mittai/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools

OUTPUT="${1:-/tmp/emulator_screen.png}"
adb exec-out screencap -p > "$OUTPUT"
echo "Screenshot saved to $OUTPUT"
