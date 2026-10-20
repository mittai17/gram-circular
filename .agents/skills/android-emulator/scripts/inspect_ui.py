#!/usr/bin/env python3
import subprocess
import xml.etree.ElementTree as ET
import re
import sys
import os

os.environ["PATH"] += ":/home/mittai/Android/sdk/platform-tools:/home/mittai/Android/sdk/emulator"

def dump_ui():
    subprocess.run(["adb", "shell", "uiautomator", "dump", "/data/local/tmp/window_dump.xml"], check=True, stdout=subprocess.DEVNULL)
    res = subprocess.run(["adb", "exec-out", "cat", "/data/local/tmp/window_dump.xml"], capture_output=True, text=True, check=True)
    return res.stdout

def parse_bounds(bounds_str):
    # format: [x1,y1][x2,y2]
    m = re.match(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]", bounds_str)
    if m:
        x1, y1, x2, y2 = map(int, m.groups())
        cx = (x1 + x2) // 2
        cy = (y1 + y2) // 2
        return (x1, y1, x2, y2, cx, cy)
    return None

def main():
    try:
        xml_content = dump_ui()
    except Exception as e:
        print(f"Error dumping UI: {e}", file=sys.stderr)
        sys.exit(1)

    if not xml_content.strip():
        print("Empty UI dump", file=sys.stderr)
        sys.exit(1)

    root = ET.fromstring(xml_content)
    elements = []

    for node in root.iter("node"):
        text = node.get("text", "")
        desc = node.get("content-desc", "")
        res_id = node.get("resource-id", "")
        cls = node.get("class", "")
        bounds_str = node.get("bounds", "")
        clickable = node.get("clickable", "false") == "true"

        label = text or desc
        if label or clickable:
            b = parse_bounds(bounds_str)
            if b:
                x1, y1, x2, y2, cx, cy = b
                elements.append({
                    "label": label,
                    "clickable": clickable,
                    "class": cls.split(".")[-1],
                    "center": f"({cx}, {cy})",
                    "tap_cmd": f"adb shell input tap {cx} {cy}",
                    "bounds": bounds_str
                })

    print(f"--- UI Elements ({len(elements)} found) ---")
    for el in elements:
        click_tag = "[CLICKABLE]" if el["clickable"] else "           "
        print(f"{click_tag} {el['center']:<12} {el['label']:<40} (class: {el['class']})")

if __name__ == "__main__":
    main()
