# PocketBase MCP Server
A very much in progress MCP server based off of the Dynamics one that I have been testing and refining. That provides sophisticated tools for interacting with PocketBase databases. This server enables advanced database operations, schema management, and data manipulation through the Model Context Protocol (MCP).

Here is a video of me using it: https://www.youtube.com/watch?v=ZuTIO3I7rTM&t=345s

## Why This And Not DynamicsEndpoints?
This has actually been tested on the latest version. Currently 26.1 of PocketBase and is built off of the type definitions in the JS-SDK and not the arbitrary and wrong definitions found in the Dynamics one. Many of the methods don't even work.

## Setup MCP Server Locally (Only Way Supported for Now)

To set up the MCP server locally, you'll need to configure it within your `cline_mcp_settings.json` or whatever you use (claude, cursor, the config looks identical you just need to find where it is stored) file. Here's how:

1.  **Locate your `cline_mcp_settings.json` file:** This file is usually located in your Cursor user settings directory. For example:
    `/Users/yourusername/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

2.  **Configure the server:** Add a new entry to the `mcpServers` object in your `cline_mcp_settings.json` file. The key should be a unique name for your server (e.g., "pocketbase-server"), and the value should be an object containing the server's configuration.

    ```json
    {
      "mcpServers": {
        "pocketbase-server": {
          "command": "node",
          "args": [
            "build/index.js"
          ],
          "env": {
            "POCKETBASE_URL": "http://127.0.0.1:8090",
            "POCKETBASE_ADMIN_EMAIL": "admin@example.com",
            "POCKETBASE_ADMIN_PASSWORD": "admin_password"
          },
          "disabled": false,
          "autoApprove": [
            "create_record",
            "create_collection"
          ]
        }
      }
    }
    ```

    *   **`command`**: The command to start the server (usually `node`).
    *   **`args`**: An array of arguments to pass to the command.  This should point to the compiled JavaScript file of your MCP server (e.g., `build/index.js`).  Make sure the path is correct.
    *   **`env`**: An object containing environment variables.
        *   **`POCKETBASE_URL`**:  The URL of your PocketBase instance.  This is *required*.
        *   **`POCKETBASE_ADMIN_EMAIL`**: The admin email for your PocketBase instance (optional, but needed for some operations).
        *   **`POCKETBASE_ADMIN_PASSWORD`**: The admin password for your PocketBase instance (optional, but needed for some operations).
    * **`disabled`**: Whether to disable to server on startup.
    * **`autoApprove`**: list of tools to auto approve.
    *   Adjust the values in the `env` object to match your PocketBase instance's settings.

- Setup in vscode is similar , find or create `.vscode/mcp.json` and add
```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "pocketbase-admin-email",
      "description": "PocketBase Admin Email",
      "password": false
    },
    {
      "type": "promptString", 
      "id": "pocketbase-admin-password",
      "description": "PocketBase Admin Password",
      "password": true
    }
  ],
  "servers": {
    "pocketbaseServer": {
      "type": "stdio",
      "command": "node",
      // replace this with the path to your compiled MCP server (git clone the repo and run `npm run build` to compile)
      "args": ["~/Desktop/code/mcp/pocketbase-mcp/build/index.js"],
      "env": {
        "POCKETBASE_URL": "http://127.0.0.1:8090",
        "POCKETBASE_ADMIN_EMAIL": "${input:pocketbase-admin-email}",
        "POCKETBASE_ADMIN_PASSWORD": "${input:pocketbase-admin-password}"
      }
    }
  }
}
```

1.  **Start the server:** After configuring the `cline_mcp_settings.json` file, you can start using the MCP server with the configured tools.

## Features

### Collection Management
- Create and manage collections with custom schemas
- Retrieve collection schemas and metadata

### Record Operations
- CRUD operations for records
- Relationship expansion support
- Pagination and cursor-based navigation

### User Management
- User authentication and token management
- User account creation and management
- Password management

### Database Operations
- Database backup

## Available Tools

### Collection Management
- `create_collection`: Create a new collection with custom schema
- `get_collection`: Get schema details for a collection

### Record Operations
- `create_record`: Create a new record in a collection
- `list_records`: List records with optional filters and pagination
- `update_record`: Update an existing record
- `delete_record`: Delete a record

### User Management
- `authenticate_user`: Authenticate a user and get auth token
- `create_user`: Create a new user account

### Database Operations
- `backup_database`: Create a backup of the PocketBase database with format options

## Configuration

The server requires the following environment variables:

- `POCKETBASE_URL`: URL of your PocketBase instance (e.g., "http://127.0.0.1:8090")

Optional environment variables:
- `POCKETBASE_ADMIN_EMAIL`: Admin email for certain operations
- `POCKETBASE_ADMIN_PASSWORD`: Admin password
- `POCKETBASE_DATA_DIR`: Custom data directory path

## Usage Examples
```typescript
// Create a new collection
await mcp.use_tool("pocketbase", "create_collection", {
  name: "posts",
  schema: [
    {
      name: "title",
      type: "text",
      required: true
    },
    {
      name: "content",
      type: "text",
      required: true
    }
  ]
});

// Authenticate with password
await mcp.use_tool("pocketbase", "authenticate_user", {
  email: "user@example.com",
  password: "securepassword",
  collection: "users"
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
