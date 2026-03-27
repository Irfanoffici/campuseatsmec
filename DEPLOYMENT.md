# Deploying Firestore Security Rules

## Prerequisites
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project: `campuseatsmec-53c10`

## Steps to Deploy

### 1. Login to Firebase
```bash
firebase login
```

### 2. Initialize Firebase (if not already done)
```bash
firebase init firestore
```
- Select your project: `campuseatsmec-53c10`
- Use existing `firestore.rules` file
- Skip creating indexes file (or use default)

### 3. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### 4. Verify Deployment
- Go to [Firebase Console](https://console.firebase.google.com/project/campuseatsmec-53c10/firestore/rules)
- Check that rules are updated with timestamp

## Alternative: Manual Deployment
1. Go to Firebase Console → Firestore Database → Rules
2. Copy contents from `firestore.rules`
3. Paste into the rules editor
4. Click "Publish"

## Testing Rules
After deployment, test the rules:
```bash
firebase emulators:start --only firestore
```

## Important Notes
- Rules are deployed globally and take effect immediately
- Always test rules before deploying to production
- Keep `firestore.rules` file in version control
