# Role-Based Dashboard Integration Guide

## Overview
This document explains the role-based dashboard system set up for the Community Health AI Assistant application. The system supports three user roles: CHW (Community Health Worker), Supervisor, and Facility.

## Architecture

### User Context System
- **Location**: `src/context/UserContext.jsx`
- **Purpose**: Manages global user authentication state
- **Features**:
  - Stores user data (id, name, email, role)
  - Persists user data to localStorage
  - Provides `useUser()` hook for components to access user data

### Role-Based Routing
- **Location**: `src/components/auth/RoleProtectedRoute.jsx`
- **Purpose**: Protects routes based on user role
- **Behavior**: 
  - Shows loading spinner while checking auth
  - Redirects unauthenticated users to `/login`
  - Redirects users trying to access wrong role to their own dashboard
  - Allows users with correct role to access the page

### Dashboard Pages
Three independent role-specific dashboards:

1. **CHW Page** (`/chw`)
   - Path: `src/pages/CHWPage.jsx`
   - Components: Dashboard, Live Map, Settings
   - Role Required: `CHW`

2. **Supervisor Page** (`/supervisor`)
   - Path: `src/pages/SupervisorPage.jsx`
   - Components: Dashboard, Live Map, Settings
   - Role Required: `Supervisor`

3. **Facility Page** (`/facility`)
   - Path: `src/pages/FacilityPage.jsx`
   - Components: Dashboard, Live Map, Settings
   - Role Required: `Facility`

## Integration with Login System

### How to Integrate Your Login Page

After successful authentication in your login form, use the `useUser()` hook:

```javascript
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      // Make API call to authenticate
      const response = await api.post('/login', { email, password });
      
      // Extract user data from response
      const userData = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role, // Must be: "CHW", "Supervisor", or "Facility"
      };

      // Set user in context (saves to localStorage)
      login(userData);

      // Redirect based on role
      const dashboardRoutes = {
        CHW: '/chw',
        Supervisor: '/supervisor',
        Facility: '/facility',
      };
      
      navigate(dashboardRoutes[userData.role]);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // Your login form JSX
  );
}
```

### Expected User Data Structure
```javascript
{
  id: number,           // User ID from database
  name: string,         // User's full name
  email: string,        // User's email
  role: string,         // ONE OF: "CHW", "Supervisor", "Facility"
  // Add any other fields your app needs
}
```

## Component Usage

### Using useUser Hook in Components
```javascript
import { useUser } from '../context/UserContext';

function MyComponent() {
  const { user, logout, updateUser } = useUser();

  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      Welcome, {user.name}!
      Your role: {user.role}
    </div>
  );
}
```

### Accessing User Info in TopBar
The TopBar automatically displays the user's role:
```javascript
<TopBar role={user.role} userName={user.name} />
```

## Sidebar Navigation

The sidebar automatically shows only relevant tabs based on the user's role:

- **CHW Role**: Dashboard, Live Map, Settings
- **Supervisor Role**: Dashboard, Live Map, Settings  
- **Facility Role**: Dashboard, Live Map, Settings

Tab switching is handled internally by each page component.

## Development Testing

### Quick Testing with TestUserSwitcher

For development/testing purposes, you can use the `TestUserSwitcher` component:

```javascript
// In App.tsx or any testing page:
import TestUserSwitcher from './utils/TestUserSwitcher';

function App() {
  return (
    <UserProvider>
      <TestUserSwitcher /> {/* Floating test panel appears at bottom-right */}
      <Routes>
        {/* Routes here */}
      </Routes>
    </UserProvider>
  );
}
```

This creates a floating control panel with buttons to instantly login as different roles.

## Logout Flow

To implement logout functionality:

```javascript
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears user data from context and localStorage
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

The logout button in the sidebar's LogOut icon can be hooked up similarly.

## File Structure
```
frontend/src/
├── pages/
│   ├── CHWPage.jsx          (CHW Dashboard)
│   ├── SupervisorPage.jsx   (Supervisor Dashboard)
│   └── FacilityPage.jsx     (Facility Dashboard)
├── context/
│   └── UserContext.jsx      (User state management)
├── components/
│   ├── auth/
│   │   └── RoleProtectedRoute.jsx  (Role-based route protection)
│   ├── topbar.jsx           (Updated for dynamic role)
│   ├── ui/
│   │   └── sidebar.jsx      (Updated for role-specific menus)
│   └── ... (other components)
├── utils/
│   └── TestUserSwitcher.jsx (Development testing utility)
└── App.tsx                  (Updated with role-based routing)
```

## Routes Summary

| Route | Page | Role Required | Description |
|-------|------|---------------|-------------|
| `/` | WelcomePage | None | Loading/Welcome screen |
| `/login` | LoginPage | None | User login form |
| `/chw` | CHWPage | CHW | Community Health Worker dashboard |
| `/supervisor` | SupervisorPage | Supervisor | Supervisor dashboard |
| `/facility` | FacilityPage | Facility | Facility manager dashboard |

## Common Issues & Solutions

### Issue: Page shows loading spinner infinitely
**Solution**: Make sure UserProvider wraps your entire app in `App.tsx`

### Issue: Users are redirected to wrong page after login
**Solution**: Verify the role string matches exactly: "CHW", "Supervisor", or "Facility"

### Issue: User data lost after page refresh
**Solution**: User data is automatically saved to localStorage. Check browser dev tools Storage tab.

### Issue: Users can access other roles' pages
**Solution**: Verify RoleProtectedRoute is properly wrapping the routes in App.tsx

## Next Steps
1. Update your LoginPage.jsx to use `useUser()` hook
2. Remove TestUserSwitcher from App.tsx once login is integrated
3. Hook up the LogOut button in sidebar.jsx to call logout function
4. Test the complete flow with your authentication API
