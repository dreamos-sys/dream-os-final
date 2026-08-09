# 🧩 Dream OS — Public API Reference

> Auto-generated: 2026-08-09 09:29 • Source: scan `window.*` di semua modul

Daftar semua fungsi public yang diekspos tiap modul (dipakai lintas modul / inline handler).

## 📄 `index.html`

**28 public functions:**

```javascript
window.__dreamosClearAllIntervals()
window.__dreamosRegisterInterval()
window.__dvHash()
window.__dvVerify()
window.closeCastModal()
window.debouncedUpdateSlides()
window.doSecureLogin()
window.forceRefresh()
window.getUserRole()
window.goHome()
window.handleLogout()
window.installPWA()
window.logLoginAttempt()
window.onerror()
window.openCastModal()
window.openMod()
window.presentHere()
window.renderDashboard()
window.safeStorageSet()
window.shareToTV()
window.showToast()
window.startPresenceHeartbeat()
window.stopPresenceHeartbeat()
window.subscribePush()
window.syncCloudData()
window.toggleCastQR()
window.unsubscribePush()
window.updateDashboardSlides()
```

## 📄 `modules/about.html`

**2 public functions:**

```javascript
window.__aboutCleanup()
window.goHome()
```

## 📄 `modules/asset.html`

**19 public functions:**

```javascript
window.deleteAsset()
window.downloadAssetQR()
window.editAsset()
window.exportAssetCSV()
window.goHome()
window.importAssetCSV()
window.navModule()
window.previewPhoto()
window.printAssetRegister()
window.renderTimeline()
window.resetForm()
window.saveAsset()
window.showAssetQR()
window.showAssetTimeline()
window.sortAsset()
window.submitRABAset()
window.switchTab()
window.syncAssetToCloud()
window.timelineNav()
```

## 📄 `modules/booking.html`

**23 public functions:**

```javascript
window.__bookingCleanup()
window.addBooking()
window.approveBooking()
window.checkLainLain()
window.closeQR()
window.decreaseAlat()
window.deleteBookingById()
window.editAlatQuantity()
window.exportCSV()
window.goHome()
window.goHomeSafe()
window.increaseAlat()
window.openGoogleCalendar()
window.pullBookingsFromCloud()
window.rejectBooking()
window.resetAlat()
window.showBookingDetail()
window.showQR()
window.showQRById()
window.syncToCloud()
window.toggleZeroAlat()
window.updateAlatDisplay()
window.updateAlatVisual()
```

## 📄 `modules/commandcenter.html`

**46 public functions:**

```javascript
window.__danaPinCancel()
window.__danaPinSubmit()
window.addRevisionNote()
window.advExportReport()
window.calNext()
window.calPrev()
window.calToday()
window.clearSearch()
window.closeEditModal()
window.createNewUser()
window.deleteUser()
window.doApprove()
window.exportLocalBackup()
window.goHomeHandler()
window.healOfflinePhotos()
window.importLocalBackup()
window.openEditModal()
window.refreshAll()
window.renderActivity()
window.renderAdvAnalytics()
window.renderApprovals()
window.renderArchive()
window.renderCalList()
window.renderCalendar()
window.renderChart()
window.renderDanaTab()
window.renderDevMonitor()
window.renderInbox()
window.renderSmartAnalytics()
window.renderStokAnalytics()
window.renderUserHealth()
window.renderUsers()
window.resetUserPassword()
window.runGlobalSearch()
window.saveAnnouncements()
window.saveEditUser()
window.setAdvPeriod()
window.setStokActionFilter()
window.setStokPeriod()
window.setStokUserFilter()
window.shareDirectPDF()
window.showDayEvents()
window.submitStokPlanToDana()
window.switchTab()
window.unlockUser()
window.uploadArchiveFile()
```

## 📄 `modules/janitor-indoor.html`

**15 public functions:**

```javascript
window.cetakLaporan()
window.changeDate()
window.clearPhoto()
window.closeHistory()
window.exportCSV()
window.handlePhoto()
window.historyNav()
window.resetShift()
window.saveMeta()
window.setShift()
window.showHistory()
window.submitToCloud()
window.toggleExpand()
window.toggleItem()
window.uploadPhoto()
```

## 📄 `modules/janitor-outdoor.html`

**16 public functions:**

```javascript
window.cetakLaporan()
window.changeDate()
window.clearPhoto()
window.closeHistory()
window.exportCSV()
window.handlePhoto()
window.historyNav()
window.resetShift()
window.saveMeta()
window.setShift()
window.showHistory()
window.submitToCloud()
window.toggleExpand()
window.toggleItem()
window.toggleWeekly()
window.uploadPhoto()
```

## 📄 `modules/k3.html`

**9 public functions:**

```javascript
window.__k3Cleanup()
window.clearPhoto()
window.forceK3Sync()
window.goHome()
window.handlePhoto()
window.renderList()
window.setSyncStatus()
window.tampilkanLaporan()
window.uploadTrappedData()
```

## 📄 `modules/maintenance.html`

**24 public functions:**

```javascript
window.__maintCleanup()
window.clearDoneWO()
window.closeBrg()
window.delWO()
window.doPM()
window.doneWO()
window.goHome()
window.openConsume()
window.openEqModal()
window.reconcileK3()
window.resetDraft()
window.saveConsume()
window.saveEqModal()
window.setNote()
window.setResult()
window.setView()
window.setWOF()
window.spawnWO()
window.spawnWOFromAsset()
window.submitAsset()
window.submitInspection()
window.submitWO()
window.toggleAssetAdd()
window.toggleWOAdd()
```

## 📄 `modules/profile.html`

**9 public functions:**

```javascript
window.__profileCleanup()
window.bindThisDevice()
window.changePassword()
window.goHomeSafe()
window.handleLogout()
window.loadMyBookings()
window.saveNotifications()
window.saveProfile()
window.switchTab()
```

## 📄 `modules/qr.html`

**2 public functions:**

```javascript
window.__qrCleanup()
window.goHome()
```

## 📄 `modules/security.html`

**26 public functions:**

```javascript
window.__secCleanup()
window.__secMarkK3()
window.__secUndoK3()
window.addActivityRow()
window.applyRevision()
window.clearSignature()
window.closeQRScanner()
window.closeSignature()
window.deleteActivity()
window.goHome()
window.loadDailyReport()
window.openQRScanner()
window.openRevisionModal()
window.openSignature()
window.publishSlide()
window.renderActivityTable()
window.renderMatrix()
window.renderPersonnelTable()
window.saveDailyReport()
window.saveSignature()
window.shiftPeriod()
window.startNFCScan()
window.toggleShift()
window.updateActivity()
window.updateDashboardSlide()
window.updatePersonnel()
```

## 📄 `modules/setting.html`

**12 public functions:**

```javascript
window.__settingCleanup()
window.changeLang()
window.exportSettings()
window.goHomeSafe()
window.goToLanguageTab()
window.importSettings()
window.resetAll()
window.resetLangToAuto()
window.switchTab()
window.toggleSetting()
window.updateFontSize()
window.updateGlass()
```

## 📄 `modules/stok.html`

**8 public functions:**

```javascript
window.addStok()
window.clearAll()
window.deleteStokById()
window.exportCSV()
window.goHome()
window.setPeriod()
window.switchTab()
window.syncToCloud()
```
