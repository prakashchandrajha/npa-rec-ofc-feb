# Forward Button Debug Guide

## 🔍 Debug Steps

### 1. Check if Forward Button Appears

**Login as recovery user and look for:**
- ✅ Green "DEBUG: Recovery User Detected" message
- ✅ Green "Forward" button

### 2. If Debug Message Shows but Button Doesn't:

The issue might be:
- Angular build cache
- Component not updated
- Browser cache

**Solutions:**
```bash
# 1. Clear Angular cache
ng cache clean

# 2. Restart dev server
ng serve

# 3. Hard refresh browser (Ctrl+F5)
```

### 3. If Debug Message Doesn't Show:

The issue is `isRecoveryUser()` returning false.

**Check browser console:**
```javascript
// Open browser console and run:
localStorage.getItem('userInfo')
```

**Expected:**
```json
{"username":"recovery","userType":"RECOVERY","division":null}
```

### 4. Test Forward API Directly:

```bash
# Get recovery users (should work)
curl -X GET http://localhost:8080/api/workflow/recovery-users \
  -H "Authorization: Bearer <recovery-token>"

# Expected: List of recovery users excluding current user
```

## 🎯 Recovery User Role Clarification

### Current Understanding:
- **Recovery Parent (recovery)**: Should ONLY forward tasks, NOT complete them
- **Recovery Child (recovery_user)**: Should complete actual recovery tasks

### Needed Changes:
1. **Prevent recovery parent from completing tasks** in npa-detail page
2. **Only show Forward option** to recovery parent
3. **Allow completion** only for recovery child users

## 🚀 Quick Test

1. **Rebuild Angular app**: `ng serve`
2. **Login as recovery**: Check for debug message
3. **If debug shows**: Forward button should appear
4. **Test forward**: Click forward → select recovery_user → forward

## 📱 Expected UI

**For recovery parent (recovery):**
```
User Type: RECOVERY
Task Name: DRAFT 13(2)
Action: [View] [Forward] ← Only these two buttons
```

**For recovery child (recovery_user):**
```
User Type: RECOVERY  
Task Name: DRAFT 13(2)
Action: [View] [Complete] ← Should be able to complete
```

Let me know what you see in the debug messages! 🔍
