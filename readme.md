<!-- markdownlint-disable MD026 MD028 MD033 MD041 -->

<div align="center">
  <a href="https://koishi.chat/" target="_blank">
    <img width="160" src="https://koishi.chat/logo.png" alt="logo">
  </a>

<h1><ruby>koishi-plugin-simple-ssh<rp>(</rp><rt>简易SSH功能</rt><rp>)</ruby></h1>

[![npm](https://img.shields.io/npm/v/koishi-plugin-simple-ssh?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-simple-ssh)

</div>

## ⚠️SSH功能涉及服务器安全问题，请务必对指令权限进行严格管理

## ⚠️本插件仅供学习参考，任何直接或间接由本插件造成的损失，插件本人概不负责

## 📖 介绍

在Koishi上使用SSH执行简易的指令

本人纯编程白痴，只会Ctrl C/V，有bug请见谅qwq

## 📦 功能

- [x] 查看录入的SSH服务器列表
- [x] 连接SSH并执行指令
- [ ] 快捷执行指令

功能说明请使用`help ssh`获取

连接SSH后发送的任何消息都将被视为SSH输入指令，取消连接可使用 `exit` 或在60s内无任何输入

---

## 📝 更新历史

### 0.1.0

- 初次发布，支持SSH列表与SSH连接
