# Django Backend API Contract for Nova Suite

This document defines the API contract the frontend expects from the Django backend for the dashboard experience.

Base URL:

```text
http://localhost:8000/api
```

Frontend helper used by the app:

```ts
const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")
return `${baseUrl}/${path.replace(/^\/+/, "")}`
```

---

## 1. Auth and tenancy

### Login

Endpoint:

```http
POST /api/auth/login/
```

Request:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Response:

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

### Register

Endpoint:

```http
POST /api/auth/register/
```

Request:

```json
{
  "email": "newuser@example.com",
  "password": "secret123",
  "first_name": "Jane",
  "last_name": "Doe",
  "tenant_name": "Nova Studio"
}
```

Response:

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

### Current user

Endpoint:

```http
GET /api/auth/user/
```

Response:

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

### Refresh and logout

```http
POST /api/auth/refresh/
POST /api/auth/logout/
```

---

## 2. Projects

### List projects

Endpoint:

```http
GET /api/auth/projects/
```

Expected data:

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

Alternative wrapped response:

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

### Create project

Endpoint:

```http
POST /api/auth/projects/
```

Request:

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

### Update project

Endpoint:

```http
PATCH /api/auth/projects/{id}/
```

Body:

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

### Delete project

```http
DELETE /api/auth/projects/{id}/
```

Supported statuses:

- `planning`
- `in_progress`
- `completed`
- `on_hold`

Suggested model:

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

## 3. Tasks

### List tasks

Endpoint:

```http
GET /api/auth/tasks/
```

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

### Create task

Endpoint:

```http
POST /api/auth/tasks/
```

Request body:

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

### Update task

Endpoint:

```http
PATCH /api/auth/tasks/{id}/
```

Body:

```json
{
  "id": 1,
  "title": "Updated task title",
  "status": "in_progress",
  "priority": "medium",
  "due_date": "2026-10-25"
}
```

### Delete task

Endpoint:

```http
DELETE /api/auth/tasks/{id}/
```

Supported task values:

Status:

- `todo`
- `in_progress`
- `in_review`
- `done`

Priority:

- `critical`
- `high`
- `medium`
- `low`

Suggested model:

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

## 4. Email and assistant messages

The UI includes an executive assistant message feed and email provider settings.

### Email provider connection

Suggested endpoints:

```http
GET /api/auth/email/providers/
POST /api/auth/email/providers/connect/
POST /api/auth/email/providers/disconnect/
```

Example payload:

```json
{
  "provider": "gmail",
  "email": "eduardo@novasuite.io",
  "is_connected": true,
  "connected_at": "2026-10-17T08:00:00Z"
}
```

### Messages

Suggested endpoints:

```http
GET /api/auth/messages/
POST /api/auth/messages/
POST /api/auth/messages/send/
```

Message object example:

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

Suggested model:

```python
class Message(models.Model):
    CHANNEL_CHOICES = [("email", "Email"), ("system", "System")]
    DIRECTION_CHOICES = [("inbound", "Inbound"), ("outbound", "Outbound"), ("internal", "Internal")]
    STATUS_CHOICES = [("delivered", "Delivered"), ("pending", "Pending"), ("resolved", "Resolved")]

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

## 5. Calendar

### Calendar connection state

Expected payload:

```json
{
  "isConnected": true,
  "provider": "google",
  "email": "eduardo@novasuite.io",
  "connectedAt": "2026-10-17T08:30:00Z"
}
```

Suggested endpoints:

```http
GET /api/auth/calendar/connection/
POST /api/auth/calendar/connect/
POST /api/auth/calendar/disconnect/
```

### Calendar events

Event example:

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

```http
GET /api/auth/calendar/events/
POST /api/auth/calendar/events/
PATCH /api/auth/calendar/events/{id}/
DELETE /api/auth/calendar/events/{id}/
```

Suggested model:

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

## 6. User settings and preferences

The settings page is storing local preferences and is clearly intended to become Django-backed.

Suggested endpoints:

```http
GET /api/auth/settings/
PATCH /api/auth/settings/
```

Example payload:

```json
{
  "timezone": "America/Los_Angeles (Pacific Time)",
  "briefingTime": "08:00",
  "assistantTone": "concise",
  "urgentEmailAlerts": true,
  "dailyBriefingEmail": true,
  "calendarWarnings": true,
  "taskScoreUpdates": false,
  "autoParseTasks": true,
  "draftReplies": true,
  "trackDeadlines": true
}
```

---

## 7. Recommended Django model baseline

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

## 8. Minimum backend checklist

Your Django app should support:

- user registration with `tenant_name`
- JWT login and refresh flow
- authenticated project CRUD
- authenticated task CRUD
- current user details
- settings persistence
- email provider connection storage
- message feed persistence
- calendar connection and event persistence
- tenant-based filtering for all records

---

## 9. Recommended implementation order

1. Users and tenants
2. Authentication and JWT
3. Projects and tasks
4. User settings
5. Email and message infrastructure
6. Calendar connection and events
7. Replace remaining localStorage placeholders with API calls

This is the clean backend contract to match the current UI and dashboard flow.
