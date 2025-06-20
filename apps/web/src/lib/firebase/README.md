# Firebase Configuration

## Email Link Authentication Setup

1. **Enable Email/Password Provider in Firebase Console:**
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Enable "Email link (passwordless sign-in)"

2. **Add Authorized Domains:**
   - In Firebase Console > Authentication > Settings > Authorized domains
   - Add your development domain: `localhost`
   - Add your production domain when deploying

3. **Configure Dynamic Links (if needed):**
   - The URL in actionCodeSettings must be whitelisted
   - For development: `http://localhost:5173/auth/verify` or `http://localhost:5174/auth/verify`
   - For production: `https://yourdomain.com/auth/verify`

## Testing Email Links Locally

When testing locally, Firebase email links will redirect to your localhost URL. Make sure:
1. You're using the same browser where you initiated the sign-in
2. The email is saved in localStorage (check DevTools > Application > Local Storage)
3. The domain in the email link matches your current development server

## Troubleshooting

- If you get "Invalid login link" errors, check that the URL domain matches
- If email is missing from localStorage, it might be a different browser/incognito mode
- Check Firebase Console > Authentication > Users to see if accounts are being created