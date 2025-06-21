## Database Design

### Users

| COLUMN     | TYPE                |
| ---------- | ------------------- |
| id         | INTEGER PK          |
| first_name | varchar(50)         |
| last_name  | varchar(50)         |
| username   | varchar(100) unique |
| is_member  | BOOLEAN             |
| password   | varchar(255)        |

### Messages

| COLUMN       | TYPE         |
| ------------ | ------------ |
| id           | INTEGER PK   |
| title        | varchar(255) |
| created_at   | timestamp    |
| message_text | TEXT         |
| user_id      | Users.id FK  |
