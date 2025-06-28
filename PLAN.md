# Project Plan: Enkrypt-Chan App

> Check-list plan for whole project, for quick TODOs list [TODO.md](TODO.md)

## Phase 1: Basic Chat App (MVP)

- [ ] Design and implement user registration & login
- [ ] Allow searching for users by username
- [ ] connect with backend
- [ ] Create chat UI (CLI, TUI, or Web)
  - [ ] Web UI with React/Next.js
  - [ ] CLI/TUI with Rust
- [ ] Store plain-text message history (client/server)
- [ ] Ensure basic stability and usability
- [ ] Display message history in chat UI
- [ ] Display unread message in chat list
- [ ] separate new unread messages with a divider
- [ ] Send notification for new messages
- [ ] Implement profile picture upload

## Phase 2: End-to-End Encryption (E2EE)

- [ ] Proper E2E encryption system

## Phase 3: Media Support

- [ ] Enable users to send image/file messages
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

