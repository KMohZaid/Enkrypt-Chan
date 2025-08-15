# Project Plan: Enkrypt-Chan App

> Check-list plan for whole project, for quick TODOs list [TODO.md](TODO.md)

## Phase 1: Basic Chat App (MVP)

- [x] Design and implement user registration & login
- [x] Allow searching for users by username
  - [ ] Improve search feature
- [x] connect with backend
- [ ] Create chat UI (CLI, TUI, or Web)
  - [ ] Web UI with React/Next.js (ONGOING)
  - [ ] CLI/TUI with Rust (IN FUTURE, NOT PRIORITY)
- [x] Store plain-text message history (client/server)
- [x] Display message history in chat UI
  - [x] Add "Jump to Bottom" button
- [x] Display unread message in chat list
- [x] separate new unread messages with a divider
- [x] Implement emoji picker
  - [ ] Add reaction support on messages
- [ ] Send notification for new messages
- [ ] Implement profile picture upload
  > Using dummy image for now from [pravtar](https://pravatar.cc/)
- [ ] Implement feature for updating profile picture and name
- [x] Indicate if user is online is connected to server or not
- [ ] Indicate contact online status
- [ ] Queue messages to send if connection is not established with server
    > No queue needed for receiving messages as initially they are received via API
- [ ] Improve dark theme and fix light theme 
    > Right now, light theme is just like discord's light theme...
- [ ] Ensure basic stability and usability

## Phase 2: End-to-End Encryption (E2EE)

- [ ] Proper E2E encryption system

## Phase 3: Media Support

- [ ] Enable users to send image/file messages
- [ ] Implement multi-media support (images, videos, files, etc.)
  - [ ] Add in-app media preview (selected image, video and file)
  - [ ] Add in-app camera and audio recording
  - [ ] Add in-app video/audio player
- [ ] Encrypt files using a symmetric key before upload
- [ ] Add media preview or download support on recipient side

## Phase 4: Encrypted Backups

- [ ] Allow exporting encrypted message + key backup
- [ ] Use password-based key derivation
- [ ] Allow encrypted cloud or local storage for backups
- [ ] Implement backup restore
- [ ] Ensure recovery is possible even if app is reinstalled

## Phase 5: QR Code Connect + Multi-Device Support

- [ ] Add QR code generation for identity sync (session key/public key)
- [ ] Scan QR to add new device securely
- [ ] Sync conversations securely to second device
- [ ] Manage linked device sessions (e.g., logout, expire, revoke)
- [ ] Implement trust model for verified devices

## Bonus / Stretch Goals

- [ ] Add support for disappearing messages
- [ ] Implement group chats with multi-user E2E
- [ ] Package the client app as a standalone executable or installer

