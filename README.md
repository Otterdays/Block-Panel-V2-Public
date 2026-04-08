# 🧊 BlockPanel (Portable)

Welcome to the public distribution repository for **BlockPanel**—the native, standalone Minecraft server manager for Windows.

This repository contains the latest **Portable Executables** and **Installers** for the BlockPanel project.

---

## 🚀 Get Started

1. **Download**: Go to the [Releases](https://github.com/Otterdays/Block-Panel-V2-Public/releases) or download the latest `.exe` from this repository.
2. **Run**: Double-click the installer to set up BlockPanel on your system.
3. **Portable Mode**: To run the app in a truly portable way (storing all data in the same folder), create an empty file named `portable.txt` in the same directory as the installed `BlockPanel.exe`.

---

## ✨ Key Features

- **Lifecycle Control**: Start, stop, and restart your server with a single click.
- **Live Console**: Real-time log streaming and command input.
- **JAR Manager**: Automatic downloads for every Minecraft version (Releases & Snapshots).
- **Mod Browser**: Integrated Modrinth search and one-click installation.
- **Zero Configuration**: No web servers, no Docker, no complex setup. Just your server, managed.

---

## 🛠️ Portable Mode

BlockPanel is designed to be lightweight. By default, it uses the standard Windows AppData directory for settings. However, you can force **Portable Mode** to keep your entire server management suite on a USB drive or a specific project folder:

1. Place `BlockPanel.exe` in your desired folder.
2. Ensure a `portable.txt` file exists in that same folder.
3. All configurations (`server_config.json`) and JAR downloads (`/jars`) will now stay within that local folder.

---

## 🔒 Security & Privacy

- **Local First**: BlockPanel is a local-only tool. Your server data, credentials, and configurations never leave your machine.
- **Direct Integration**: Commands are sent directly to your Java process via standard I/O pipes.
- **Verified Downloads**: All mod and JAR downloads are verified against official hashes.

---

> [!NOTE]
> This is a distribution-only repository. The core source code for BlockPanel is private. To report bugs or request features, please open an issue in this repository.

<div align="center">
<sub>Built with Tauri & Rust for the Minecraft Community</sub>
</div>
