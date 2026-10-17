# Nova Suite Frontend API Contract for Django Backend

For the full backend contract and expected API payloads, see [docs/django-backend-api-contract.md](docs/django-backend-api-contract.md).

This project is a Next.js dashboard app for a personal executive assistant product. The frontend expects a Django backend to provide the API surface below.

The current frontend is configured to call Django through:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

The frontend then calls endpoints like:

- `/api/auth/login/`
- `/api/auth/register/`
- `/api/auth/projects/`
- `/api/auth/tasks/`
- `/api/auth/user/`

This document captures the expected API contract based on the dashboard, cached data hooks, and placeholder flows currently in the app.

---

## 1. Core backend assumptions

### Auth and tenancy

The app is designed around a single-tenant or multi-tenant workspace model where each user belongs to a tenant/workspace.

Expected auth payload:

```json
{
  "access": "jwt-access-token",
  "refresh": "jwt-refresh-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "Eduardo",
    "last_name": "Fajardo",
    "role": "admin",
    "tenant_name": "Nova Studio",
    "tenant_slug": "nova-studio"
  }
}
```

Required Django user fields for frontend compatibility:

- `id`
- `email`
- `first_name`
- `last_name`
- `role`
- `tenant_name` or `tenant_slug`
- `date_joined`
- `last_login`

### Base URL convention

Frontend helper used by the app:

```ts
const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")
return `${baseUrl}/${path.replace(/^\/+/, "")}`
```

So the backend should expose endpoints under:

```text
http://localhost:8000/api/...
```

---

## 2. Auth endpoints

### 2.1 POST `/api/auth/login/`

Used by login form.

Request body:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Expected success response:

```json
{
  "access": "string",
  "refresh": "string",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "Eduardo",
    "last_name": "Fajardo",
    "role": "admin",
    "tenant_name": "Nova Studio",
    "tenant_slug": "nova-studio"
  }
}
```

### 2.2 POST `/api/auth/register/`

Used by onboarding/registration.

Request body:

```json
{
  "email": "newuser@example.com",
  "password": "secret123",
  "first_name": "Jane",
  "last_name": "Doe",
  "tenant_name": "Nova Studio"
}
```

Important: the frontend sends `tenant_name`, not just an email and password.

Expected response:

```json
{
  "id": 1,
  "email": "newuser@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "tenant_name": "Nova Studio",
  "role": "member"
}
```

### 2.3 GET `/api/auth/user/`

Returns the current authenticated user profile.

Expected response:

```json
{
  "id": 1,
  "first_name": "Eduardo",
  "last_name": "Fajardo",
  "email": "eduardo@novasuite.io",
  "role": "admin",
  "tenant_name": "Nova Studio",
  "tenant_slug": "nova-studio"
}
```

### 2.4 POST `/api/auth/refresh/`

Refresh token endpoint.

### 2.5 POST `/api/auth/logout/`

Logout endpoint.

---

## 3. Project endpoints

The frontend expects project records to include a visible title and status, with editing and filtering support.

### 3.1 GET `/api/auth/projects/`

Returns a list of projects for the current user/tenant.

Expected response shape:

```json
[
  {
    "id": 1,
    "title": "Q4 Marketing Campaign",
    "projectName": "Q4 Marketing Campaign",
    "name": "Q4 Marketing Campaign",
    "description": "Launch plan for Q4 growth campaign.",
    "status": "in_progress",
    "due_date": "2026-11-15",
    "last_updated": 1725000000000
  }
]
```

Or wrapped response:

```json
{
  "projects": [
    {
      "id": 1,
      "title": "Q4 Marketing Campaign",
      "description": "Launch plan for Q4 growth campaign.",
      "status": "in_progress",
      "due_date": "2026-11-15"
    }
  ]
}
```

### 3.2 POST `/api/auth/projects/`

Request body:

```json
{
  "projectName": "New Project",
  "description": "High-level project summary",
  "status": "planning"
}
```

Expected response:

```json
{
  "id": 12,
  "projectName": "New Project",
  "title": "New Project",
  "description": "High-level project summary",
  "status": "planning"
}
```

### 3.3 PATCH `/api/auth/projects/{id}/`

Update project details.

Example body:

```json
{
  "id": 12,
  "title": "Updated Project",
  "projectName": "Updated Project",
  "description": "New description",
  "status": "completed",
  "due_date": "2026-10-30"
}
```

### 3.4 DELETE `/api/auth/projects/{id}/`

Optional but recommended.

Project status values currently used by the frontend:

- `planning`
- `in_progress`
- `completed`
- `on_hold`

Django model suggestion:

```python
class Project(models.Model):
    STATUS_CHOICES = [
        ("planning", "Planning"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("on_hold", "On Hold"),
    ]

    tenant = models.ForeignKey("Tenant", on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planning")
    due_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

---

## 4. Task endpoints

The task model is central to the dashboard and task board.

### 4.1 GET `/api/auth/tasks/`

Expected response:

```json
[
  {
    "id": 1,
    "title": "Reply to client email",
    "description": "Follow up with the Q4 client review",
    "status": "todo",
    "priority": "high",
    "confidence": 0.87,
    "reasoning": "This task directly impacts the active client milestone.",
    "tags": ["client", "email"],
    "due_date": "2026-10-18",
    "project": 1
  }
]
```

Or wrapped:

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Reply to client email",
      "status": "todo",
      "priority": "high",
      "project": 1
    }
  ]
}
```

### 4.2 POST `/api/auth/tasks/`

Request body currently used by frontend:

```json
{
  "title": "Follow up on contract review",
  "status": "todo",
  "selectedProjectId": 1,
  "tags": ["legal", "follow-up"],
  "dueDate": "2026-10-21",
  "description": "Send final contract notes to legal.",
  "attachment": null
}
```

Django should accept and store equivalent values.

### 4.3 PATCH `/api/auth/tasks/{id}/`

Example update:

```json
{
  "id": 1,
  "title": "Updated task title",
  "status": "in_progress",
  "priority": "medium",
  "due_date": "2026-10-25"
}
```

### 4.4 DELETE `/api/auth/tasks/{id}/`

Task status values currently used:

- `todo`
- `in_progress`
- `in_review`
- `done`

Task priority values currently used:

- `critical`
- `high`
- `medium`
- `low`

Django model suggestion:

```python
class Task(models.Model):
    STATUS_CHOICES = [
        ("todo", "To Do"),
        ("in_progress", "In Progress"),
        ("in_review", "In Review"),
        ("done", "Done"),
    ]

    PRIORITY_CHOICES = [
        ("critical", "Critical"),
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]

    tenant = models.ForeignKey("Tenant", on_delete=models.CASCADE, related_name="tasks")
    project = models.ForeignKey("Project", on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="todo")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="medium")
    confidence = models.FloatField(default=0.0)
    reasoning = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    due_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

---

## 5. Email and message endpoints

The dashboard includes email provider settings and a message inbox stream. These are not fully wired yet but there are clear placeholders and expected data contracts.

### 5.1 Email provider connection settings

UI expects these settings:

- provider: `gmail` or `microsoft`
- email: connected mailbox address
- connectedAt: timestamp
- isConnected: boolean

Suggested API endpoints:

- `GET /api/auth/email/providers/`
- `POST /api/auth/email/providers/connect/`
- `POST /api/auth/email/providers/disconnect/`

Example payload:

```json
{
  "provider": "gmail",
  "email": "eduardo@novasuite.io",
  "is_connected": true,
  "connected_at": "2026-10-17T08:00:00Z"
}
```

### 5.2 Messages / executive assistant stream

The frontend defines a message object like:

```json
{
  "id": "msg-1",
  "channel": "email",
  "direction": "outbound",
  "sender": "Nova Executive Assistant",
  "recipient": "eduardo@novasuite.io",
  "subject": "Daily Executive Briefing & Calendar Review",
  "content": "Good morning Eduardo...",
  "aiAction": "Synthesized morning agenda & queued email briefing",
  "timestamp": "8:30 AM",
  "status": "delivered"
}
```

Suggested endpoints:

- `GET /api/auth/messages/`
- `POST /api/auth/messages/`
- `POST /api/auth/messages/send/`
- `GET /api/auth/messages?channel=email`

Suggested Django model:

```python
class Message(models.Model):
    CHANNEL_CHOICES = [
        ("email", "Email"),
        ("system", "System"),
    ]
    DIRECTION_CHOICES = [
        ("inbound", "Inbound"),
        ("outbound", "Outbound"),
        ("internal", "Internal"),
    ]
    STATUS_CHOICES = [
        ("delivered", "Delivered"),
        ("pending", "Pending"),
        ("resolved", "Resolved"),
    ]

    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="messages")
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default="email")
    direction = models.CharField(max_length=20, choices=DIRECTION_CHOICES, default="inbound")
    sender = models.CharField(max_length=255)
    recipient = models.CharField(max_length=255)
    subject = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    ai_action = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="delivered")
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## 6. Calendar endpoints

The calendar page contains a sample schedule and also includes localStorage state for connection status. This indicates you will eventually need real calendar integration.

### 6.1 Calendar connection state

Frontend expects these properties:

```json
{
  "isConnected": true,
  "provider": "google",
  "email": "eduardo@novasuite.io",
  "connectedAt": "2026-10-17T08:30:00Z"
}
```

Suggested endpoints:

- `GET /api/auth/calendar/connection/`
- `POST /api/auth/calendar/connect/`
- `POST /api/auth/calendar/disconnect/`

### 6.2 Calendar events

There is a `CalendarEvent` shape in the page:

```json
{
  "id": "evt-1",
  "title": "Executive Team Sync & Weekly Standup",
  "startTime": "9:00 AM",
  "endTime": "9:45 AM",
  "startHour": 9,
  "durationHours": 0.75,
  "type": "meeting",
  "location": "Google Meet",
  "attendees": ["Sarah Jenkins", "Marcus Chen", "Alex Rivera"],
  "assistantBrief": "Assistant note: Review Q3 product backlog before this call.",
  "hasConflict": false
}
```

Suggested endpoints:

- `GET /api/auth/calendar/events/`
- `POST /api/auth/calendar/events/`
- `PATCH /api/auth/calendar/events/{id}/`
- `DELETE /api/auth/calendar/events/{id}/`

Suggested Django model:

```python
class CalendarEvent(models.Model):
    TYPE_CHOICES = [
        ("meeting", "Meeting"),
        ("focus", "Focus"),
        ("review", "Review"),
        ("personal", "Personal"),
    ]

    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="calendar_events")
    provider = models.CharField(max_length=50, default="google")
    title = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True, null=True)
    attendees = models.JSONField(default=list, blank=True)
    assistant_brief = models.TextField(blank=True, null=True)
    event_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="meeting")
    external_event_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## 7. Settings and preference endpoints

The settings page saves information locally for now but is clearly meant to eventually be persisted in Django.

### 7.1 User profile update

Expected route:

- `PUT /api/auth/user/` or `PATCH /api/auth/user/`

Body:

```json
{
  "first_name": "Eduardo",
  "last_name": "Fajardo",
  "email": "eduardo@novasuite.io",
  "timezone": "America/Los_Angeles",
  "assistant_tone": "concise",
  "briefing_time": "08:00"
}
```

### 7.2 Notification / assistant preferences

Expected fields:

```json
{
  "urgentEmailAlerts": true,
  "dailyBriefingEmail": true,
  "calendarWarnings": true,
  "taskScoreUpdates": false,
  "autoParseTasks": true,
  "draftReplies": true,
  "trackDeadlines": true,
  "timezone": "America/Los_Angeles (Pacific Time)",
  "briefingTime": "08:00",
  "assistantTone": "concise"
}
```

Suggested endpoints:

- `GET /api/auth/settings/`
- `PATCH /api/auth/settings/`

---

## 8. Dashboard data summary contract

The main dashboard expects aggregated data from these collections:

- current user profile
- all projects for user tenant
- all tasks for user tenant
- active/in-progress project count
- pending task count
- critical task count
- assistant message stream
- calendar connection state
- email provider state

This means the backend should support fast queries like:

```python
Project.objects.filter(tenant=user.tenant)
Task.objects.filter(tenant=user.tenant)
Message.objects.filter(user=user)
CalendarEvent.objects.filter(user=user)
```

---

## 9. Recommended Django model setup

Use these core models:

```python
class Tenant(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


class User(AbstractUser):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="users", null=True, blank=True)
    role = models.CharField(max_length=30, default="member")
    timezone = models.CharField(max_length=100, default="UTC")
    assistant_tone = models.CharField(max_length=20, default="concise")
    briefing_time = models.TimeField(blank=True, null=True)
```

Then add:

- `Project`
- `Task`
- `Message`
- `CalendarEvent`
- `EmailProviderConnection`
- `UserSettings`

---

## 10. Important implementation notes

1. The frontend is still using placeholder/localStorage flows in the calendar, settings, and assistant panels. Those should be replaced with real Django-backed API calls as the backend matures.
2. The app currently expects project/task names to be exposed in multiple field aliases: `title`, `projectName`, `name`.
3. Keep the status values consistent with the UI choices shown above.
4. The frontend calls the Django API using the `Authorization: Bearer <token>` pattern for protected endpoints.
5. Use one consistent API base: `http://localhost:8000/api`.

---

## 11. Minimum backend checklist

Before integrating fully, make sure your Django backend can support:

- user registration with `tenant_name`
- JWT login and refresh flow
- authenticated project CRUD
- authenticated task CRUD
- authenticated user settings endpoint
- email provider connection storage
- assistant messages storage
- calendar connection + event CRUD
- tenant-based filtering for all records

This will cover the dashboard pages for:

- Dashboard overview
- Project management
- Tasks board
- Calendar
- Settings
- Executive assistant inbox

---

## 12. Suggested next steps

1. Create the `Tenant`, `Project`, `Task`, and `User` models first.
2. Add auth endpoints for register/login/user.
3. Add project and task API endpoints exactly matching the frontend JSON keys.
4. Add email/calendar/message models and endpoints as phase 2.
5. Replace localStorage placeholders with real backend persistence.

This README is the contract to use while you wire up the Django database layer.
